import React, { Component } from 'react';
import { AsyncStorage, SafeAreaView, StatusBar, FlatList, ScrollView, StyleSheet, View, Text, RefreshControl } from 'react-native';
import NotaInput from '../components/NotaInput'
import { Cache } from "react-native-cache";
import firebase from 'react-native-firebase';

import colors from '../colors';
import NotasItem from '../components/NotasItem';

import ApiUtem from '../ApiUtem';

var apiUtem = new ApiUtem();
var cache = new Cache({
    namespace: "estudiantes",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
});

/*
{
    finalApi: null,
    finalCalc: null,
    examen1Api: null,
    examen1Calc: null,
    examen2Api: null,
    examen2Calc: null,
    presentacionApi: null,
    presentacionCalc: null,
    notasApi: null,
    notasCalc: null,
    estaCalculando: false,
    estaActualizando: false
}

*/

export default class NotasScreen extends Component {
    constructor(props) {
        super(props);
        firebase.analytics().setCurrentScreen("NotasScreen", "NotasScreen");
        const seccion = this.props.navigation.getParam("seccion");
        this.state = this._setStateInicial(seccion);
    }

    _setStateInicial = (seccion) => {
        return {
            observacionApi: seccion.notas.observacion,
            finalApi: seccion.notas.final, // TODO: Cambiar por notas.final
            finalCalc: this._calcularNotaFinal(seccion.notas.final, seccion.notas.presentacion, seccion.notas.examenes[0]),
            examen1Api: seccion.notas.examenes[0],
            examen1Input: null,
            examen2Api: seccion.notas.examenes[1],
            examen2Input: null,
            presentacionApi: seccion.notas.presentacion,
            presentacionCalc: this._calcularPresentacion(seccion.notas.parciales), // TODO: Cambiar por notas.parciales
            notasApi: seccion.notas.parciales.slice(), // TODO: Cambiar por notas.parciales
            notasInputs: seccion.notas.parciales.slice(), // TODO: Cambiar por notas.parciales
            estaCalculando: false,
            estaActualizando: false
        }
    }

    _calcularPresentacion(notas) {
        var notaFinal = 0;

        notas.forEach(nota => {
            if (nota.ponderador) {
                notaFinal += (nota.nota * nota.ponderador);
            }
        })
        return notaFinal;
    }

    _notaAFloat = (nota) => {
        if (nota) {
            var nuevaNota = nota;
            if (typeof(nota) === "string") {
                nuevaNota = parseFloat(nota).toFixed(1);
                nuevaNota = parseFloat(nuevaNota);
                return nuevaNota;
            } else if (typeof(nota) === "number") {
                nuevaNota = nota.toFixed(1);
                nuevaNota = parseFloat(nuevaNota);
                return nuevaNota;
            }
        }
        return nota;
        
    }

    _notaAString = (nota) => {
        var nuevaNota;
        if (nota) {
            if (typeof(nota) == "string") {
                nuevaNota = parseFloat(nota).toFixed(1);
            } else if (typeof(nota) == "number") {
                nuevaNota = nota.toFixed(1);
            } else {
                nuevaNota = nota.toString();
            }
        } else {
            nuevaNota = '';
        }
        return nuevaNota;
    }

    _calcularNotaFinal(finalApi, presentacion, examen1) {
        finalApi = this._notaAFloat(finalApi);
        presentacion = this._notaAFloat(presentacion);
        examen1 = this._notaAFloat(examen1);

        /*if (finalApi) {
            return finalApi;
        } else {*/
            if (presentacion < 4 && presentacion >= 3) {
                if (examen1 == null || examen1 == "") {
                    return presentacion;
                }
                var resultado = (presentacion * 0.6) + (examen1 * 0.4);
                resultado = this._notaAFloat(resultado);
                return resultado;
            } else {
                return presentacion;
            }
        //}
    }

    _getEstado = (estado) => {
        var nuevoEstado = estado;
        if (estado == "I") {
            nuevoEstado = "Inscrito";
        } else if (estado == "A") {
            nuevoEstado = "Aprobado";
        } else if (estado == "R") {
            nuevoEstado = "Reprobado";
        }
        return nuevoEstado;
    }

    _modificaNota = (i, nuevaNota, nuevoPonderador) => {
        firebase.analytics().logEvent("calcula_nota");
        nuevaNota = this._notaAFloat(nuevaNota);

        let notasInputs = [ ...this.state.notasInputs ];
        notasInputs[i] = {...notasInputs[i], nota: nuevaNota};
        this.setState({ notasInputs });

        const nuevaPresentacion = this._calcularPresentacion(notasInputs);
        const examen1Habilitado = this._examen1Habilitado(this.state.examen1Api, this.state.examen1Input, nuevaPresentacion, true);
        
        var examen1Nuevo = examen1Habilitado ? this.state.examen1Input : null;
        this.setState({
            examen1Input: examen1Nuevo,
            finalCalc: this._calcularNotaFinal(this.state.finalApi, nuevaPresentacion, examen1Nuevo),
            presentacionCalc: nuevaPresentacion
        });
    }

