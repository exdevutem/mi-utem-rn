import React, { Component } from 'react';
import {Platform, View, Text, TouchableNativeFeedback, TouchableHighlight, StyleSheet} from 'react-native';

export default class MallaItem extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        
    }

    render() {
        const {codigo, nombre, tipo, estado, nota, oportunidades} = this.props.asignatura;
        if (Platform.OS === 'android') {
            return (
            <TouchableNativeFeedback
                onPress={this._onPress}
                background={TouchableNativeFeedback.SelectableBackground()} >

                <View style={styles.container}>
                    <View style={styles.leftContainer}>
                        <Text numberOfLines={1} style={styles.texto}>{codigo}</Text>
                        <Text numberOfLines={2} style={styles.textoNombre}>{nombre}</Text>
                        <Text numberOfLines={1} style={styles.texto}>{tipo}</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <Text numberOfLines={1} style={styles.textoRight}>{estado}</Text>
                        <Text numberOfLines={1} style={styles.textoRight}>{nota}</Text>
                        <Text numberOfLines={1} style={styles.textoRight}>
                            {oportunidades != 0 ? oportunidades + ' op': null}
                        </Text>
                    </View>
                </View>

            </TouchableNativeFeedback>
           )
        } else {
            return (
                <TouchableHighlight
                        onPress={this._onPress}
                        underlayColor='#E0E0E0'>
                
                <View style={styles.container}>
                    <View style={styles.leftContainer}>
                        <Text numberOfLines={1} style={styles.texto}>{codigo}</Text>
                        <Text numberOfLines={2} style={styles.textoNombre}>{nombre}</Text>
                        <Text numberOfLines={1} style={styles.texto}>{tipo}</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <Text numberOfLines={1} style={styles.textoRight}>{estado}</Text>
                        <Text numberOfLines={1} style={styles.textoRight}>{nota}</Text>
                        <Text numberOfLines={1} style={styles.textoRight}>
                            {oportunidades != 0 ? oportunidades + ' op': null}
                        </Text>
                    </View>
                </View>

                </TouchableHighlight>    
           )
        }
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
