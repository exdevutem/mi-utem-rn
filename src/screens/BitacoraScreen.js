import React, { Component } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import firebase from 'react-native-firebase';

export default class BitacoraScreen extends Component {
    constructor(props) {
        super(props);
        firebase.analytics().setCurrentScreen("BitacoraScreen", "BitacoraScreen");
    }

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