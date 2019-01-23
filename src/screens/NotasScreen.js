import React, { Component } from 'react';
import { AsyncStorage, SafeAreaView, StatusBar, FlatList, ScrollView, StyleSheet, View, Text, RefreshControl } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Cache } from "react-native-cache";

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

export default class NotasScreen extends Component {
    constructor(props) {
        super(props);
        var seccion = this.props.navigation.getParam("seccion");
        var stateInicial = this._setStateInicial(seccion)
        this.state = {
            ...stateInicial,
            estaActualizando: false
        }
    }

    _setStateInicial = (seccion) => {
        var resultadoNotas = this._parseNotas(seccion.notas.notas);
        var presentacion = this._calcularPresentacion(resultadoNotas);
        var notaExamen;

        if(seccion.notas.examenes[0] == null){
            notaExamen = seccion.notas.examenes[1];
        } else{
            notaExamen = seccion.notas.examenes[0];
        }

        return {
            seccion: seccion,
            notas: resultadoNotas,
            presentacion: presentacion,
            examen: notaExamen,
            notaFinal: this._calcularNotaFinal(seccion, notaExamen, presentacion)
        }
    }

    _parseNotas(notas) {
        var listaDeNotas = [];

        notas.forEach(function(nota) {
            var tupla = [];
            tupla.push(nota.ponderador);
            
            if (nota.nota == null) {
                tupla.push(null);
                tupla.push(true);
            } else {
                tupla.push(nota.nota);
                tupla.push(false);
            }

            tupla.push(nota.tipo);

            listaDeNotas.push(tupla);
        })
        
        return listaDeNotas;
    }

    _calcularPresentacion(listaDeNotas) {
        var notaFinal = 0;

        listaDeNotas.forEach(function(elemento) {
            if (elemento[1] != null) {
                notaFinal = notaFinal + elemento[0] * elemento[1];
            }
        })
        return notaFinal.toFixed(1);
    }

    _calcularNotaFinal(seccion, notaExamen, notaPresentacion) {
        notaExamen = parseFloat(notaExamen) || null;
        notaPresentacion = parseFloat(notaPresentacion) || null;

        if (seccion.notas.nota != null) {
            return seccion.notas.nota;
        } else {
            notaPresentacion = parseFloat(notaPresentacion);
            notaPresentacion = parseFloat(notaPresentacion.toFixed(1));
            
            if(notaPresentacion < 4 && notaPresentacion >= 3) {
                if (notaExamen == null) {
                    return notaPresentacion;
                }
                var resultado = (notaPresentacion * 0.6) + (notaExamen * 0.4);
                resultado = resultado.toFixed(1);
                return resultado;
            } else {
                return notaPresentacion;
            }
        }
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

    _cambiarStates = (i, nota) => {
        var nuevaNota = parseFloat(nota) || null;
        if (nuevaNota > 7) {
            nuevaNota = 7;
        }
        if (i != null) {
            var lista = this.state.notas;

            lista[i][1] = nuevaNota;

            var presentacion = this._calcularPresentacion(lista);
            var examen = this._examenEstaHabilitado(this.state.examen, presentacion) ? this.state.examen : null
            this.setState({
                presentacion: presentacion,
                notaFinal: this._calcularNotaFinal(this.state.seccion, examen, presentacion),
                examen: examen
            });
        } else {
            this.setState({
                examen: nuevaNota,
                notaFinal: this._calcularNotaFinal(this.state.seccion, nuevaNota, this.state.presentacion)
            });
        }
    }
    _examenEstaHabilitado = (examen, presentacion) => {
        presentacion = parseFloat(presentacion) || null
        presentacion = parseFloat(presentacion.toFixed()) || null;
        console.log("examenInicial == null", examen, presentacion);
        if ((examen != null) || (presentacion && presentacion < 4 && presentacion >= 3)) {
            console.log("otro if", examen, presentacion);
            return true;
        }
        return false;
        
    }

    _getNotas = async (forzarApi) => {
        const navigation = this.props.navigation;
        const rut = await AsyncStorage.getItem('rut');
        const {id, nombre} = navigation.getParam("asignatura");
        const {tipo, seccion} = navigation.getParam("seccion");
        const key = rut + 'asignaturas' + id + 'notas-' + tipo + '-' + seccion;
        cache.getItem(key, async (err, notasCache) => {
            if (forzarApi || err || !notasCache) {
                var notas = await apiUtem.getNotas(rut, id);
                notas = notas.find(seccion => seccion.tipo === tipo);

                cache.setItem(key, notas, (err) => {
                    if (err) console.error(err);
                    this.setState({
                        ...this._setStateInicial(notas),
                        estaActualizando: false
                    });
                });
            } else {
                this.setState({
                    ...this._setStateInicial(notasCache),
                    estaActualizando: false
                });
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
        var seccion = this.state.seccion;

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
                            <View style={styles.rowContainer}>
                                <Text style={styles.item}>Examen:</Text>
                                <TextInput
                                    onChangeText={(nuevoTexto) => {
                                        const caracteres = '0123456789.';
                                        var textoLimpio = '';
            
                                        for (var j = 0; j < nuevoTexto.length; j++) {
                                            if (caracteres.indexOf(nuevoTexto[j]) > -1 ) {
                                                textoLimpio += nuevoTexto[j];
                                            }
                                        }
                                        this._cambiarStates(null, textoLimpio);
                                    }}
                                    editable={this._examenEstaHabilitado(seccion.notas.examenes[0], this.state.presentacion)}
                                    underlineColorAndroid={colors.material.grey['500']}
                                    style={styles.item}
                                    value={this.state.examen ? this.state.examen.toString() : ''}
                                    keyboardType='numeric'>
                                </TextInput>
                            </View>
                            
                            <View style={styles.rowContainer}>
                                <Text style={styles.item}>Presentacion:</Text>
                                <TextInput
                                    editable={false}
                                    underlineColorAndroid={colors.material.grey['500']}
                                    style={styles.item}
                                    keyboardType={'numeric'}>
                                    {this.state.presentacion}
                                </TextInput>
                            </View>
                            
                        </View>

                        <View style={styles.columnContainer}>
                            <Text style={styles.presentacionTexto}>{this.state.notaFinal}</Text>
                            <Text style={styles.estadoTexto}>{this._getEstado(seccion.notas.observacion)}</Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <FlatList
                            extraData={this.state.notas}
                            data={this.state.notas}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => <NotasItem index={index} onChange={this._cambiarStates} nota={item}/>}
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
    presentacionTexto: {
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