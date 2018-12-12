import React, { Component } from 'react';
import { Platform, SafeAreaView, Text, StyleSheet } from 'react-native';

const ES_IOS = Platform.OS === 'ios';

export default class AsignaturaScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
        };
    }

    render() {
        return (
            <SafeAreaView style={ styles.container }>
                <Text style={styles.titulo}>Asignatura</Text>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center'
    },
    segmented: {
        margin: 20,
    },
    titulo: {
        
    }
});