import React, { Component } from 'react';
import { SafeAreaView, StatusBar, FlatList, ScrollView, StyleSheet, View, Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import NotasItem from '../components/NotasItem';

export default class NotasScreen extends Component {
    constructor(props) {
        super(props);
        var seccion = this.props.navigation.getParam("seccion");
        
        var resultadoNotas = this.parseNotas(seccion.notas.notas);
        this.state = {
            seccion: seccion,
            notas: resultadoNotas,
            presentacion: this.calcularPresentacion(resultadoNotas)
        }
    }

    parseNotas(notas) {
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
        var seccion = this.state.seccion;

        return (
            <SafeAreaView>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.primarioOscuro} />
                <ScrollView>
                    <View style={styles.containerRow}>
                        <View style={styles.containerColumn}>
                        <TextInput
                            editable={seccion.notas.examenes[0] == null && seccion.notas.examenes[1] == null}
                            style={styles.item}>Nota Examen: ---
                        </TextInput>
                        <Text style={styles.item}>{this.state.presentacion}</Text></View>

                        <View style={styles.containerColumn}><Text style={styles.item}>Nota Final:</Text>
                        <Text style={styles.item}>{this.state.presentacion}</Text>
                        </View>
                    </View>
                    <FlatList   
                        data={seccion.notas.notas}
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