import React, { Component } from 'react';
import {Platform, View, Text, TouchableNativeFeedback, TouchableHighlight, StyleSheet} from 'react-native';

export default class MallaHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.texto}>{this.props.nivel != null ? "Nivel " + this.props.nivel : "Sin nivel"}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#dcdcdc'
    },
    texto: {
        fontWeight: 'bold',
        padding: 20,
        alignSelf: 'center'
    }
});
