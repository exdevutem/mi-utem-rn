import React, { Component } from 'react';
import { SafeAreaView, StatusBar, FlatList, ScrollView, StyleSheet, View, Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import colors from '../colors';
import NotasItem from '../components/NotasItem';

export default class NotasScreen extends Component {
    constructor(props) {
        super(props);
        var seccion = this.props.navigation.getParam("seccion");
        var resultadoNotas = this._parseNotas(seccion.notas.notas);
        var presentacion = this._calcularPresentacion(resultadoNotas);
        var notaExamen;

        if(seccion.notas.examenes[0] == null){
            notaExamen = seccion.notas.examenes[1];
        } else{
            notaExamen = seccion.notas.examenes[0];
        }

        this.state = {
            seccion: seccion,
            notas: resultadoNotas,
            presentacion: presentacion,
            examen: notaExamen,
            notaFinal: this._calcularNotaFinal(notaExamen, presentacion)
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

    _parseNotas(notas) {
        var listaDeNotas = [];

        notas.forEach(function(nota) {
            var tupla = [];
            tupla.push(nota.ponderador);
            
            if (nota.nota == null) {
                tupla.push(null);
            } else {
                tupla.push(nota.nota);
            }

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

    _cambiarStates = (i, nota) => { 
        var nuevaNota = parseFloat(nota) || null;
        if (nuevaNota > 7) {
            nuevaNota = 7;
        }
        if (i != null) {
            var lista = this.state.notas;

            lista[i][1] = nuevaNota;

            var presentacion = this._calcularPresentacion(lista);
            var examen = this._ExamenHabilitado(this.state.examen, presentacion) ? this.state.examen : null
            this.setState({
                presentacion: presentacion,
                notaFinal: this._calcularNotaFinal(examen, presentacion),
                examen: examen
            });
        } else {
            this.setState({
                examen: nuevaNota,
                notaFinal: this._calcularNotaFinal(nuevaNota, this.state.presentacion)
            });
        }
        
        
    }

    _ExamenHabilitado(examen, presentacion){
        presentacion = parseFloat(presentacion) || null
        presentacion = parseFloat(presentacion.toFixed()) || null
        if ((examen == null) || (presentacion && presentacion < 4 && presentacion >= 3)) {
            return true;
        } else{
            return false;
        }
    }

    _calcularNotaFinal(notaExamen, notaPresentacion) {
        
        
        var seccion = this.props.navigation.getParam("seccion");
        notaExamen = parseFloat(notaExamen) || null;
        notaPresentacion = parseFloat(notaPresentacion) || null;
        console.log(notaExamen, notaPresentacion);
        

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
                console.log(resultado);
                return resultado;
            } else {
                console.log('notaPresentacion: ', notaPresentacion);
                return notaPresentacion;
                /*this.setState({
                    examen: null
                });*/
            }
            /*this.setState({
                presentacion: notaPresentacion,
                notaFinal: Resultado
            })*/
        }
        
    }

    render () {
        var seccion = this.state.seccion;

        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.primarioOscuro} />
                <ScrollView>
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
                                    editable={this._ExamenHabilitado(seccion.notas.examenes[0], this.state.presentacion)}
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
                            data={seccion.notas.notas}
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