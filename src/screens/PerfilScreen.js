import React, { Component } from 'react';
import {Text, View, TextInput, StyleSheet, Image,ScrollView,FlatList,TouchableHighlight,AsyncStorage} from 'react-native';

const API_URL = 'https://api-utem.herokuapp.com/';

class CampoPerfil extends Component {
    constructor(props) {
        super(props);
        
    }
    

    render(){
        return(
            <View>
                <Text style={styles.texto}>{this.props.etiqueta}</Text>
                <TextInput value={this.props.valor}></TextInput>
            </View>
        );
    }
}

export default class PerfilScreen extends Component {
    constructor(props) {
        super(props);
        this.getPerfil = this.getPerfil.bind(this);
        this.state={
            datos:[]

        }
    }
    getPerfil = async () => {
        var rut=await AsyncStorage.getItem('rut');
        var token=await AsyncStorage.getItem('userToken');
        var perfil = await fetch(API_URL+"estudiantes/"+rut, {
            headers:{
                Authorization:"Bearer "+token  
            }
        }).then(response => response.json());

        console.log(perfil)

        this.RenderPerfil(perfil)
    }

    RenderPerfil (estudiante){
        var datos=[]

        

        if(estudiante.nombre!=null){
            datos.push({
                etiqueta: "Nombre Completo",
                valor: estudiante.nombre.nombres +" "+ estudiante.nombre.apellidos
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
                valor: "No tiene Rut asignado"
            })
        }
        if(estudiante.nacimiento!=null){//Sacar la edad de la fecha de nacimiento
            var s=estudiante.nacimiento
            var d=new Date();
            d.setFullYear(s.substr(6,4),s.substr(3,2)-1,s.substr(0,2));
            var hoy= new Date();
            var Edad = new Date(hoy-d)


            datos.push({
                etiqueta: "Edad",
                valor: Edad.getFullYear().toString()
            })
        }
        else{
            datos.push({
                etiqueta: "Edad",
                valor: "No tiene Edad asignada"
            })
        }
        if(estudiante.telefonoMovil!=null){
            datos.push({
                etiqueta: "Celular",
                valor:estudiante.telefonoMovil.toString()
            })
        }
        else{
            datos.push({
                etiqueta:"Celular",
                valor:"No hay telefono asignado"
            })
        }
        if(estudiante.telefonoFijo){
            datos.push({
                etiqueta: "Telefono fijo",
                valor:estudiante.telefonoFijo.toString()
            })
        }
        else{
            datos.push({
                etiqueta:"Telefono fijo",
                valor: "No hay telefono asignado"
            })
        }
        if(estudiante.correoUtem!=null){
            datos.push({
                etiqueta:"Correo institucional",
                valor:estudiante.correoUtem
            })
        }
        else{
            datos.push({
                etiqueta:"Correo institucional",
                valor:"No hay registro de un correo institucional"
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
                valor:"No hay registro de correo personal"
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
            datos.push({
                etiqueta:"Dirección",
                valor:"No hay dirección registrada"
            })
        }
        this.setState(previousState => ({
            datos: datos,
        }))
    }

    componentWillMount() {
        this.getPerfil();
    }

    render(){
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Image source={{uri: 'https://raw.githubusercontent.com/mapacheverdugo/android-utem/master/app/src/main/res/drawable/profile.jpeg'}} style={styles.foto} />
                </View>
                
                <FlatList
                    data={this.state.datos}
                    style={styles.lista}
                    renderItem={({item}) => 
                        <CampoPerfil etiqueta={item.etiqueta} valor={item.valor}></CampoPerfil>
                    }/>
            </ScrollView>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    foto: {
        height: 150,
        width: 150,
        borderRadius: 75,
        
    },
    lista: {
        padding: 0
    }
});