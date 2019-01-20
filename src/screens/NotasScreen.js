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
        var resultadoPresentacion = Number((this.calcularPresentacion(resultadoNotas)).toFixed(3));

        this.state = {
            notas: resultadoNotas,
            presentacion: resultadoPresentacion
        }
    }

    parseNotas(){
        var asignaturas = notas[0].notas.notas;

        var listaDeNotas = [];
        var tupla = [];

        asignaturas.forEach(function(elemento){
                tupla.push(elemento.ponderador);
                if(elemento.nota == null){
                    tupla.push(null);
                }else {
                    tupla.push(elemento.nota);
                }
                listaDeNotas.push(tupla);
                tupla = [];
        })
        
        return listaDeNotas;
    }

    calcularPresentacion(listaDeNotas){
        var notaFinal = 0;

        listaDeNotas.forEach(function(elemento){
            if(elemento[1] != null){
                notaFinal = notaFinal + elemento[0] * elemento[1];
            }
        })
        return notaFinal;
    }

    cambiarStates = (i, nota) => { 
        var lista = this.state.notas;
        var nuevaPresentacion = this.state.presentacion;

        lista[i][1] = nota;
        nuevaPresentacion = Number((nuevaPresentacion + lista[i][0] * nota).toFixed(3));
        this.setState({presentacion: nuevaPresentacion});
        this.render();
    }

    

    render() {
        var asignatura = notas[0]
        var ñe = this.state.presentacion;
        console.log(this.state);

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
                        style={styles.item}>Nota Examen: ---</TextInput>
                        <Text style={styles.item}>Nota Presentacion: {ñe}</Text></View>

                        <View style={styles.containerColumn}><Text style={styles.item}>Nota Final:</Text>
                        <Text style={styles.item}>{ñe}</Text>
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