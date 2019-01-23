import React, { Component } from 'react';
import { Platform,Text, View, StyleSheet, Image, ScrollView, FlatList, AsyncStorage, StatusBar, RefreshControl, ActivityIndicator } from 'react-native';
import { Cache } from "react-native-cache";

import PerfilCampo from '../components/PerfilCampo';

import ApiUtem from '../ApiUtem';

import colors from '../colors';

const ES_IOS = Platform.OS === 'ios';

var cache = new Cache({
    namespace: "estudiantes",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
});
var apiUtem = new ApiUtem();

export default class PerfilScreen extends Component {
    constructor(props) {
        super(props);
        this._getPerfil = this._getPerfil.bind(this);
        this.state = {
            campos: [],
            perfil: null,
            estaActualizando: false,
            estaCargando: true,
        }
    }

    _getPerfil = async (forzarApi) => {
        const rut = await AsyncStorage.getItem('rut');
        const key = rut;
        cache.getItem(key, async (err, perfilCache) => {
            if (forzarApi || err || !perfilCache) {
                const perfil = await apiUtem.getPerfil(rut);
                cache.setItem(key, perfil, (err) => {
                    if (err) console.error(err);
                    this._renderPerfil(perfil);
                });
            } else {
                this._renderPerfil(perfilCache);
            }
        });
    }

    _onRefresh = () => {
        this.setState({
            estaActualizando: true,
        });
        this._getPerfil(true);
        
    }

    _renderPerfil = (estudiante) => {
        var campos = []
        
        campos.push({
            etiqueta: "RUT",
            valor: estudiante.rut ? estudiante.rut.toString() : "No hay RUT registrado",
            editable: false,
            tipo: null
        });

        campos.push({
            etiqueta: "Correo personal",
            valor: estudiante.correoPersonal ? estudiante.correoPersonal.toString() : "",
            editable: true,
            tipo: "email"
        });

        campos.push({
            etiqueta: "Fecha de nacimiento",
            valor: estudiante.nacimiento ? estudiante.nacimiento : null,
            editable: true,
            tipo: "nacimiento"
        });

        campos.push({
            etiqueta: "Sexo",
            valor: estudiante.sexo ? estudiante.sexo : null,
            editable: true,
            tipo: "sexo"
        });

        campos.push({
            etiqueta: "Telefono móvil",
            valor: estudiante.telefonoMovil ? estudiante.telefonoMovil.toString() : "",
            editable: true,
            tipo: "telefono"
        });

        campos.push({
            etiqueta: "Telefono fijo",
            valor: estudiante.telefonoFijo ? estudiante.telefonoFijo.toString() : "",
            editable: true,
            tipo: "telefono"
        });

        campos.push({
            etiqueta: "Dirección",
            valor: estudiante.direccion && estudiante.direccion.direccion ? estudiante.direccion.direccion : "",
            editable: true,
            tipo: "direccion"
        });
        
        this.setState({
            campos: campos,
            perfil: estudiante,
            estaCargando: false,
            estaActualizando: false
        })
    }

    componentWillMount() {
        this._getPerfil();
    }

    

    render() {
        const nombre = this.state.perfil ? this.state.perfil.nombre : null;
        return (
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl
                    refreshing={this.state.estaActualizando}
                    colors={[colors.primario]}
                    onRefresh={this._onRefresh}/>
                } >
                <StatusBar
                    barStyle={ES_IOS ? "dark-content" : "light-content"}
                    backgroundColor={colors.primarioOscuro} />

                <View style={styles.headerContainer}>
                    <View style={styles.fotoContainer}>
                        <Image source={{uri: this.state.perfil ? this.state.perfil.fotoUrl : ""}} style={styles.foto} />
                    </View>
                    <View style={[styles.card, styles.header]}>
                        <ActivityIndicator 
                            size="large" 
                            color={colors.primario} 
                            style={[styles.cargando, this.state.estaCargando ? {opacity: 1} : {opacity: 0}]}/>
                        <View style={this.state.estaCargando ? {opacity: 0} : {opacity: 1}}>
                            <Text style={styles.textoNombre}>{nombre != null ? (nombre.completo ? nombre.completo : (nombre.apellidos ? nombre.nombres + " " + nombre.apellidos : nombre)) : ""}</Text>
                            <Text style={styles.textoCorreo}>{this.state.perfil ? this.state.perfil.correoUtem : ""}</Text>
                            <View style={styles.badgesContainer}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeValor}>{this.state.perfil ? this.state.perfil.anioIngreso : ''}</Text>
                                    <Text style={styles.badgeDescripcion}>Ingreso</Text>
                                </View>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeValor}>{this.state.perfil ? this.state.perfil.ultimaMatricula : ''}</Text>
                                    <Text style={styles.badgeDescripcion}>Matricula</Text>
                                </View>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeValor}>{this.state.perfil ? this.state.perfil.carrerasCursadas : ''}</Text>
                                    <Text style={styles.badgeDescripcion}>Carreras</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[styles.card, styles.campos, this.state.perfil ? null : {flex: 1}]}>
                    <FlatList
                        data={this.state.campos}
                        extraData={this.state}
                        style={styles.lista}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => 
                            <PerfilCampo etiqueta={item.etiqueta} valor={item.valor} editable={item.editable} tipo={item.tipo}/>
                    } />
                </View>
            </ScrollView>
        );

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.material.grey['200']
    },
    headerContainer: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingBottom: 5,
        paddingTop: 80,
    },
    header: {
        width: '100%',
        padding: 20,
    },
    campos: {
        flex: 1,
        paddingVertical: 5
    },
    card: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5,
        elevation: 2
    },
    fotoContainer: {
        position: 'absolute',
        top: 10,
        borderRadius: 52,
        backgroundColor: 'white',
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    foto: {
        height: 104,
        width: 104,
        borderRadius: 52,
    },
    badgesContainer: {
        flexDirection: 'row',
        paddingTop: 20
    },
    badge: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    badgeValor: {
        fontWeight: 'bold',
        fontSize: 18
    },
    badgeDescripcion : {
        fontSize: 14
    },
    textoNombre: {
        fontWeight: 'bold',
        fontSize: 16,
        alignSelf: 'center',
        paddingTop: 20
    },
    textoCorreo: {
        color: colors.material.grey['600'],
        alignSelf: 'center'
    },
    textoEtiqueta: {
        fontWeight: 'bold'
    },
    cargando: {
        position: 'absolute',
        alignSelf: 'center',
        top: 0, 
        left: 0,
        bottom: 0,
        right: 0
    }
});