import React, { Component } from 'react';
import { Platform, View, StyleSheet, Text } from 'react-native';

import colors from '../colors';

export default class AsignaturaScreen extends Component {
    render() {        
        return (
            <View style={styles.container}>
                <Text style={styles.texto}>{this.props.datos.tipo}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.material.grey['200']
    },
    texto: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})