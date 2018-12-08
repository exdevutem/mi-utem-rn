import React, { Component } from 'react';
import {Text, View, TextInput, StyleSheet, Image, TouchableHighlight, Alert} from 'react-native';

//const correoPrueba = 'uwu@utem.cl';
//const clavePrueba = 'uwu';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            correo: '',
            clave: ''
        };
    }

    comprobacion = () => {
        /*if(this.state.correo != '' && this.state.clave != ''){
            if(this.state.correo.endsWith('@utem.cl') && this.state.correo == correoPrueba){
                if(this.state.clave == clavePrueba){
                    this.props.navigation.navigate('Main');
                }
            }
        }*/
        this.props.navigation.navigate('Main');
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Logo_UTEM.png/250px-Logo_UTEM.png'}}
                    style={styles.logo} />
                <Text style={styles.texto}>Correo</Text>
                <TextInput style={styles.textoPlaceHolder} placeholder='correo@utem.cl'
                    onChangeText={
                        (text) => this.setState(previousState => (
                            { correo: text, clave: previousState.clave }
                    ))}></TextInput>
                <Text style={styles.texto}>Contraseña</Text>
                <TextInput style={styles.textoPlaceHolder} placeholder='correo@utem.cl'
                    onChangeText={
                        (text) => this.setState(previousState => (
                            { correo: previousState.correo, clave: text}
                    ))}></TextInput>
                <TouchableHighlight onPress={() => this.comprobacion()} style={styles.boton}>
                <Text style={styles.textoBoton}>Login</Text>
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