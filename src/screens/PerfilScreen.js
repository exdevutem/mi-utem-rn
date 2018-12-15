import React, { Component } from 'react';
import {Text, View, TextInput, StyleSheet, Image, FlatList, SafeAreaView} from 'react-native';
import {estudiante} from '../static/estudiantes';
import { ScrollView } from 'react-native-gesture-handler';

class CampoPerfil extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <View style={styles.elementoLista}>
                <Text style={styles.texto}>{this.props.etiqueta}</Text>
                <TextInput value={this.props.valor}></TextInput>
            </View>
        );
    }
}

export default class PerfilScreen extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            datos:[]
        }
    }

    GetPerfil(){
        var datos=[]

        if(estudiante.nombre!=null){
            datos.push({
                etiqueta: "Nombre",
                valor: estudiante.nombre
            })
        }
        else{
            datos.push({
                etiqueta: "Nombre",
                valor:"Nombre no asignado"
            })
        }
        if(estudiante.rut!=null){
            datos.push({
                etiqueta: "RUT",
                valor:estudiante.rut.toString()
            })
        }
        else{
            datos.push({
                etiqueta: "RUT",
                valor: "No tiene RUT asignado"
            })
        }
        if(estudiante.edad!=null){//Sacar la edad de la fecha de nacimiento
            datos.push({
                etiqueta: "Edad",
                valor: estudiante.edad.toString()
            })
        }
        else{
            datos.push({
                etiqueta: "Edad",
                valor: "No tiene edad asignada"
            })
        }
        if(estudiante.telefonoMovil!=null){
            datos.push({
                etiqueta: "Teléfono móvil",
                valor:estudiante.telefonoMovil.toString()
            })
        }
        else{
            datos.push({
                etiqueta:"Teléfono móvil",
                valor:"No hay telefono móvil asignado"
            })
        }
        if(estudiante.telefonoFijo){
            datos.push({
                etiqueta: "Teléfono fijo",
                valor:estudiante.telefonoFijo.toString()
            })
        }
        else{
            datos.push({
                etiqueta:"Teléfono fijo",
                valor: "No hay teléfono fijo asignado"
            })
        }
        if (estudiante.correoUtem!=null){
            datos.push({
                etiqueta:"Correo UTEM",
                valor:estudiante.correoUtem
            })
        }
        else{
            datos.push({
                etiqueta:"Correo UTEM",
                valor:"No hay registro de un correo UTEM"
            })
        }
        if(estudiante.correoPersonal!=null){
            datos.push({
                etiqueta:"Correo personal",
                valor:estudiante.correoPersonal
            })
        }
        else{
            datos.push({
                etiqueta:"Correo personal",
                valor:"No hay registro de un correo personal"
            })
        }
        if(estudiante.sexo.sexo!=null){
            datos.push({
               etiqueta:"Sexo",
               valor:estudiante.sexo.sexo
            })
        }
        else{
            datos.push({
                etiqueta:"Sexo",
                valor:"No hay registro de su sexo"
            })
        }
        if(estudiante.nacionalidad.nacionalidad!=null){
            datos.push({
                etiqueta:"Nacionalidad",
                valor:estudiante.nacionalidad.nacionalidad
            })
        }
        else{
            datos.push({
                etiqueta:"Nacionalidad",
                valor:"No hay registro de nacionalidad"
            })
        }
        if(estudiante.direccion.comuna.comuna!=null){
            datos.push({
                etiqueta:"Comuna",
                valor:estudiante.direccion.comuna.comuna
            })
        }
        else{
            datos.push({
                etiqueta:"Comuna",
                valor:"No hay comuna registrada"
            })
        }
        if(estudiante.direccion.direccion){
            datos.push({
                etiqueta:"Dirección",
                valor:estudiante.direccion.direccion
            })
        }
        else{
            datos,push({
                etiqueta:"Dirección",
                valor:"No hay dirección registrada"
            })
        }
        this.setState(previousState => ({
            datos: datos,
        }))
    }

    componentWillMount() {
        this.GetPerfil();
    }

    render() {
        return (
            <ScrollView style={ styles.container }>
                <Image source={{ uri:estudiante.fotoUrl }} style={ styles.foto } />
                
                <FlatList
                    data={ this.state.datos }
                    style={ styles.lista }
                    renderItem={({item}) => 
                        <CampoPerfil etiqueta={item.etiqueta} valor={item.valor}></CampoPerfil>
                    }/>
            </ScrollView>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF'
    },
    foto: {
        height: 120,
        width: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginTop: 20
    },
    lista: {
        padding: 0
    },
    elementoLista: {
        paddingHorizontal: 20,
        paddingVertical: 10
    }
});
