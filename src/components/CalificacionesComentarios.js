import React, { Component } from 'react';
import { Platform, Text, View, TextInput, StyleSheet } from 'react-native';

const ES_IOS = Platform.OS === 'ios';

export default class ComentariosCalificaciones extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.docenteContainer}>
                        <Image source={{uri: this.props.URI}} style={styles.foto} />
                        <View style={styles.datosDocenteContainer}>
                            <Text 
                                style={styles.nombreDocenteTexto}
                                numberOfLines={2}>
                                {this.props.Nombre}
                            </Text>
                            <Text> {this.props.Estrella+" "} {this.props.Fecha}</Text>
                            <Text> {this.props.Comentario}</Text>
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
        backgroundColor: colors.material.grey['200'],
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