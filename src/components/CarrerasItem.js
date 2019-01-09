import React, { Component } from 'react';
import {Platform, View, Text, TouchableHighlight, TouchableNativeFeedback, StyleSheet} from 'react-native';

import colors from '../colors';

const estadoAlerta = [
    "Sin Especificar",
    "Causal de Eliminación",
    "Postergado con Matricula",
    "Transitorio",
    "Morosidad Arancelaria",
    "Congelado y Postergado",
    "Moroso Autorizado Toma Ramo",
    "Congelación automatica",
    "Alumno condicionado a inscrip.",
    "Cambio de regimen",
    "Cambio de Rut"];

const estadoUrgente = [
    "Suspendido",
    "Eliminado",
    "Abandono Voluntario con Matric",
    "Renunciado",
    "Postergado sin matricula",
    "Abandono Voluntario",
    "Expulsado",
    "Solicitud Rechazada",
    "Egresado Abandono Voluntario",
    "Renuncia al Proceso",
    "Carr no Pertenece a Docencia",
    "Alumno Fallecido",
    "Cambio de Carrera",
    "Cancelacion de Matricula"];

const estadoNormal = [
    "Regular",
    "Egresado Matriculado",
    "Egresado",
    "Congelado",
    "Cambio de Plan",
    "Postulante",
    "Titulado",
    "Egreso Pendiente",
    "Seleccionado",
    "Egresado Titulo Intermedio"];


export default class CarrerasItem extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        this.props.navigation.navigate('Carrera', {
            id: this.props.carrera._id,
            nombre: this.props.carrera.carrera.nombre
        });
    }

    _renderContent = (carrera, color) => {
        const { codigo, nombre } = carrera.carrera;
        const estado = carrera.estado;
        const plan = carrera.plan.numero;
        return (
            <View style={styles.container}>
                <View style={styles.horizontalContainer}>
                    <Text numberOfLines={1} style={styles.texto}>{codigo + "/" + plan}</Text>
                    <View style={[styles.estadoContainer, {backgroundColor: color}]}>
                        <Text numberOfLines={1} style={styles.textoEstado}>{estado}</Text>
                    </View>
                </View>
                <Text numberOfLines={2} style={styles.textoNombre}>{nombre}</Text>
                <View style={styles.horizontalContainer}>
                    <Text numberOfLines={1}>{"/"}</Text>
                    <Text numberOfLines={1}>{"/"}</Text>
                </View>
            </View>
        );
    }

    render() {
        const carrera = this.props.carrera;

        var colorEstado;
        if (estado) {
            if (estadoAlerta.indexOf(estado) != -1) {
                colorEstado = colors.estados.amarillo
            } else if (estadoUrgente.indexOf(estado) != -1) {
                colorEstado = colors.estados.rojo
            } else {
                colorEstado = colors.primario
            }
        }

        return Platform.select({
            android: (
                <TouchableNativeFeedback
                    onPress={this._onPress}
                    background={TouchableNativeFeedback.SelectableBackground()} >
                    {this._renderContent(carrera, colorEstado)}
                </TouchableNativeFeedback>
           ),
           ios: (
                <TouchableHighlight
                    onPress={this._onPress}
                    underlayColor={colors.material.grey['300']}>
                    {this._renderContent(carrera, colorEstado)}
                </TouchableHighlight>
           )
        })
        
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10 
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textoNombre: {
        fontWeight: 'bold'
    },
    estadoContainer: {
        paddingVertical: 2,
        paddingHorizontal: 15,
        backgroundColor: 'red',
        alignItems: 'stretch',
        borderRadius: 20
    },
    textoEstado: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold'
    }
});
