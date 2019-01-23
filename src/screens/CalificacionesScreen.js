import React, { Component } from 'react';
import { Platform, StatusBar, FlatList, StyleSheet, View, Image, Text, ScrollView } from 'react-native';
import {calificaciones} from '../static/estudiantes'
import ComentariosCalificaciones from '../components/CalificacionesComentarios';
import GeneralStarExample from '../components/CalificacionEstrellas';
const ES_IOS = Platform.OS === 'ios';

export default class CalificacionesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calificaciones: calificaciones // Se setean vacíos los comentarios la primera vez
        }
    }

    _parseCalificaciones = (calificaciones) => {
        this.setState({
            calificaciones: calificaciones
        });
    }

    _getCalificaciones = () => {
        // Aqui irá todo lo de la API
        // const calificaciones = calificaciones; // Se guardará en esta variable
        this._parseCalificaciones(calificaciones);
    }

    componentWillMount() {
        this._getCalificaciones();
    }
    
    render() {
        const {calificaciones} = this.state;
        return (
            <ScrollView style={styles.container}>
                <StatusBar
                    barStyle={ES_IOS ? "dark-content" : "light-content"}
                    backgroundColor={colors.primarioOscuro} />
                <View style={styles.card}>
                    <View style={styles.docenteContainer}>
                        <Image source={{uri: calificaciones ? calificaciones.docente.fotoUrl : ''}} style={styles.foto} />
                        <View style={styles.datosDocenteContainer}>
                            <Text 
                                style={styles.nombreDocenteTexto}
                                numberOfLines={2}>
                                {calificaciones ? calificaciones.docente.nombre : ''}
                            </Text>
                            <Text> {calificaciones ? calificaciones.docente.correo : ''}</Text>
                            <Text> Total evaluaciones: {calificaciones ? calificaciones.calificaciones.totales:''} </Text>
                            <GeneralStarExample bool={true} valor={calificaciones ? calificaciones.calificaciones.promedio : ''} tamaño={25}></GeneralStarExample>
                        </View>
                    </View>
                </View>
                <View style={styles.card}>
                    <Text style={styles.textoNombre}>Comentarios</Text>
                    <FlatList
                        data={calificaciones ? calificaciones.calificaciones.comentarios : []}
                        style={styles.lista}
                        renderItem={({item}) => 
                            <ComentariosCalificaciones comentario={item}/>
                        }/>
                </View>
                
            </ScrollView>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.material.grey['200']
    },
    foto: {
        height: 80,
        width: 80,
        borderRadius: 35,
        marginRight: 20
    },
    docenteContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    datosDocenteContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    nombreDocenteTexto: {
        fontWeight: 'bold',
        fontSize: 16
    },
    card: {
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 5,
        padding: 20,
        elevation: 2
    },
});