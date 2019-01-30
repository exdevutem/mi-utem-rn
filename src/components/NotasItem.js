import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import NotaInput from './NotaInput'
import colors from '../colors';

export default class NotasItem extends Component {
    
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.editable == prevState.editable) {
            return prevState;
        } else {
            if (nextProps.nota != prevState.notaInicial) {
                return {
                    valorInput: nextProps.nota ? nextProps.nota.toString() : '',
                    notaInicial: nextProps.nota
                }
            }
        }
        /*if (nextProps.editable) { // Si ahora es editable
            if (nextProps.editable == prevState.editable) { // Y antes también era editable
                return prevState;
            } else { // Y antes NO era editable: borraron una nota en Academia

            }
        } else { // Si ahora no es editable
            if (nextProps.editable == prevState.editable) { // Y antes tampoco era editable
                return prevState;
            } else { // Y antes SÍ era editable: agregaron una nota a Academia
                if (nextProps.nota != prevState.notaInicial) {
                    return {
                        valorInput: nota ? nota.toString() : '',
                        notaInicial: nota
                    }
                }
            }
        }
        
        if (nota != prevState.notaInicial) {
            return {
                valorInput: nota ? nota.toString() : '',
                notaInicial: nota
            }
        } else {
            return prevState;
        }*/
    }

    constructor(props) {
        super(props);
        const nota = this.props.nota;
        this.state = {
            valorInput: nota ? nota.toFixed(1) : '',
            editableInicial: this.props.editable,
            notaInicial: nota ? nota.toFixed(1) : ''
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

    _onEndEditing = () => {
        if (this.state.valorInput != '') {
            this.setState((statePrevio) => ({
                valorInput: parseFloat(statePrevio.valorInput).toFixed(1)
            }));
        }
    }

    render() {
        const {ponderador, editable, etiqueta, index} = this.props;

        return(
            <View style={styles.container}>
                <View style={styles.columna}>
                    <Text style={styles.tipoText}>{this._getNombreNota(etiqueta)}:</Text>
                </View>
                
                <View style={styles.columna}>
                    <NotaInput
                        onChangeText={(nuevoTexto) => this.props.onChange(index, nuevoTexto)}
                        onEndEditing={this._onEndEditing}
                        editable={editable}
                        underlineColorAndroid={editable ? colors.material.grey['500'] : 'transparent'}
                        style={[styles.notaInput, editable ? null : {fontWeight: 'bold'}]}
                        value={this.state.valorInput}>
                    </NotaInput>
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