import React, { Component } from 'react';
import {Platform, View, Text, TouchableNativeFeedback, TouchableHighlight, StyleSheet, Alert, ToastAndroid} from 'react-native';
import firebase from 'react-native-firebase';

import colors from '../colors';

const ES_IOS = Platform.OS === 'ios';

export default class MallaItem extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = (asignatura) => {
        firebase.analytics().logEvent("press_asignatura_malla", asignatura);
        if (ES_IOS) {
            Alert.alert('Esta función pronto estará diponible 💪 ');
        } else {
            ToastAndroid.show('Esta función pronto estará diponible 💪 ', ToastAndroid.SHORT);
        }
    }

    _renderContent = (asignatura) => {
        const {codigo, nombre, tipo, estado, nota, oportunidades} = asignatura;
        return (
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <Text numberOfLines={1} style={styles.texto}>{codigo}</Text>
                    <Text numberOfLines={2} style={styles.textoNombre}>{nombre}</Text>
                    <Text numberOfLines={1} style={styles.texto}>{tipo}</Text>
                </View>
                <View style={styles.rightContainer}>
                    <Text numberOfLines={1} style={styles.textoRight}>{estado}</Text>
                    <Text numberOfLines={1} style={styles.textoRight}>{nota != null ? nota.toFixed(1) : ''}</Text>
                    <Text numberOfLines={1} style={styles.textoRight}>
                        {oportunidades != 0 ? oportunidades + ' op': null}
                    </Text>
                </View>
            </View>
        );
    }

    render() {
        const asignatura = this.props.asignatura;
        return Platform.select({
            android: (
                <TouchableNativeFeedback
                    onPress={() => this._onPress(asignatura)}
                    background={TouchableNativeFeedback.SelectableBackground()} >
                    {this._renderContent(asignatura)}
                </TouchableNativeFeedback>
           ),
           ios: (
                <TouchableHighlight
                    onPress={this._onPress}
                    underlayColor={colors.material.grey['300']}>
                    {this._renderContent(asignatura)}
                </TouchableHighlight>
           )
        })
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
    },
    leftContainer: {
        flexDirection: 'column',
        marginVertical: 10,
        marginLeft: 20,
        marginRight: 5,
        flex: 1
    },
    rightContainer: {
        flexDirection: 'column',
        marginVertical: 10,
        marginRight: 20,
        marginLeft: 5,
    },
    textoRight: {
        textAlign: 'right'
    },
    textoNombre: {
        fontWeight: 'bold'
    }
});
