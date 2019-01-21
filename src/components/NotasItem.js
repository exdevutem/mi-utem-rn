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
                <View style={styles.columna}>
                    <Text style={styles.tipoText}>{tipo}:</Text>
                </View>
                
                <View style={styles.columna}>
                    <TextInput
                        onChangeText={(nuevoTexto) => {
                            if(Number(nuevoTexto) <= 7 && Number(nuevoTexto)>= 1){
                            this.setState({
                                valorInput: nuevoTexto
                            });
                            this.props.onChange(i, nuevoTexto);
                        }else{
                            this.setState({
                                valorInput: 0
                            });
                            this.props.onChange(i, 0);
                        }}}
                        keyboardType='numeric'
                        editable={nota == null}
                        underlineColorAndroid={colors.material.grey['500']}
                        style={[styles.notaInput, (nota == null) ? null : {fontWeight: 'bold'}]}>
                        {nota ? nota : ''}
                    </TextInput>
                </View>
                
                <View style={styles.columna}>
                    <Text style={styles.ponderadorText}>{(ponderador)*100}%</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    columna: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tipoText: {
        textAlign: 'right',
        alignSelf: 'flex-end',
        fontSize: 15
    },
    notaInput: {
        alignSelf: 'center',
        textAlign: 'center',
        paddingHorizontal: 10
    },
    ponderadorText: {
        textAlign: 'left',
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        fontSize: 15
    }
})