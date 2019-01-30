import React, { Component } from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class BoletinHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.texto}>{this.props.nivel != null ? this.props.nivel : "Sin nombre"}</Text>
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
