import React, { Component } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

export default class NotasScreen extends Component {
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