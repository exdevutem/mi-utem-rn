import React, { Component } from 'react';
import { Platform, SafeAreaView, StatusBar } from 'react-native';

const ES_IOS = Platform.OS === 'ios';

export default class BoletinScreen extends Component {
    render() {
        return (
            <SafeAreaView>
                <StatusBar
                    barStyle={ES_IOS ? "dark-content" : "light-content"}
                    backgroundColor={colors.primarioOscuro} />
            </SafeAreaView>
        );
    }
}