    _modificaExamen = (i, nuevaNota) => {
        firebase.analytics().logEvent("calcula_examen");
        nuevaNota = this._notaAFloat(nuevaNota);
        if (i == 1) {
            this.setState({
                examen2Input: nuevaNota,
                finalCalc: this._calcularNotaFinal(this.state.finalApi, this.state.presentacionCalc, nuevaNota)
            });
        } else {
            this.setState({
                examen1Input: nuevaNota == "" ? null : nuevaNota,
                finalCalc: this._calcularNotaFinal(this.state.finalApi, this.state.presentacionCalc, nuevaNota)
            });
        }
        
    }

    _examen1Habilitado = (examen1Api, examen1Calc, presentacion, seModificoNota) => {
        presentacion = this._notaAFloat(presentacion);
        
        if (examen1Api == null) {
            if (seModificoNota) {
                if (presentacion && presentacion < 4 && presentacion >= 3) {
                    return true;
                }
            } else {
                if (examen1Calc || (presentacion && presentacion < 4 && presentacion >= 3)) {
                    return true;
                }
            }
        }
        return false;
        
    }

    _getNotas = async (forzarApi) => {
        const navigation = this.props.navigation;
        const rut = await AsyncStorage.getItem('rut');
        const {id, nombre} = navigation.getParam("asignatura");
        const tipo = navigation.getParam("tipo");
        const seccion = navigation.getParam("seccionNumero")
        const key = rut + 'asignaturas' + id + 'notas-' + tipo + '-' + seccion;
        
        cache.getItem(key, async (err, notasCache) => {
            if (forzarApi || err || !notasCache) {
                var notas = await apiUtem.getNotas(rut, id);
                notas = notas.find(seccion => seccion.tipo === tipo);

                cache.setItem(key, notas, (err) => {
                    if (err) console.error(err);
                    this.setState(this._setStateInicial(notas));
                });
            } else {
                this.setState(this._setStateInicial(notasCache));
            }
        });
    }

    _onRefresh = () => {
        this.setState({
            estaActualizando: true,
        });
        this._getNotas(true);
    }

    render () {
        var finalCalc = this._notaAString(this.state.finalCalc);
        
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.primarioOscuro} />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.estaActualizando}
                            colors={[colors.primario]}
                            onRefresh={this._onRefresh}/>
                    } >
                    <View style={[styles.rowContainer, styles.card]}>
                        <View style={styles.columnContainer}>
                            <View style={[styles.rowContainer, {alignSelf: 'flex-start'}]}>
                                <Text style={styles.item}>Examen:</Text>
                                <NotaInput
                                    onChangeText={(nuevoTexto) => this._modificaExamen(0, nuevoTexto)}
                                    editable={this._examen1Habilitado(this.state.examen1Api, this.state.examen1Input, this.state.presentacionCalc)}
                                    underlineColorAndroid={colors.material.grey['500']}
                                    style={styles.item}
                                    value={this.state.examen1Input} >
                                </NotaInput>
                                
                            </View>
                            
                            <View style={[styles.rowContainer, {alignSelf: 'flex-start'}]}>
                                <Text style={styles.item}>Presentacion:</Text>
                                <NotaInput
                                    editable={false}
                                    style={styles.item}
                                    value={this._notaAString(this.state.presentacionCalc)}>
                                </NotaInput>
                            </View>
                            
                        </View>

                        <View style={styles.columnContainer}>
                            <Text style={styles.finalTexto}>{finalCalc}{this.state.estaCalculando ? '*' : ''}</Text>
                            <Text style={styles.estadoTexto}>{this._getEstado(this.state.observacionApi)}</Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                    <FlatList
                        extraData={this.state}
                        data={this.state.notasInputs}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => {
                            return (
                                <NotasItem
                                    index={index}
                                    onChange={this._modificaNota}
                                    ponderador={item.ponderador}
                                    nota={item.nota}
                                    editable={this.state.notasApi[index].nota == null}
                                    etiqueta={item.tipo}/>
                            )
                        }}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.material.grey['200'],
        paddingVertical: 5,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    card: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5,
        elevation: 2,
        padding: 20
    },
    columnContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'center'
    },
    finalTexto: {
        fontSize: 60,
        fontWeight: 'bold'
    },
    estadoTexto: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    item: {
        alignItems: 'center',
        fontSize: 15
    }
})