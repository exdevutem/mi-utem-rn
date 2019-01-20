import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet} from 'react-native';

export default class AsignaturasSeccion extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { tipo, seccion } = this.props.seccion;
        const docente = this.props.seccion.docente.nombre ? this.props.seccion.docente.nombre : this.props.seccion.docente
        return (
            <View style={styles.container}>
                <View style={styles.horizontalContainer}>
                    <Text numberOfLines={1} style={styles.texto}>{tipo}</Text>
                    <Text numberOfLines={1} style={styles.texto}>{seccion}</Text>
                    <Text numberOfLines={1} style={styles.texto}>{docente}</Text>
                </View>
            </View>
        );
        
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
