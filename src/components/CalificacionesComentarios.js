import React, { Component } from 'react';
import { Platform, Text, View, TextInput, StyleSheet, Image } from 'react-native';
import GeneralStarExample from '../components/CalificacionEstrellas';
const ES_IOS = Platform.OS === 'ios';

export default class ComentariosCalificaciones extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {comentario} = this.props;
        return(
            <View style={styles.container}>
                <View style={styles.docenteContainer}>
                    <Image source={{uri: comentario.estudiante.fotoUrl}} style={styles.foto} />
                    <View style={styles.datosContainer}>
                        <Text 
                            style={styles.nombreTexto}
                            numberOfLines={2}>
                            {comentario.estudiante.nombre}
                        </Text>
                        <GeneralStarExample bool={true} valor={comentario.calificacion} tamaño={10}></GeneralStarExample>
                        <Text> {comentario.fecha}</Text>
                        <Text>{comentario.comentario}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
    },
    textoNombre: {
        fontWeight: 'bold',
        fontSize: 16
    },
    foto: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginRight: 20
    },
    docenteContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    datosContainer: {
        flex: 1
    },
    nombreTexto: {
        fontWeight: 'bold'
    },
});