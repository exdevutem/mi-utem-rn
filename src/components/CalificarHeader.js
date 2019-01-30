import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

import colors from '../colors';

export default class SeccionScreen extends Component {
    render() {
        return (
            <View>
                <Text numberOfLines={1} style={styles.textoPrincipal}>{this.props.docente}</Text>
                <Text numberOfLines={1} style={styles.textoSecundario}>Calificar</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textoPrincipal: {
        fontSize: Platform.OS === 'ios' ? 17 : 18,
        fontWeight: Platform.OS === 'ios' ? '600' : '500',
        color: Platform.OS === 'ios' ? colors.primario : 'white',
        textAlign: Platform.OS === 'ios' ? 'center' : 'left',
        marginHorizontal: 16,
    },
    textoSecundario: {
        color: Platform.OS === 'ios' ? colors.primario : 'white',
        marginHorizontal: 16,
        textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    }
})

