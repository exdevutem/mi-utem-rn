import React, { Component } from 'react';
import {Platform, View, Text, TouchableNativeFeedback, TouchableHighlight, StyleSheet} from 'react-native';

export default class AsignaturaItem extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        
    }

    render() {
        if (Platform.OS === 'android') {
            return (
            <TouchableNativeFeedback
                    onPress={this._onPress}
                    style={styles.container}
                    background={TouchableNativeFeedback.SelectableBackground()} >

                
                <View>
                    <Text style={styles.texto}>{this.props.nombre}</Text>
                </View>

            </TouchableNativeFeedback>
           )
        } else {
            return (
                <TouchableHighlight
                        onPress={this._onPress}
                        underlayColor='#E0E0E0'
                        style={styles.container} >

                <View>
                    <Text style={styles.texto}>{this.props.nombre}</Text>
                </View>

                </TouchableHighlight>    
           )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    texto: {
        margin: 20
    }
});
