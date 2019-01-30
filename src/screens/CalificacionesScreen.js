import React, { Component } from 'react';
import { Platform, StatusBar, FlatList, StyleSheet, View, Image, Text, ScrollView, AsyncStorage, RefreshControl, ActivityIndicator } from 'react-native';
import StarRating from 'react-native-star-rating';
import { Cache } from "react-native-cache";
import { BarChart, YAxis } from 'react-native-svg-charts'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as scale from 'd3-scale'

import moment from "moment";
import 'moment/locale/es'

import colors from '../colors';

import CalificacionesComentarios from '../components/CalificacionesComentarios';
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


export default class CalificacionesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calificaciones: null,
            docente: null,
            tusCalificaciones: null,
            calificacionActual: 0,
            estaActualizando: false,
            estaCargandoOtros: true,
            estaCargandoComentarios: true,
        }
    }

    _getCalificaciones = async (forzarApi) => {
        const rut = this.props.navigation.getParam('rutDocente');
        const key = 'docentes' + rut + 'calificaciones';
        cache.getItem(key, async (err, calificacionesCache) => {
            if (!err && calificacionesCache && !forzarApi) {
                this.setState({
                    docente: calificacionesCache.docente,
                    tusCalificaciones: calificacionesCache.calificaciones.tusCalificaciones,
                    estaActualizando: false,
                    estaCargandoOtros: false
                });
            }
            const calificaciones = await apiUtem.getCalificaciones(rut);
            cache.setItem(key, calificaciones, (err) => {
                if (err) console.error(err);
                this.setState({
                    calificaciones: calificaciones.calificaciones,
                    docente: calificaciones.docente,
                    tusCalificaciones: calificaciones.calificaciones.tusCalificaciones,
                    estaActualizando: false,
                    estaCargandoOtros: false,
                    estaCargandoComentarios: false,
                });
            });
        });
    }

    _onStarPress = (estrellas) => {
        this.setState({
            calificacionActual: estrellas
        });
        this.props.navigation.navigate('Calificar', {
            estrellas: estrellas,
            rutDocente: this.props.navigation.getParam('rutDocente'),
            asignaturaId: this.props.navigation.getParam('asignaturaId'),
            nombreDocente: this._getNombre(this.state.docente.nombre),
            onGoBack: () => this._onGoBack()
        })
    }

    componentWillMount() {
        this._getCalificaciones();
    }

    _renderTuCalificacion = (calificaciones) => {
        if (calificaciones && calificaciones.length > 0) {
            const calificacion = calificaciones[0];
            return (
                <CalificacionesComentarios comentario={calificacion} menu={[]}/>
            )
        } else {
            return (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <StarRating
                        containerStyle={{padding: 20}}
                        maxStars={5}
                        starSize={35}
                        emptyStar='star'
                        rating={this.state.calificacionActual}
                        selectedStar={(rating) => this._onStarPress(rating)}
                        emptyStarColor={colors.material.grey['300']}
                        starStyle={{margin: 10}}
                        fullStarColor={colors.primario} />
                </View>
            );
        }
        
        
    }

    _renderComentarios = (comentarios) => {
        if (comentarios && comentarios.length > 0) {
            return (
                <FlatList
                    data={comentarios}
                    style={styles.lista}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => 
                        <CalificacionesComentarios comentario={item} menu={[]}/>
                    }
                />
            );
        } else {
            return (
                <View style={styles.vacioContainer}>
                    <MaterialCommunityIcons name="star-off" size={70} color={colors.material.grey['400']}/>
                    <Text style={styles.vacioTexto}>No hay comentarios para este docente</Text>
                </View>
            );
        }
    }

    _getNombre = (objeto) => {
        return objeto ? (objeto.apellidos ? objeto.nombres + " " + objeto.apellidos : (objeto.completo ? objeto.completo : objeto)) : '';
    }

    _onGoBack = (seCalifico) => {
        if (seCalifico) {
            this.setState({
                estaCargandoComentarios: true,
            });
            this._getCalificaciones(true);
        } else {
            this.setState({
                calificacionActual: 0
            });
        }
    }

    _onRefresh = () => {
        this.setState({
            estaActualizando: true,
        });
        this._getCalificaciones(true);
        
    }
    
    render() {
        const data = [
            {
                value: 50,
                label: 5,
                svg: {
                    fill: colors.primario
                }
            },
            {
                value: 10,
                label: 4,
                svg: {
                    fill: colors.primario,
                },
            },
            {
                value: 40,
                label: 3,
                svg: {
                    fill: colors.primario,
                },
            },
            {
                value: 95,
                label: 2,
                svg: {
                    fill: colors.primario,
                },
            },
            {
                value: 85,
                label: 1,
                svg: {
                    fill: colors.primario,
                },
            },
        ]
        const {calificaciones, tusCalificaciones, docente} = this.state;
        const nombreDocente = docente ? this._getNombre(docente.nombre) : '';
        const promedio = calificaciones ? (calificaciones.promedio ? calificaciones.promedio.toFixed(1) : 'N/C') : '' 
        return (
            <ScrollView 
                style={styles.container}
                refreshControl={
                    <RefreshControl
                      refreshing={this.state.estaActualizando}
                      colors={[colors.primario]}
                      onRefresh={this._onRefresh}/>
                } >
                <StatusBar
                    barStyle={ES_IOS ? "dark-content" : "light-content"}
                    backgroundColor={colors.primarioOscuro} />
                <View style={styles.card}>
                    <ActivityIndicator 
                        size="large" 
                        color={colors.primario} 
                        style={[styles.cargando, this.state.estaCargandoOtros ? {opacity: 1} : {opacity: 0}]}/>
                    
                    <View style={[styles.cardWrapper, this.state.estaCargandoOtros ? {opacity: 0} : {opacity: 1}]}>
                        <View style={styles.docenteContainer}>
                            <Image
                                source={{uri: docente ? docente.fotoUrl : ''}}
                                style={styles.fotoDocente} />
                            <View style={styles.datosDocenteContainer}>
                                <Text 
                                    style={styles.nombreDocenteTexto}
                                    numberOfLines={2}>
                                    {nombreDocente}
                                </Text>
                                <Text> {docente ? docente.correo : ''}</Text>
                            </View>
                        </View>
                        <View style={styles.calificacionContainer}>
                            <Text style={styles.promedioTexto}>
                                {promedio}
                            </Text>

                            <View style={{marginLeft: 10}}>
                                <StarRating
                                    maxStars={5}
                                    emptyStar='star'
                                    emptyStarColor={colors.material.grey['400']}
                                    starStyle={{margin: 2}}
                                    disabled={true}
                                    starSize={15}
                                    rating={parseFloat(calificaciones ? calificaciones.promedio : 0)}
                                    fullStarColor={colors.material.grey['700']} />
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <MaterialIcons name="person" size={15} color={colors.material.grey['700']}/>
                                    <Text style={{marginLeft: 5}}>
                                        2441
                                    </Text>
                                </View>
                            </View>
                        
                            <View style={{ /*flex: 1,*/ flexDirection: 'row', height: 50, marginLeft: 10}}>
                                <BarChart
                                    style={{ flex: 1, marginLeft: 8 }}
                                    data={data}
                                    horizontal={true}
                                    yAccessor={({ item }) => item.value}
                                    spacing={2}
                                    gridMin={0}>
                                </BarChart>
                            </View>
                        </View>
                        
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.textoTitulo}>TU CALIFICACIÓN</Text>
                    <ActivityIndicator 
                        size="large" 
                        color={colors.primario} 
                        style={[styles.cargando, this.state.estaCargandoOtros ? {opacity: 1} : {opacity: 0}]}/>
                    
                    <View style={this.state.estaCargandoOtros ? {opacity: 0} : {opacity: 1}}>
                        {this._renderTuCalificacion(tusCalificaciones)}
                    </View>
                </View>
                
                <View style={styles.card}>
                    <Text style={styles.textoTitulo}>COMENTARIOS</Text>
                    <ActivityIndicator 
                        size="large" 
                        color={colors.primario} 
                        style={[styles.cargando, this.state.estaCargandoComentarios ? {opacity: 1} : {opacity: 0}]}/>
                    
                    <View style={this.state.estaCargandoComentarios ? {opacity: 0} : {opacity: 1}}>
                        
                        {this._renderComentarios(calificaciones ? calificaciones.comentarios : null)}
                    </View>
                    
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
    fotoDocente: {
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
    calificacionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10, 
    },
    promedioTexto: {
        fontSize: 40
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
        fontWeight: 'bold',
        fontSize: 16
    },
    foto: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginRight: 20
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    datosContainer: {
        flex: 1
    },
    nombreTexto: {
        fontWeight: 'bold'
    },
    card: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5,
        elevation: 2
    },
    cardWrapper: {
        padding: 20
    },
    textoTitulo: {
        fontWeight: 'bold',
        paddingVertical: 15,
        paddingHorizontal: 20,
        letterSpacing: 0.5,
        padding: 20,
        borderBottomWidth: 1,
        borderColor: colors.material.grey['300']
    },
    cargando: {
        position: 'absolute',
        alignSelf: 'center',
        top: 0, 
        left: 0,
        bottom: 0,
        right: 0
    },
    vacioContainer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vacioTexto: {
        fontSize: 15,
        marginTop: 10,
        color: colors.material.grey['500']
    }
});