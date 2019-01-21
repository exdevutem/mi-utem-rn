import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import colors from '../colors';

export default class NotasItem extends Component {
    /*
    TODO:
    - Condiciones para validar el valor del TextInput (Entre 1 y 7, solo numeros y punto, etc)
     */


    constructor(props) {
        super(props);
        this.state = {
            valorInput: ''
        }
    }

    render(){
        const {tipo, ponderador, nota} = this.props.nota;
        const i = this.props.index;

        return(
            <View style={styles.container}>
                <Text style={styles.item}>{tipo}:</Text>
                <TextInput
                    onChangeText={(nuevoTexto) => {
                        this.setState({
                            valorInput: nuevoTexto
                        });
                        this.props.onChange(i, nuevoTexto);
                    }}
                    editable={nota == null}
                    style={styles.item}>{nota ? nota : ''}</TextInput>
                <Text style={styles.item}>{(ponderador)*100}%</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    item:{
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        margin: 10,
        alignItems: 'center',
        fontSize: 15,
        backgroundColor: colors.material.grey['100']
    }
})