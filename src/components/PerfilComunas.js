import React, { Component } from 'react';
import { Platform, Text, View, TextInput, StyleSheet,Picker } from 'react-native';

const ES_IOS = Platform.OS === 'ios';

export default class PerfilComunas extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Picker selectedValue={this.state.language}
                onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}
                style={{ left:20,height: 50, width: 300 }}>
                <Picker.Item label={this.props.comuna} value={this.props.com} />
            </Picker>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: ES_IOS ? 10 : 5
    },
    textoEtiqueta: {
        fontWeight: 'bold'
    }
});