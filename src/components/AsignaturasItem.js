import React, { Component } from 'react';
import {Platform, FlatList, View, Text, TouchableHighlight, TouchableNativeFeedback, StyleSheet} from 'react-native';

import colors from '../colors';
import AsignaturasSeccion from '../components/AsignaturasSeccion';

export default class CarrerasItem extends Component {
    constructor(props) {
        super(props);
    }

    _getTipos = (asignatura) => {
        var tipos = [];
        asignatura.secciones.forEach(seccion => {
            tipos.push(seccion.tipo)
        });
        return tipos;
    }

    _onPress = () => {
        this.props.navigation.navigate('Asignatura', {
            id: this.props.asignatura._id,
            nombre: this.props.asignatura.nombre,
            codigo: this.props.asignatura.codigo,
            secciones: this.props.asignatura.secciones
        });
    }

    _renderContent = (asignatura) => {
        const { codigo, nombre } = asignatura;
        const periodo = asignatura.periodo ? asignatura.periodo.anio + '/' + asignatura.periodo.semestre : ''
        const secciones = asignatura.secciones;
        return (
            <View style={styles.container} pointerEvents='box-only'>
                <View style={styles.horizontalContainer}>
                    <Text numberOfLines={1} style={styles.texto}>{codigo}</Text>
                    <Text numberOfLines={1} style={styles.texto}>{periodo}</Text>
                </View>
                <Text numberOfLines={2} style={[styles.texto, styles.textoNombre]}>{nombre}</Text>
                
                <FlatList
                    data={secciones}
                    keyExtractor={(item) => codigo + '/' + item.seccion + '/' + item.tipo}
                    renderItem={({item}) => <AsignaturasSeccion asignatura={asignatura} seccion={item}/> } />
            </View>
        );
    }

    render() {
        const asignatura = this.props.asignatura;

        return Platform.select({
            android: (
                <TouchableNativeFeedback
                    onPress={this._onPress}
                    background={TouchableNativeFeedback.SelectableBackground()} >
                    {this._renderContent(asignatura)}
                </TouchableNativeFeedback>
           ),
           ios: (
                <TouchableHighlight
                    onPress={this._onPress}
                    underlayColor={colors.material.grey['300']}>
                    {this._renderContent(asignatura)}
                </TouchableHighlight>
           )
        })
        
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    texto: {
        fontWeight: 'bold'
    },
    textoNombre: {
        fontSize: 16
    }
});
