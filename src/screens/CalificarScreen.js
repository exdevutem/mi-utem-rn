import React, { Component } from 'react';
import { View, Text, TextInput, Platform, StatusBar, StyleSheet, SafeAreaView, AsyncStorage, CheckBox, ActivityIndicator, Button } from 'react-native';
import StarRating from 'react-native-star-rating';
import { Cache } from "react-native-cache";
import moment from "moment";
import 'moment/locale/es'

import colors from '../colors';

import ApiUtem from '../ApiUtem';

const ES_IOS = Platform.OS === 'ios';

var apiUtem = new ApiUtem();

var cache = new Cache({
  namespace: "estudiantes",
  policy: {
      maxEntries: 50000
  },
  backend: AsyncStorage
});

moment.locale('es');

export default class CalificarScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calificacionActual: this.props.navigation.getParam('estrellas'),
            anonimoSeleccionado: false,
            comentarioActual: '',
            estaCargando: false
        }
    }

    _sendCalificacion = async () => {
        console.log("Iniciado");
        
        const rut = this.props.navigation.getParam('rutDocente');
        const id = this.props.navigation.getParam('asignaturaId');
        console.log(rut, id);
        
        try {
            const parametros = {
                valor: this.state.calificacionActual,
                comentario: this.state.comentarioActual,
                anonimo: this.state.anonimoSeleccionado,
                asignatura: id
            }
            const respuesta = await apiUtem.sendCalificacion(rut, parametros);
            console.log("Listo");
            
            this.setState({
                estaCargando: false
            });
        } catch (err) {
            console.log(err);

            this.setState({
                estaCargando: false
            });
        }
    }

    _onTextInputChange = (nuevoTexto) => {
        this.setState({
            comentarioActual: nuevoTexto
        });
    }

    _onCheckboxPress = (valor) => {
        this.setState({
            anonimoSeleccionado: valor
        });
    }

    _onStarPress = (estrellas) => {
        this.setState({
            calificacionActual: estrellas
        });
    }

    _onPressEnviar = () => {
        this.setState({
            estaCargando: true
        });
        this._sendCalificacion()
    }
    
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    barStyle={ES_IOS ? "dark-content" : "light-content"}
                    backgroundColor={colors.primarioOscuro} />
                <StarRating
                    maxStars={5}
                    starSize={35}
                    emptyStar='star'
                    rating={this.state.calificacionActual}
                    selectedStar={(rating) => this._onStarPress(rating)}
                    emptyStarColor={colors.material.grey['300']}
                    starStyle={{margin: 10}}
                    fullStarColor={colors.primario} />

                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={this.state.anonimoSeleccionado}
                        onValueChange={(valor) => this._onCheckboxPress(valor)}/>
                    <Text>Como anónimo</Text>
                </View>
                
                <TextInput
                    multiline={true}
                    onChangeText={this._onTextInputChange}
                    underlineColorAndroid={colors.primario}
                    value={this.state.comentarioActual}>
                </TextInput>

                <ActivityIndicator 
                    size="large" 
                    color={colors.primario} 
                    style={[styles.cargando, this.state.estaCargando ? {opacity: 1} : {opacity: 0}]}/>

                <Button
                    title="Enviar"
                    color={colors.primario}
                    onPress={this._onPressEnviar}/>
            </SafeAreaView>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20
    },
    cargando: {
        alignSelf: 'center'
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});