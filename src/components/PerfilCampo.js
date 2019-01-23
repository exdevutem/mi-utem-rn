import React, { Component } from 'react';
import { Platform, Text, View, TextInput, StyleSheet, Picker } from 'react-native';
import DatePicker from 'react-native-datepicker'

const ES_IOS = Platform.OS === 'ios';

const sexos = [
    {
        valor: 1,
        descripcion: "Masculino"
    },
    {
        valor: 2,
        descripcion: "Femenino"
    },
    {
        valor: 0,
        descripcion: "Indefinido/Otro"
    }
]

export default class PerfilCampo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valorActual: this.props.valor ? this.props.valor : '' 
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.valor !== prevState.valorActual ) {
            return {valorActual: nextProps.valor ? nextProps.valor : ''};
        }
    }

    _onTextInputChange = (nuevoTexto) => {
        this.setState({
            valorActual: nuevoTexto
        });
    }

    _renderPickerItem = (label, value) => {
        return(
            <Picker.Item label={label} value= {value}></Picker.Item>
        )
    }

    _renderInput = (tipo, valor, editable) => {
        switch (tipo) {
            case "email":
                return (
                    <TextInput
                        style={styles.textInput}
                        value={this.state.valorActual}
                        onChangeText={this._onTextInputChange}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        editable={editable}>
                    </TextInput>
                )
            case "telefono":
                return (
                    <TextInput
                        style={styles.textInput}
                        value={this.state.valorActual}
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        onChangeText={this._onTextInputChange}
                        editable={editable}>
                    </TextInput>
                )
            case "direccion":
                return (
                    <TextInput
                        style={styles.textInput}
                        value={this.state.valorActual}
                        textContentType="fullStreetAddress"
                        onChangeText={this._onTextInputChange}
                        editable={editable}>
                    </TextInput>
                )
            case "nacimiento":
                return (
                    <DatePicker
                        style={{flex: 1}}
                        date={this.state.valorActual}
                        mode="date"
                        showIcon={false}
                        placeholder="Fecha de nacimiento"
                        format="DD-MM-YYYY"
                        minDate="01-01-1940"
                        maxDate="31-12-2005"
                        confirmBtnText="Aceptar"
                        cancelBtnText="Cancelar"
                        androidMode="spinner"
                        customStyles={{
                            dateInput: {
                                flex: 1,
                                borderColor: 'transparent',
                                alignItems: 'flex-start'
                            },
                            dateText: {
                                textAlign: 'left'
                            }
                        }}
                        onDateChange={(date) => {this.setState({valorActual: date})}}
                    />
                )
            case "sexo":
                return (
                    <Picker
                        selectedValue={this.state.valorActual}
                        onValueChange={(item, index) => this.setState({valorActual: item})}
                        style={{ left: 20, height: 50, width: 300 }} >

                        {sexos.map((sexo) => this._renderPickerItem(sexo.descripcion, sexo.valor))}

                    </Picker>
                )
            default:
                return (
                    <TextInput
                        style={styles.textInput}
                        value={this.state.valorActual}
                        onChangeText={this._onTextInputChange}
                        editable={editable}>
                    </TextInput>
                )
        }
    }

    render() {
        const {etiqueta, tipo, valor, editable} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.textoEtiqueta}>
                    {etiqueta}
                </Text>
                {this._renderInput(tipo, valor, editable)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: ES_IOS ? 10 : 5
    },
    textInput: {
        color: 'black',
        margin: 0,
    },
    textoEtiqueta: {
        fontWeight: 'bold'
    }
});