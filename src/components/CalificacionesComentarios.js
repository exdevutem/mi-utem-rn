import React, { Component } from 'react';
import { Platform, Text, View, TextInput, StyleSheet, Image } from 'react-native';

const ES_IOS = Platform.OS === 'ios';

export default class ComentariosCalificaciones extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {comentario} = this.props;
        return(
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.docenteContainer}>
                        <Image source={{uri: comentario.estudiante.fotoUrl}} style={styles.foto} />
                        <View style={styles.datosDocenteContainer}>
                            <Text 
                                style={styles.nombreDocenteTexto}
                                numberOfLines={2}>
                                {comentario.estudiante.nombre}
                            </Text>
                            <Text>{comentario.calificacion} ★ {comentario.fecha}</Text>
                            <Text>{comentario.comentario}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 5,
    },
    textoNombre: {
        fontWeight: 'bold',
        fontSize: 16
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
    nombreDocenteTexto: {
        fontWeight: 'bold',
        fontSize: 16
    },
});