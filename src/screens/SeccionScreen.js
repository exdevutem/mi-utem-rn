import React, { Component } from 'react';
import { AsyncStorage, ActivityIndicator, View, StyleSheet, Text, Button } from 'react-native';
import { Cache } from "react-native-cache";

import colors from '../colors';
import ApiUtem from '../ApiUtem';

var apiUtem = new ApiUtem();
var cache = new Cache({
    namespace: "estudiantes",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
});

export default class SeccionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notas: [],
            estaCargandoNotas: true,
        }
    }

    _irANotas = () => {
        var notasSeccionActual = this.state.notas.find(seccion => seccion.tipo === this.props.seccion.tipo);

        this.props.navigation.navigate('Notas', {
            seccion: notasSeccionActual
        });
    }

    _getNotas = async () => {
        const rut = await AsyncStorage.getItem('rut');
        const {id, nombre} = this.props.asignatura;
        const {tipo, seccion} = this.props.seccion;
        const key = rut + 'asignaturas' + id + 'notas-' + tipo + '-' + seccion;
        cache.getItem(key, async (err, notasCache) => {
            if (err || !notasCache) {
                const notas = await apiUtem.getNotas(rut, id);
                cache.setItem(key, notas, (err) => {
                    if (err) console.error(err);
                    this.setState({
                        estaCargandoNotas: false,
                        notas: notas
                    });
                });
            } else {
                this.setState({
                    estaCargandoNotas: false,
                    notas: notasCache
                });
            }
        });
    }

    componentWillMount() {
        this._getNotas();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.card}>
                    <ActivityIndicator 
                        size="large" 
                        color={colors.primario} 
                        style={[styles.cargando, this.state.estaCargandoNotas ? {opacity: 1} : {opacity: 0}]}/>
                    <View style={this.state.estaCargandoNotas ? {opacity: 0} : {opacity: 1}}>
                        <Button
                            onPress={this._irANotas}
                            title="Ir a notas"
                            color={colors.primario}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.material.grey['200']
    },
    card: {
        backgroundColor: 'white',
        margin: 10,
        height: 200,
        borderRadius: 5,
        elevation: 2,
        padding: 20
    },
    cargando: {
        alignSelf: 'center',
    },
    texto: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})