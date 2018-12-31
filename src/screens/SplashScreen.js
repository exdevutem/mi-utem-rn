import React, { Component } from 'react';
import {Text, AsyncStorage, StatusBar, StyleSheet, Animated} from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Cache } from "react-native-cache";

import ApiUtem from '../ApiUtem';

var cache = new Cache({
    namespace: "estudiantes",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
});
var apiUtem = new ApiUtem();

export default class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: new Animated.Value(0),
            tokenEsValido: null,
            terminoAnimacion: false
        };
    }

    _getDatos = async () => {
        return new Promise(async (resolve, reject) => {
            const rut = await AsyncStorage.getItem('rut', (err) => {
                if (err) reject(err);
            });
            if (rut) {
                cache.getItem(rut, async (err, perfilCache) => {
                    if (err || !perfilCache) {
                        const datos = await apiUtem.getPrincipales(rut);
                        const perfil = datos[0];
                        const horarios = datos[1];
                        const carreras = datos[2];
                        
                        const nombre = perfil.nombre.completo ? perfil.nombre.completo : (perfil.nombre.apellidos ? perfil.nombre.nombres + " " + perfil.nombre.apellidos : perfil.nombre);
                        const fotoUrl = perfil.fotoUrl;
                        const correoUtem = perfil.correoUtem;

                        cache.setItem(rut + "horarios", horarios, (err) => {
                            if (err) console.error(err);
                            cache.setItem(rut + "carreras", carreras, (err) => {
                                if (err) console.error(err);
                                cache.setItem(rut, perfil, (err) => {
                                    if (err) console.error(err);
                                    resolve({
                                        nombre: nombre,
                                        foto: fotoUrl,
                                        correo: correoUtem,
                                        carrerasN: carreras.length || null,
                                        carreraId: carreras.length == 1 ? carreras[0]._id : null,
                                        horariosN: horarios.length || null,
                                        horarioId: horarios.length == 1 ? horarios[0].carrera.codigo : null,
                                        asignaturasN: null,
                                        asignaturaId: null

                                    });
                                });
                            });
                        });
                    } else {
                        cache.getItem(rut + "horarios", (err, horariosCache) => {
                            if (err) console.error(err);
                            cache.getItem(rut + "carreras", (err, carrerasCache) => {
                                if (err) console.error(err);
                                const nombre = perfilCache.nombre.completo ? perfilCache.nombre.completo : (perfilCache.nombre.apellidos ? perfilCache.nombre.nombres + " " + perfilCache.nombre.apellidos : perfilCache.nombre);
                                const fotoUrl = perfilCache.fotoUrl;
                                const correoUtem = perfilCache.correoUtem;
                                resolve({
                                    nombre: nombre,
                                    foto: fotoUrl,
                                    correo: correoUtem,
                                    carrerasN: carrerasCache.length || null,
                                    carreraId: carrerasCache.length == 1 ? carrerasCache[0]._id : null,
                                    horariosN: horariosCache.length || null,
                                    horarioId: horariosCache.length == 1 ? horariosCache[0].carrera.codigo : null,
                                    asignaturasN: null,
                                    asignaturaId: null

                                });
                            })
                        })
                    }
                })
                

                
            } else {
                reject("No se pudo obtener el RUT")
            }
            
        })
    }

    _terminoProceso = async () => {
        if (this.state.tokenEsValido != null) {
            if (this.state.tokenEsValido && this.state.terminoAnimacion) {
                try {
                    const parametros = await this._getDatos();
                    this.props.navigation.navigate('Main', parametros);
                } catch (error) {
                    this.props.navigation.navigate('Login');
                }
                
            } else {
                if (!this.state.tokenEsValido && this.state.terminoAnimacion) {
                    this.props.navigation.navigate('Login');
                }
            }
        }
    }

    _comprobarToken = async () => {
        try {
            const { esValido } = await apiUtem.checkToken();
            
            if (esValido) {
                this.setState({
                    tokenEsValido: true
                });
            } else {
                this.setState({
                    tokenEsValido: false
                });
            }
            this._terminoProceso();
        } catch (error) {
            this.setState({
                tokenEsValido: false
            });
            this._terminoProceso();
        }
    }

    componentDidMount() {
        this._comprobarToken();
        Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 3500
        }).start(async ({ finished }) => {
            if (finished) {
                this.setState({
                    terminoAnimacion: true
                });
                this._terminoProceso();
            }
        });
    }

    render() {
        return (
            <LinearGradient style={styles.container} start={{x: 0, y: 1}} end={{x: 1, y: 0}} colors={['#06607a', '#1d8e5c']}>
                <StatusBar
                    hidden={true}
                    backgroundColor="rgba(255, 255, 255, 0)"
                    animated
                />
                
                <LottieView
                    ref={animation => {
                        this.animation = animation;
                    }}
                    source={require('../assets/animations/utem.json')}
                    loop={false}
                    progress={this.state.progress}
                    />
                
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009d9b'
    }
});