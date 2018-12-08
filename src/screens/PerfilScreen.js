import React, { Component } from 'react';
import {Text, View, TextInput, StyleSheet, Image,ScrollView} from 'react-native';

export default class PerfilScreen extends Component {
    render(){
        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.container}>
                    <Image source={{uri: 'https://t4.ftcdn.net/jpg/00/97/00/09/160_F_97000908_wwH2goIihwrMoeV9QF3BW6HtpsVFaNVM.jpg'}}
                        style={styles.logo} />
                    <Text style={styles.texto}>Nombre</Text>
                    <TextInput style={styles.textoPlaceHolder} placeholder='Nombre completo'></TextInput>
                    <Text style={styles.texto}>RUT</Text>
                    <TextInput style={styles.textoPlaceHolder} placeholder='RUT'></TextInput>
                    <Text style={styles.texto}>Edad</Text>
                    <TextInput style={styles.textoPlaceHolder} placeholder='Edad'></TextInput>
                    <Text style={styles.texto}>Puntaje</Text>
                    <TextInput style={styles.textoPlaceHolder} placeholder='Puntaje PSU'></TextInput>
                    <Text style={styles.texto}>Cel</Text>
                    <TextInput style={styles.textoPlaceHolder} placeholder='Celular'></TextInput>
                    <Text style={styles.texto}>CelCasa</Text>
                    <TextInput style={styles.textoPlaceHolder} placeholder='Telefono casa'></TextInput>
                    <Text style={styles.texto}>CorreoIn</Text>
                    <TextInput style={styles.textoPlaceHolder} placeholder='Correo Institucional'></TextInput>
                    <Text style={styles.texto}>Sexo</Text>
                    <TextInput style={styles.textoPlaceHolder} placeholder='Sexo'></TextInput>
                    <Text style={styles.texto}>Nacionalidad</Text>
                    <TextInput style={styles.textoPlaceHolder} placeholder='Nacionalidad'></TextInput>
                    <Text style={styles.texto}>Comuna</Text>
                    <TextInput style={styles.textoPlaceHolder} placeholder='Comuna'></TextInput>
                    <Text style={styles.texto}>Direccion</Text>
                    <TextInput style={styles.textoPlaceHolder} placeholder='Dirección'></TextInput>
                    <Text style={styles.texto}>Correo</Text>
                    <TextInput style={styles.textoPlaceHolder} placeholder='Correo personal'></TextInput>
                    <Text style={styles.texto}>Carnet</Text>
                    <TextInput style={styles.textoPlaceHolder} placeholder='Carnet de identidad'></TextInput>

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        paddingVertical: 20
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