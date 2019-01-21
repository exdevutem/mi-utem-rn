import React, { Component } from 'react';
import { Image, AsyncStorage, ActivityIndicator, View, StyleSheet, Text, Button, FlatList } from 'react-native';
import { Cache } from "react-native-cache";

import NotasItem from '../components/NotasItem';

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
            bitacora: [],
            estaCargandoBitacora: true,
            estaCargandoNotas: true,
        }
    }

    _irANotas = () => {
        this.props.navigation.navigate('Notas', {
            seccion: this.state.notas
        });
    }

    _getNotas = async () => {
        const rut = await AsyncStorage.getItem('rut');
        const {id, nombre} = this.props.asignatura;
        const {tipo, seccion} = this.props.seccion;
        const key = rut + 'asignaturas' + id + 'notas-' + tipo + '-' + seccion;
        cache.getItem(key, async (err, notasCache) => {
            if (err || !notasCache) {
                var notas = await apiUtem.getNotas(rut, id);
                notas = notas.find(seccion => seccion.tipo === tipo);

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

    _getBitacora = async () => {
        const rut = await AsyncStorage.getItem('rut');
        const {id, nombre} = this.props.asignatura;
        const {tipo, seccion} = this.props.seccion;
        const key = rut + 'asignaturas' + id + 'bitacora-' + tipo + '-' + seccion;
        cache.getItem(key, async (err, bitacoraCache) => {
            if (err || !bitacoraCache) {
                var bitacora = await apiUtem.getBitacora(rut, id);
                bitacora = bitacora.find(seccion => seccion.tipo === tipo);

                cache.setItem(key, bitacora, (err) => {
                    if (err) console.error(err);
                    this.setState({
                        estaCargandoBitacora: false,
                        bitacora: bitacora
                    });
                });
            } else {
                this.setState({
                    estaCargandoBitacora: false,
                    bitacora: bitacoraCache
                });
            }
        });
    }

    _renderNotas = () => {
        if (this.state.notas.ponderadoresRegistrados) {
            return (
                <View>
                    <FlatList
                        style={{flex: 1}}  
                        data={this.state.notas}
                        onChange={null}
                        renderItem={({item, index}) => <NotasItem index={index} disable={true} nota={item}/>}
                    />
                    <Button
                        onPress={this._irANotas}
                        title="Ir a notas"
                        color={colors.primario}
                    />
                </View>
            )
        } else {
            return (<Text>El profesor no ha registrado ponderadores</Text>)
        }
    }

    componentWillMount() {
        this._getNotas();
        this._getBitacora();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.card}>
                    <ActivityIndicator 
                        size="large" 
                        color={colors.primario} 
                        style={[styles.cargando, this.state.estaCargandoBitacora ? {opacity: 1} : {opacity: 0}]}/>
                    <View style={[styles.docenteContainer, this.state.estaCargandoBitacora ? {opacity: 0} : {opacity: 1}]}>
                        <Image source={{uri: this.state.bitacora.docente ? this.state.bitacora.docente.fotoUrl : ''}} style={styles.foto} />
                        <View style={styles.datosDocenteContainer}>
                            <Text 
                                style={styles.nombreDocenteTexto}
                                numberOfLines={2}>
                                {this.state.bitacora.docente ? this.state.bitacora.docente.nombre : ''}
                            </Text>
                            <Text>{this.state.bitacora.docente ? this.state.bitacora.docente.correo : ''}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.card}>
                    <ActivityIndicator 
                        size="large" 
                        color={colors.primario} 
                        style={[styles.cargando, this.state.estaCargandoNotas ? {opacity: 1} : {opacity: 0}]}/>
                    <View style={this.state.estaCargandoNotas ? {opacity: 0} : {opacity: 1}}>
                        {this._renderNotas()}
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
        borderRadius: 5,
        padding: 20,
        elevation: 2
    },
    cargando: {
        position: 'absolute',
        alignSelf: 'center',
        top: 0, 
        left: 0,
        bottom: 0,
        right: 0
    },
    docenteContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    datosDocenteContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    foto: {
        height: 70,
        width: 70,
        borderRadius: 35,
        marginRight: 20
    },
    nombreDocenteTexto: {
        fontWeight: 'bold',
        fontSize: 16
    },
    texto: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})