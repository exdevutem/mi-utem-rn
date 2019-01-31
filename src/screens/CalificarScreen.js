import React, { Component } from 'react';
import { View, Text, TextInput, Platform, StatusBar, StyleSheet, SafeAreaView, AsyncStorage, CheckBox, ActivityIndicator, Button } from 'react-native';
import StarRating from 'react-native-star-rating';
import { Cache } from "react-native-cache";
import firebase from 'react-native-firebase';
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
        firebase.analytics().setCurrentScreen("CalificarScreen", "CalificarScreen");
        this.state = {
            calificacionActual: this.props.navigation.getParam('estrellas'),
            anonimoSeleccionado: false,
            comentarioActual: '',
            estaCargando: false
        }
    }

    _sendCalificacion = async () => {
        const rut = this.props.navigation.getParam('rutDocente');
        const id = this.props.navigation.getParam('asignaturaId');
        var valor = this.state.calificacionActual;
        if (valor > 5) {
            valor = 5;
        } else if (valor < 1) {
            valor = 1;
        }

        try {
            
            const parametros = {
                valor: valor,
                anonimo: this.state.anonimoSeleccionado,
                comentario: this.state.anonimoSeleccionado ? null : this.state.comentarioActual,
                asignatura: id
            }
            const respuesta = await apiUtem.sendCalificacion(rut, parametros);
            firebase.analytics().logEvent("califica_docente", {
                docente: rut
            });
            this.setState({
                estaCargando: false
            });
            this.props.navigation.setParams({
                estaCargando: true
            });
            this.props.navigation.state.params.onGoBack(true);
            this.props.navigation.goBack();
        } catch (err) {
            console.error(err);

            this.setState({
                estaCargando: false
            });
            this.props.navigation.setParams({
                estaCargando: true
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
        this.props.navigation.setParams({
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
                    style={styles.botonPublicar}
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