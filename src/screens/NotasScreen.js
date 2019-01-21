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
        this.state = {
            seccion: seccion,
            notas: resultadoNotas,
            presentacion: this._calcularPresentacion(resultadoNotas)
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
        const lista = this.state.notas;
        
        var nuevaNota = parseFloat(nota) || null;
        if (nuevaNota > 7) {
            nuevaNota = 7;
        }

        lista[i][1] = nuevaNota;
        
        this.setState({
            presentacion: this._calcularPresentacion(lista)
        });
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
                                    editable={seccion.notas.examenes[0] == null}
                                    underlineColorAndroid={colors.material.grey['500']}
                                    style={styles.item}>
                                    {seccion.notas.examenes[0]}
                                </TextInput>
                            </View>
                            
                            <View style={styles.rowContainer}>
                                <Text style={styles.item}>Presentacion:</Text>
                                <TextInput
                                    editable={false}
                                    underlineColorAndroid={colors.material.grey['500']}
                                    style={styles.item}>
                                    {this.state.presentacion}
                                </TextInput>
                            </View>
                            
                        </View>

                        <View style={styles.columnContainer}>
                            <Text style={styles.presentacionTexto}>{this.state.presentacion}</Text>
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
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    card: {
        backgroundColor: 'white',
        margin: 10,
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