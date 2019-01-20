import React, { Component } from 'react';
import { Platform,Text, View, StyleSheet, Image, ScrollView, FlatList, AsyncStorage, StatusBar,Picker } from 'react-native';
import { Cache } from "react-native-cache";
import DatePicker from 'react-native-datepicker'

import  RegComuna  from '../static/Comunas'
import MyDatepicker from '../components/PerfilDatepicker'
import PerfilCampo from '../components/PerfilCampo';

import ApiUtem from '../ApiUtem';

import colors from '../colors';

const ES_IOS = Platform.OS === 'ios';

var cache = new Cache({
    namespace: "estudiantes",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
});
var apiUtem = new ApiUtem();
const lista=[];
export default class PerfilScreen extends Component {
    constructor(props) {
        super(props);
        this._getPerfil = this._getPerfil.bind(this);
        this.state = {
            campos: [],
            perfil: null
        }
    }

    _getPerfil = async () => {
        const rut = await AsyncStorage.getItem('rut');
        const token = await AsyncStorage.getItem('userToken');
        // Se intentará obtener el perfil del caché
        cache.getItem(rut, async (err, cachePerfil) => {
            if (err) {
                // Si no está en el cache
                const perfil = await apiUtem.getPerfil(token, rut); // Lo obtenemos de la API
                cache.setItem(perfil.rut.toString, perfil, null); // Y lo guardamos en el caché
                this._renderPerfil(perfil);
            } else {
                // Si está en el caché, se ocupa ese
                this._renderPerfil(cachePerfil)
            }

        });
       

        
    }
    _renderPickerCom=(datos)=>{
        return(
            <Picker.Item label={datos} value= {datos}></Picker.Item>
        )
    }
    _renderComunas=(datos)=>{
        for(var key in RegComuna){
            datos.push(RegComuna[key])
        }
    }

    _renderPerfil = (estudiante) => {
        var campos = []
        if (estudiante.rut != null)
            campos.push({
                etiqueta: "RUT",
                valor:estudiante.rut.toString()
            })
        else
            campos.push({
                etiqueta: "RUT",
                valor: "No tiene Rut asignado"
            })

        if (estudiante.correoPersonal != null)
            campos.push({
                etiqueta:"Correo personal",
                valor:estudiante.correoPersonal
            })
        else
            campos.push({
                etiqueta:"Correo personal",
                valor:"No hay registro de correo personal"
            })

        if (estudiante.nacimiento != null) {
            campos.push({
                etiqueta: "Fecha de nacimiento",
                valor: estudiante.nacimiento
            })
        } else
            campos.push({
                etiqueta: "Fecha de nacimiento",
                valor: "No tiene nacimiento asignado"
            })
        if (estudiante.telefonoMovil != null)
            campos.push({
                etiqueta: "Telefono móvil",
                valor:estudiante.telefonoMovil.toString()
            })
        
        else
            campos.push({
                etiqueta:"Telefono móvil",
                valor:"No hay telefono asignado"
            })
        
        if (estudiante.telefonoFijo)
            campos.push({
                etiqueta: "Telefono fijo",
                valor:estudiante.telefonoFijo.toString()
            })
        else
            campos.push({
                etiqueta:"Telefono fijo",
                valor: "No hay telefono asignado"
            })       
        if (estudiante.direccion.direccion)
            campos.push({
                etiqueta:"Dirección",
                valor:estudiante.direccion.direccion
            })
        else
            campos.push({
                etiqueta:"Dirección",
                valor:"No hay dirección registrada"
            })
        
        this.setState({
            campos: campos,
            perfil: estudiante
        })
    }

    componentWillMount() {
        this._getPerfil();
    }

    render() {
        this._renderPickerCom(lista);
        console.log(lista);
        const nombre = this.state.perfil ? this.state.perfil.nombre : null;
        if(this.state.perfil ? this.state.perfil.sexo.sexo:"" == "Masculino"){
            var otro="Femenino";
        }else{
            var otro="Masculino";
        }
        return (
            <ScrollView>
                <StatusBar
                    barStyle={ES_IOS ? "dark-content" : "light-content"}
                    backgroundColor={colors.primarioOscuro} />

                <View style={styles.headerContainer}>
                    <View style={styles.fotoContainer}>
                        <Image source={{uri: this.state.perfil ? this.state.perfil.fotoUrl : ""}} style={styles.foto} />
                    </View>
                    <Text style={styles.textoNombre}>{nombre != null ? (nombre.completo ? nombre.completo : (nombre.apellidos ? nombre.nombres + " " + nombre.apellidos : nombre)) : ""}</Text>
                    <Text style={styles.textoCorreo}>{this.state.perfil ? this.state.perfil.correoUtem : ""}</Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.textoEtiqueta}>Sexo</Text>
                </View>
                <Picker selectedValue={this.state.language}
                    onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}
                    style={{ left:20,height: 50, width: 300 }}>
                    <Picker.Item label={this.state.perfil ? this.state.perfil.sexo.sexo : ""} value={this.state.perfil ? this.state.perfil.sexo.sexo : ""}></Picker.Item>
                    <Picker.Item label={otro} value={otro}></Picker.Item>
                    <Picker.Item label="Otro" value="Otro"></Picker.Item>
                </Picker>
                
                <View style={styles.container}>
                    <Text style={styles.textoEtiqueta}>Comunas</Text>
                </View>

                <Picker selectedValue={this.state.language}
                    onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}
                    style={{ left:20,height: 50, width: 300 }}>
                    {lista.map((index)=> this._renderPickerCom(index))}
                </Picker>

                <View style={styles.container}>
                    <Text style={styles.textoEtiqueta}>Fecha nacimiento</Text>
                </View>
                
                <DatePicker
                    style={{width: 200}}
                    date={this.state.date}
                    mode="date"
                    placeholder="Fecha de nacimiento"
                    format="DD-MM-YYYY"
                    minDate="01-01-1940"
                    maxDate="01-01-2002"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    androidMode="spinner"
                    customStyles={{
                    dateIcon: {
                        opacity:0,
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                    },
                    dateInput: {
                        marginLeft: 36
                    }
                    // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => {this.setState({date: date})}}
                />
                
                <FlatList
                    data={this.state.campos}
                    style={styles.lista}
                    renderItem={({item}) => 
                        <PerfilCampo etiqueta={item.etiqueta} valor={item.valor}/>
                    }/>
            </ScrollView>
        );

    }
}

const styles = StyleSheet.create({
    headerContainer: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    }, 
    fotoContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    foto: {
        height: 104,
        width: 104,
        borderRadius: 52,
        
    },
    textoNombre: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10
    },
    textoCorreo: {
        color: colors.material.grey['600']
    },
    container: {
        paddingHorizontal: 20
    },
    textoEtiqueta: {
        fontWeight: 'bold'
    }
});