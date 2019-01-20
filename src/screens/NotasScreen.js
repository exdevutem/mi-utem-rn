import React, { Component } from 'react';
import { SafeAreaView, StatusBar, FlatList, ScrollView, StyleSheet, View, Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import NotasItem from '../components/NotasItem';
import {notas, asignaturas} from '../static/estudiantes';

export default class NotasScreen extends Component {
    /* TODO:
        - Hacer un parseNotas para llamarlo en el constructor
        - Hacer calcularPresentacion(notas)
        - Que cambiarStates cambie state.notas y state.presentacion
    */
    constructor(props) {
        super(props);
        var resultadoNotas = this.parseNotas();
        this.state = {
            notas: resultadoNotas,
            presentacion: this.calcularPresentacion(resultadoNotas)
        }
    }

    parseNotas() {
        var asignaturas = notas[0].notas.notas;

        var listaDeNotas = [];
        var tupla = [];

        asignaturas.forEach(function(elemento){
            tupla.push(elemento.ponderador);
            if (elemento.nota == null) {
                tupla.push(null);
            } else {
                tupla.push(elemento.nota);
            }
            listaDeNotas.push(tupla);
            tupla = [];
        })
        
        return listaDeNotas;
    }

    calcularPresentacion(listaDeNotas) {
        var notaFinal = 0;

        listaDeNotas.forEach(function(elemento) {
            if (elemento[1] != null) {
                notaFinal = notaFinal + elemento[0] * elemento[1];
            }
        })
        return notaFinal.toFixed(1);
    }

    cambiarStates = (i, nota) => { 
        const lista = this.state.notas;
        
        const nuevaNota = parseFloat(nota) || null;

        lista[i][1] = nuevaNota;
        
        this.setState({
            presentacion: this.calcularPresentacion(lista)
        });
    }

    

    render() {
        var asignatura = notas[0];

        return (
            <SafeAreaView>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.primarioOscuro} />
                <ScrollView>
                    <View style={styles.containerRow}>
                        <View style={styles.containerColumn}>
                        <TextInput
                            editable={asignatura.notas.examenes[0] == null && asignatura.notas.examenes[1] == null}
                            style={styles.item}>Nota Examen: ---
                        </TextInput>
                        <Text style={styles.item}>{this.state.presentacion}</Text></View>

                        <View style={styles.containerColumn}><Text style={styles.item}>Nota Final:</Text>
                        <Text style={styles.item}>{this.state.presentacion}</Text>
                        </View>
                    </View>
                    <FlatList   
                        data={asignatura.notas.notas}
                        renderItem={({item, index}) => <NotasItem index={index} onChange={this.cambiarStates} nota={item}/>}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    containerRow:{
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    containerColumn:{
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    item:{
        backgroundColor: colors.primarioOscuro,
        alignItems: 'center',
        padding: 20,
        margin: 10,
        fontSize: 15
    }
})