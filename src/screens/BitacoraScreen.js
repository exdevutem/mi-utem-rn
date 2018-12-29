import React, { Component } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

export default class BitacoraScreen extends Component {
    render() {
        return (
            <SafeAreaView>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.primarioOscuro} />
            </SafeAreaView>
        );
    }
}