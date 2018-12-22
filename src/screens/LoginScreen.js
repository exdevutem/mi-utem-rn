import React, { Component } from 'react';
import {Text, View, SafeAreaView, TextInput, StyleSheet, Image, TouchableHighlight, AsyncStorage, StatusBar} from 'react-native';
import Video from 'react-native-video';

import loginBackground from '../assets/videos/login-background.mp4';

const API_URL = 'https://api-utem.herokuapp.com/';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            correo: '',
            clave: ''
        };
    }

    _loginAsync = async (correo, contrasenia) => {
        var token = await fetch(API_URL + 'token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: encodeURIComponent('correo') + '=' + encodeURIComponent(correo) + '&' + encodeURIComponent('contrasenia') + '=' + encodeURIComponent(contrasenia)
        }).then(response => response.json());
        
        await AsyncStorage.setItem('userToken', token.token);
        await AsyncStorage.setItem('rut', token.rut.toString());
        await AsyncStorage.setItem('correo', token.correo);
        this.props.navigation.navigate('Main');
    };

    comprobacion = () => {
        if (this.state.correo != '' && this.state.clave != ''){
            if (this.state.correo.endsWith('@utem.cl')){
                this._loginAsync(this.state.correo, this.state.clave)
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                />
                <Video 
                    repeat
                    source={loginBackground}
                    resizeMode="cover" style={StyleSheet.absoluteFill} />
                
                <SafeAreaView style={styles.contentContainer}>
                    <Image 
                        source={require('../assets/images/utem-negativo.png')}
                        resizeMode="contain"
                        style={styles.logo} />

                    <View style={styles.formContainer}>
                        <Text style={styles.texto}>Correo</Text>
                        <TextInput
                            style={styles.textInput} 
                            keyboardType='email-address'
                            placeholder='correo@utem.cl'
                            placeholderTextColor='white'
                            selectionColor='#009d9b'
                            autoCapitalize='none'
                            textContentType='emailAddress'
                            onChangeText={ (text) => 
                                this.setState(previousState => (
                                    { correo: text, clave: previousState.clave }
                                )
                            )} />
                        <Text style={styles.texto}>Contraseña</Text>
                        <TextInput 
                            style={styles.textInput} 
                            placeholder='••••••••••'
                            secureTextEntry={true}
                            textContentType='password'
                            placeholderTextColor='white'
                            selectionColor='#009d9b'
                            onChangeText={ (text) => 
                                this.setState(previousState => (
                                    { correo: previousState.correo, clave: text}
                                )
                            ) } />
                        <TouchableHighlight 
                            onPress={() => this.comprobacion()} 
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
        padding: 10,
        marginBottom: 15,
        borderRadius: 19,
        borderWidth: 1.5,
        borderColor: 'white'
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