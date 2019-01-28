import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image, TouchableNativeFeedback } from 'react-native';
import StarRating from 'react-native-star-rating';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import moment from "moment";
import 'moment/locale/es'

import colors from '../colors';

const ES_IOS = Platform.OS === 'ios';

moment.locale('es');

export default class ComentariosCalificaciones extends Component {
    constructor(props) {
        super(props);
    }

    _renderComentario = (comentario) => {
        if (comentario.comentario) {
            return (
                <Text>{comentario.comentario}</Text>
            )
        } else {
            return null;
        }
        
    }

    _getNombre = (objeto) => {
        return objeto ? (objeto.apellidos ? objeto.nombres + " " + objeto.apellidos : (objeto.completo ? objeto.completo : objeto)) : '';
    }

    render() {
        const {comentario} = this.props;
        return(
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <Image source={{uri: comentario.estudiante.fotoUrl}} style={styles.foto} />
                    <View style={styles.datosContainer}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                                <Text 
                                    style={styles.textoNombre}
                                    numberOfLines={2}>
                                    {this._getNombre(comentario.estudiante.nombre)}
                                </Text>

                                <View style={styles.subContainer}>
                                    <StarRating
                                        maxStars={5}
                                        emptyStar='star'
                                        emptyStarColor={colors.material.grey['400']}
                                        starStyle={{margin: 1}}
                                        disabled={true}
                                        starSize={10}
                                        rating={comentario.calificacion}
                                        fullStarColor={colors.material.grey['700']} />
                                    <Text style={styles.subTexto}>{moment(comentario.fecha).fromNow()}</Text>
                                </View>
                            </View>

                            <View style={{borderRadius: 20, overflow: 'hidden', height: 40, width: 40}}>
                                <TouchableNativeFeedback
                                    style={{borderRadius: 15}}
                                    onPress={() => {}}
                                    background={TouchableNativeFeedback.Ripple('grey', true)} >
                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} pointerEvents='box-only'>
                                        <MaterialIcons name="more-vert" size={25} color="grey"/>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                        

                        {comentario.comentario ? <Text>{comentario.comentario}</Text> : null}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
        paddingLeft: 20,
        paddingRight: 5
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5
    },
    subTexto: {
        fontSize: 12,
        color: 'grey',
        marginLeft: 10
    },
    textoNombre: {
        fontWeight: 'bold'
    },
    foto: {
        height: 50,
        width: 50,
        borderRadius: 25,
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