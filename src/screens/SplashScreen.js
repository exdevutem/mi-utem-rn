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
        this._bootstrapAsync();
        this.state = {
            progress: new Animated.Value(0),
            esValido: null
        };
    }

    componentDidMount() {
        Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 8000
        }).start(async ({ finished }) => {
            if (finished) {
                if (this.state.esValido != null) {
                    if (this.state.esValido) {
                        const rut = await AsyncStorage.getItem('rut');
                        const token = await AsyncStorage.getItem('userToken');
                        const navigation = this.props.navigation;
                        cache.getItem(rut, async (err, cachePerfil) => {
                            if (err) {
                                const perfil = await apiUtem.getPerfil(token, rut);
                                const nombre = perfil.nombre.completo ? perfil.nombre.completo : (perfil.nombre.apellidos ? perfil.nombre.nombres + " " + perfil.nombre.apellidos : perfil.nombre);
                                const fotoUrl = perfil.fotoUrl;
                                const correoUtem = perfil.correoUtem;

                                navigation.navigate('Main', {
                                    nombre: nombre,
                                    foto: fotoUrl,
                                    correo: correoUtem
                                });
                            } else {
                                const nombre = cachePerfil.nombre.completo ? cachePerfil.nombre.completo : (cachePerfil.nombre.apellidos ? cachePerfil.nombre.nombres + " " + cachePerfil.nombre.apellidos : cachePerfil.nombre);
                                const fotoUrl = cachePerfil.fotoUrl;
                                const correoUtem = cachePerfil.correoUtem;

                                navigation.navigate('Main', {
                                    nombre: nombre,
                                    foto: fotoUrl,
                                    correo: correoUtem
                                });
                            }

                        });
                    } else {
                        this.props.navigation.navigate('Login');
                    } 
                }
            }
        });
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        const rut = await AsyncStorage.getItem('rut');
        const correo = await AsyncStorage.getItem('correo');
        if (userToken && rut && correo) {
            var placebo = await fetch(API_URL + 'token/placebo', {
                headers: {
                    Authorization: 'Bearer ' + userToken
                }
            }).then(response => response.json());
            
            if (placebo.esValido) {
                this.setState(previousState => ({
                    progress: previousState.progress,
                    esValido: true
                }));
            } else {
                this.setState(previousState => ({
                    progress: previousState.progress,
                    esValido: false
                }));
            }
        } else {
            this.setState(previousState => ({
                progress: previousState.progress,
                esValido: false
            }));
        }
        
    }

    render() {
        return (
            <LinearGradient style={styles.container} start={{x: 0, y: 1}} end={{x: 1, y: 0}} colors={['#06607a', '#1d8e5c']}>
                <StatusBar
                    translucent={true}
                />
                <Text style={styles.footer}>Creado por el Club de Innovación y Desarrollo UTEM</Text>
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
    },
    footer: {
        color: 'white',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 10
    }
});