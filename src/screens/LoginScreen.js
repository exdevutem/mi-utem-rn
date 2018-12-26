import React, { Component } from 'react';
import {Dimensions, Text, View, SafeAreaView, TextInput, StyleSheet, Image, TouchableHighlight, AsyncStorage, StatusBar, Linking, Animated, ActivityIndicator} from 'react-native';
import Video from 'react-native-video';
import { Cache } from "react-native-cache";

import ApiUtem from '../ApiUtem';
import colors from '../colors';

var cache = new Cache({
    namespace: "estudiantes",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
});
var apiUtem = new ApiUtem();

const win = Dimensions.get('window');

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchoMaximoBoton: 0,
            animationAnchoBoton: new Animated.Value(),
            estaCargando: false,
            correoIsFocused: false,
            contraseniaIsFocused: false,
            correo: "",
            contrasenia: ""
        };
    }

     _login = async function(correo, contrasenia) {
        try {
            var respuesta = await apiUtem.getToken(correo, contrasenia);

            await AsyncStorage.setItem('userToken', respuesta.token);
            await AsyncStorage.setItem('rut', respuesta.rut.toString());
            await AsyncStorage.setItem('correo', respuesta.correo);

            var perfil = await apiUtem.getPerfil(respuesta.token, respuesta.rut.toString());
            var horarios = await apiUtem.getHorarios(respuesta.token, respuesta.rut.toString());
            var carreras = await apiUtem.getCarreras(respuesta.token, respuesta.rut.toString());
            const nombre = perfil.nombre.completo ? perfil.nombre.completo : (perfil.nombre.apellidos ? perfil.nombre.nombres + " " + perfil.nombre.apellidos : perfil.nombre);
            const fotoUrl = perfil.fotoUrl;
            const correoUtem = perfil.correoUtem;
            var navigation = this.props.navigation;

            cache.setItem(respuesta.rut.toString(), perfil, function(err) {
                if (err) console.error(err);
                cache.setItem(respuesta.rut.toString() + 'carreras', carreras, function(err) {
                    if (err) console.error(err);
                    cache.setItem(respuesta.rut.toString() + 'horarios', horarios, function(err) {
                        if (err) console.error(err);
                        navigation.navigate('Main', {
                            nombre: nombre,
                            foto: fotoUrl,
                            correo: correoUtem
                        });
                    });
                });
            });
        } catch (error) {
            console.error(error);
            
        }
    };

    _onSubmitPress = () => {
        if (this.state.correo != '' && this.state.contrasenia != ''){
            if (this.state.correo.endsWith('@utem.cl')) {
                this._toggleCargando();
                this._login(this.state.correo, this.state.contrasenia);
            }
        }
    }

    _onCorreoFocus = () => {
        this.setState({
            correoIsFocused: true
        });
    }

    _onContraseniaFocus = () => {
        this.setState({
            contraseniaIsFocused: true
        });
    }

    _onCorreoBlur = () => {
        this.setState({
            correoIsFocused: false
        });
    }

    _onContraseniaBlur = () => {
        this.setState({
            contraseniaIsFocused: false
        });
    }

    _goToURL() {
        const url = "https://pasaporte.utem.cl/reset";
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            console.log("Don't know how to open URI: " + url);
          }
        });
    }

    _setDimensionesBoton(event){
        this.setState({
            anchoMaximoBoton: event.nativeEvent.layout.width,
            altoBoton: event.nativeEvent.layout.height
        });
    }

    _toggleCargando() {
        let valorInicial = this.state.estaCargando ? this.state.altoBoton : this.state.anchoMaximoBoton;
        let valorFinal = this.state.estaCargando ? this.state.anchoMaximoBoton : this.state.altoBoton;

        this.setState({
            estaCargando: !this.state.estaCargando
        });

        this.state.animationAnchoBoton.setValue(valorInicial);
        Animated.timing(this.state.animationAnchoBoton, {
            toValue: valorFinal,
            duration: 500
        }).start();
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content" />

                <Image
                    source={require('../assets/images/login-background.png')}
                    resizeMode='cover'
                    style={styles.poster} />
                
                <Video 
                    repeat
                    muted
                    source={require('../assets/videos/login-background.mp4')}
                    resizeMode="cover"
                    style={StyleSheet.absoluteFill} />
                
                <View style={styles.overlay} />
                
                <SafeAreaView style={styles.contentContainer}>
                    <Image 
                        source={require('../assets/images/utem-logo-color-blanco.png')}
                        resizeMode="contain"
                        style={styles.logo} />

                    <View style={styles.formContainer}>
                        <Text style={styles.texto}>Correo</Text>
                        <TextInput
                            style={[styles.textInput, {borderColor: this.state.correoIsFocused ? '#009d9b' : 'white'}]} 
                            keyboardType='email-address'
                            placeholder='correo@utem.cl'
                            autoCorrect={false}
                            editable={!this.state.estaCargando}
                            placeholderTextColor='rgba(255, 255, 255, 0.7)'
                            selectionColor='#009d9b'
                            autoCapitalize='none'
                            textContentType='emailAddress'
                            onFocus={this._onCorreoFocus}
                            onBlur={this._onCorreoBlur}
                            onChangeText={(texto) => 
                                this.setState({
                                    correo: texto
                                })
                            } />
                        <Text style={styles.texto}>Contraseña</Text>
                        <TextInput 
                            style={[styles.textInput, {borderColor: this.state.contraseniaIsFocused ? '#009d9b' : 'white'}]} 
                            placeholder='••••••••••'
                            autoCorrect={false}
                            editable={!this.state.estaCargando}
                            secureTextEntry={true}
                            textContentType='password'
                            placeholderTextColor='rgba(255, 255, 255, 0.7)'
                            selectionColor='#009d9b'
                            onFocus={this._onContraseniaFocus}
                            onBlur={this._onContraseniaBlur}
                            onChangeText={(texto) => 
                                this.setState({
                                    contrasenia: texto
                                })
                            } />
                        
                        <Text
                            style={[styles.texto, styles.url]}
                            onPress={this._goToURL}> 
                            ¿Olvidaste tu contraseña?
                        </Text>
                        <Animated.View
                            style={[styles.botonContainer, {width: this.state.animationAnchoBoton, height: this.state.altoBoton}]}>
                            <TouchableHighlight 
                                onPress={this.state.estaCargando ? null : this._onSubmitPress}
                                style={styles.boton}
                                underlayColor={colors.primarioOscuro}
                                onLayout={this._setDimensionesBoton.bind(this)} >
                                <View>
                                    <ActivityIndicator size="small" color="white" style={[styles.cargando, this.state.estaCargando ? {opacity: 1} : {opacity: 0}]}/>
                                    <Text style={[styles.textoBoton, this.state.estaCargando ? {opacity: 0} : {opacity: 1}]}>Entrar</Text>
                                </View>
                            </TouchableHighlight>
                        </Animated.View>
                    </View>
                    
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    poster: {
        position: 'absolute',
        alignSelf: 'center',
        width: win.width,
        height: win.height,
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: 20,
        zIndex: 10
    },
    logo: {
        flex: 1,
        margin: 40,
        alignSelf: 'stretch',
        width: undefined,
        height: undefined
    },
    formContainer: {
        flex: 2,
        margin: 10
    },
    texto: {
        color: 'white',
        marginLeft: 5,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    url: {
        textDecorationLine: 'underline'
    },
    textInput: {
        color: 'white',
        paddingHorizontal: 15,
        padding: 10,
        marginBottom: 15,
        borderRadius: 26,
        borderWidth: 2,
        maxHeight: 40
    },
    botonContainer: {
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        alignSelf: 'center',
        overflow: 'hidden'
    },
    boton: {
        backgroundColor: '#009d9b'
    },
    textoBoton: {
        color: 'white',
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 40
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