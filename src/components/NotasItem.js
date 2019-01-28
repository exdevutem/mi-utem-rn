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
        const nota = this.props.nota;
        this.state = {
            valorInput: nota ? nota.toFixed(1) : '',
            notaInicial: nota ? nota.toFixed(1) : ''
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const nota = nextProps.nota;
        if (nextProps.editable && nota !== prevState.notaInicial) {
            return {
                valorInput: nota ? nota.toFixed(1) : '',
                notaInicial: nota ? nota.toFixed(1) : ''
            }
        } else {
            return null;
        }
    }

    _getNombreNota = (nombre) => {
        var nuevoNombre = nombre;
        
        if (nombre == "Nota Acum.") {
            nuevoNombre = "Acumulativa";
        } else if (nombre == "Trabaj") {
            nuevoNombre = "Trabajo";
        }
        return nuevoNombre;
    }

    _onBlur = () => {
        if (this.state.valorInput != '') {
            if (parseFloat(this.state.valorInput) > 7) {
                this.setState({
                    valorInput: (7).toFixed(1)
                });
            } else {
                console.log(parseFloat(statePrevio.valorInput));
                
                this.setState((statePrevio) => ({
                    valorInput: parseFloat(statePrevio.valorInput).toFixed(1)
                }));
            }
        }
    }

    render() {
        const {index, ponderador, nota, editable, etiqueta} = this.props;

        return(
            <View style={styles.container}>
                <View style={styles.columna}>
                    <Text style={styles.tipoText}>{this._getNombreNota(etiqueta)}:</Text>
                </View>
                
                <View style={styles.columna}>
                    <TextInput
                        onChangeText={(nuevoTexto) => {
                            const caracteres = '0123456789.';
                            var textoLimpio = '';

                            for (var j = 0; j < nuevoTexto.length; j++) {
                                if (caracteres.indexOf(nuevoTexto[j]) > -1 ) {
                                    textoLimpio += nuevoTexto[j];
                                } else {
                                    // your call back function
                                }
                            }

                            this.setState({
                                valorInput: textoLimpio
                            });
                            this.props.onChange(index, textoLimpio);
                        }}
                        onBlur={this._onBlur}
                        keyboardType='numeric'
                        maxLength={3}
                        editable={editable}
                        underlineColorAndroid={editable ? colors.material.grey['500'] : null}
                        style={[styles.notaInput, editable ? null : {fontWeight: 'bold'}]}
                        value={this.state.valorInput}>
                    </TextInput>
                </View>
                
                <View style={styles.columna}>
                    <Text style={styles.ponderadorText}>{(ponderador * 100).toFixed(0)}%</Text>
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
        paddingHorizontal: 10,
        color: 'black'
    },
    ponderadorText: {
        textAlign: 'left',
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        fontSize: 15
    }
})