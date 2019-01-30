import React, { Component } from 'react';
import {TextInput} from 'react-native';

export default class NotaInput extends Component {
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value != prevState.initial) {
            return {
                initial: nextProps.value ? (typeof(nextProps.value) === "string" ? nextProps.value : nextProps.value.toString()) : '',
                value: nextProps.value ? (typeof(nextProps.value) === "string" ? nextProps.value : nextProps.value.toString()) : ''
            }
        } else {
            return prevState;
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            initial: this._getValorInput(this.props.value),
            value: this._getValorInput(this.props.value)
        }
    }

    _getValorInput = (value) => {
        if (value) {
            if (typeof(value) !== "string")
                return value.toString();
            return value;
        } else {
            return '';
        }
    }

    _textoLimpio = (texto) => {
        const caracteresPermitidos = '0123456789.,';
        var textoLimpio = '';

        for (var i = 0; i < texto.length; i++) {
            if (caracteresPermitidos.indexOf(texto[i]) > -1 ) {
                if (texto[i] === ',') {
                    textoLimpio += '.';
                } else {
                    textoLimpio += texto[i];
                }
            } else {
                //invalidCallback();
            }
        }
        if (textoLimpio.length > 0 && parseFloat(textoLimpio) > 7) {
                return '7.0';
        } else {
            return textoLimpio;
        }
    }

    render() {
        return (
            <TextInput
                onChangeText={(nuevoTexto) => {
                    var textoLimpio = this._textoLimpio(nuevoTexto);
                    this.setState({
                        value: this._getValorInput(textoLimpio)
                    });
                    this.props.onChangeText(textoLimpio);
                }}
                onEndEditing={this.props.onEndEditing}
                onBlur={this.props.onBlur}
                keyboardType='decimal-pad'
                maxLength={3}
                editable={this.props.editable ? this.props.editable : false}
                underlineColorAndroid={this.props.underlineColorAndroid}
                style={this.props.style}
                value={this.state.value}>
            </TextInput>
        )
    }
}