import React, { Component } from 'react';
import {Text, View, SafeAreaView, TextInput, StyleSheet, Image, TouchableHighlight, AsyncStorage, StatusBar} from 'react-native';
import Video from 'react-native-video';

const API_URL = 'https://api-utem.herokuapp.com/';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            correoIsFocused: false,
            contraseniaIsFocused: false,
            correo: "",
            contrasenia: ""
        };
    }

    _loginAsync = async (correo, contrasenia) => {
        var respuesta = await fetch(API_URL + 'token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: encodeURIComponent('correo') + '=' + encodeURIComponent(correo) + '&' + encodeURIComponent('contrasenia') + '=' + encodeURIComponent(contrasenia)
        }).then(response => response.json());
        
        console.log(respuesta);

        await AsyncStorage.setItem('userToken', respuesta.token);
        await AsyncStorage.setItem('rut', respuesta.rut.toString());
        await AsyncStorage.setItem('correo', respuesta.correo);
        this.props.navigation.navigate('Main');
    };

    _onSubmitPress = () => {
        if (this.state.correo != '' && this.state.contrasenia != ''){
            if (this.state.correo.endsWith('@utem.cl')){
                this._loginAsync(this.state.correo, this.state.contrasenia)
            }
        }
    }

    _onCorreoFocus = () => {
        this.setState(previousState => ({
            correoIsFocused: true,
            contraseniaIsFocused: previousState.contraseniaIsFocused,
            correo: previousState.correo,
            contrasenia: previousState.contrasenia
        }));
    }

    _onContraseniaFocus = () => {
        this.setState(previousState => ({
            correoIsFocused: previousState.correoIsFocused,
            contraseniaIsFocused: true,
            correo: previousState.correo,
            contrasenia: previousState.contrasenia
        }));
    }

    _onCorreoBlur = () => {
        this.setState(previousState => ({
            correoIsFocused: false,
            contraseniaIsFocused: previousState.contraseniaIsFocused,
            correo: previousState.correo,
            contrasenia: previousState.contrasenia
        }));
    }

    _onContraseniaBlur = () => {
        this.setState(previousState => ({
            correoIsFocused: previousState.correoIsFocused,
            contraseniaIsFocused: false,
            correo: previousState.correo,
            contrasenia: previousState.contrasenia
        }));
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content" />
                <Video 
                    repeat
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
                            placeholderTextColor='rgba(255, 255, 255, 0.5)'
                            selectionColor='#009d9b'
                            autoCapitalize='none'
                            textContentType='emailAddress'
                            onFocus={this._onCorreoFocus}
                            onBlur={this._onCorreoBlur}
                            onChangeText={(texto) => 
                                this.setState(previousState => ({
                                    correoIsFocused: previousState.correoIsFocused,
                                    contraseniaIsFocused: previousState.contraseniaIsFocused,
                                    correo: texto,
                                    contrasenia: previousState.contrasenia
                                })
                            )} />
                        <Text style={styles.texto}>Contraseña</Text>
                        <TextInput 
                            style={[styles.textInput, {borderColor: this.state.contraseniaIsFocused ? '#009d9b' : 'white'}]} 
                            placeholder='••••••••••'
                            autoCorrect={false}
                            secureTextEntry={true}
                            textContentType='password'
                            placeholderTextColor='rgba(255, 255, 255, 0.5)'
                            selectionColor='#009d9b'
                            onFocus={this._onContraseniaFocus}
                            onBlur={this._onContraseniaBlur}
                            onChangeText={(texto) => 
                                this.setState(previousState => ({
                                    correoIsFocused: previousState.correoIsFocused,
                                    contraseniaIsFocused: previousState.contraseniaIsFocused,
                                    correo: previousState.correo,
                                    contrasenia: texto
                                })
                            )} />
                        <TouchableHighlight 
                            onPress={() => this._onSubmitPress()} 
                            style={styles.boton}>
                            <Text style={styles.textoBoton}>Entrar</Text>
                        </TouchableHighlight>
                    </View>
                    
                    
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: 20
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
    textInput: {
        color: 'white',
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginBottom: 15,
        borderRadius: 26,
        borderWidth: 1.5
    },
    boton: {
        backgroundColor: '#009d9b',
        padding: 10,
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    textoBoton: {
        color: 'white'
    }
});