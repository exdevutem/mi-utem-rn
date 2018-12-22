import React, { Component } from 'react';
import {Text, View, TextInput, StyleSheet, Image, TouchableHighlight, AsyncStorage} from 'react-native';

const correoPrueba = '@utem.cl';
const clavePrueba = 'A';
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
        this.props.navigation.navigate('Main');
      };

    comprobacion = () => {
        if(this.state.correo != '' && this.state.clave != ''){
            if(this.state.correo.endsWith('@utem.cl')){
                //if(this.state.correo == correoPrueba && this.state.clave == clavePrueba){
                    this._loginAsync(this.state.correo, this.state.clave)
                    //this.props.navigation.navigate('Main');
                //}
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Logo_UTEM.png/250px-Logo_UTEM.png'}}
                    style={styles.logo} />
                <Text style={styles.texto}>Correo</Text>
                <TextInput style={styles.textoPlaceHolder} 
                    keyboardType='email-address'
                    placeholder='correo@utem.cl'
                    autoCapitalize='none'
                    textContentType='emailAddress'
                    onChangeText={
                        (text) => this.setState(previousState => (
                            { correo: text, clave: previousState.clave }
                    ))}></TextInput>
                <Text style={styles.texto}>Contraseña</Text>
                <TextInput style={styles.textoPlaceHolder} placeholder='••••••••••'
                    secureTextEntry={true}
                    textContentType='password'
                    onChangeText={
                        (text) => this.setState(previousState => (
                            { correo: previousState.correo, clave: text}
                    ))}></TextInput>
                <TouchableHighlight onPress={() => this.comprobacion()} style={styles.boton}>
                    <Text style={styles.textoBoton}>Entrar</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    logo: {
        width: 200,
        height: 200,
        left: 75,
        top: 40
    },
    texto: {
        color: '#05657E',
        left: 30,
        top: 60
    },
    textoPlaceHolder: {
        color: '#05657E',
        backgroundColor: '#EEEEEE',
        top: 60,
        left: 20,
        height: 35,
        width: 310,
        marginBottom: 15
    },
    boton: {
        backgroundColor: '#05657E',
        maxWidth: 200,
        height: 40,
        left: 80,
        top: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8
    },
    textoBoton: {
        color: '#FFFFFF',
        height: 16
    }
});