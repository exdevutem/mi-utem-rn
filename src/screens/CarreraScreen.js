import React, { Component } from 'react';
import { ScrollView, Text, processColor, StatusBar, Button, Platform, Alert, ToastAndroid, StyleSheet, View, AsyncStorage } from 'react-native';
import { AreaChart, Grid, YAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { Circle, Defs, LinearGradient, Stop, Path } from 'react-native-svg'
import { Cache } from "react-native-cache";


import ApiUtem from '../ApiUtem';
import colors from '../colors';

const ES_IOS = Platform.OS === 'ios';

var cache = new Cache({
    namespace: "estudiantes",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
});

var apiUtem = new ApiUtem();

const Gradient = ({ index }) => (
    <Defs key={index}>
        <LinearGradient id={'gradient'} x1={'0%'} y={'0%'} x2={'0%'} y2={'100%'}>
            <Stop offset={'0%'} stopColor={colors.primario} stopOpacity={0.3}/>
            <Stop offset={'100%'} stopColor={colors.primario} stopOpacity={0}/>
        </LinearGradient>
    </Defs>
)

const Decorator = ({ x, y, data }) => {
    return data.map((value, index) => (
        <Circle
            key={ index }
            cx={ x(index) }
            cy={ y(value) }
            r={ 4 }
            stroke={ 'rgb(134, 65, 244)' }
            fill={ 'white' }
        />
    ))
}

const Line = ({ line }) => (
    <Path
        key={'line'}
        d={line}
        stroke={colors.primario}
        fill={'none'}
        strokeWidth="3"
    />
)

export default class CarreraScreen extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            malla: null,
            boletinRendimiento: [],
            cargandoMalla: true,
            cargandoBoletin: true,
            boletinAsignaturas: []
        };
    }

    _getMalla = async () => {
        const rut = await AsyncStorage.getItem('rut');
        const carreraId = this.props.navigation.getParam('id', null);
        
        const key = rut + 'carrera' + carreraId + 'malla';
        cache.getItem(key, async (err, mallaCache) => {
            if (err || !mallaCache) {
                try {
                    const malla = await apiUtem.getMalla(rut, carreraId, true);
                    cache.setItem(key, malla, (err) => {
                        if (err) console.error(err);
                        this.setState({
                            cargandoMalla: false
                        });
            
                        //this._parseMalla(malla)
                    });
                } catch (error) {
                    if (error == "La token ya no es válida") {
                        this.props.navigation.navigate('Login');
                    }
                }
            } else {
                this.setState({
                    cargandoMalla: false
                });

                //this._parseMalla(mallaCache);
            }
        });
    }

    _getBoletin = async () => {
        const rut = await AsyncStorage.getItem('rut');
        const carreraId = this.props.navigation.getParam('id', null);
        
        const key = rut + 'carrera' + carreraId + 'boletin';
        cache.getItem(key, async (err, boletinCache) => {
            if (err || !boletinCache) {
                console.log("DE LA API");
                
                try {
                    const boletin = await apiUtem.getBoletin(rut, carreraId, true);
                    cache.setItem(key, boletin, (err) => {
                        if (err) console.error(err);
                        this.setState({
                            cargandoBoletin: false
                        });
            
                        this._parseBoletinRendimiento(boletin)
                    });
                } catch (error) {
                    if (error == "La token ya no es válida") {
                        this.props.navigation.navigate('Login');
                    }
                }
                
            } else {
                console.log("DEL CACHE");
                this.setState({
                    cargandoBoletin: false
                });

                this._parseBoletinRendimiento(boletinCache);
            }
        });
    }

    _parseBoletinRendimiento = (boletin) => {        
        var rendimiento = [];

        for (let i = 0; i < boletin.length; i++) {
            const semestre = boletin[i];
            if (semestre.promedioFinal) {
                rendimiento.push(semestre.promedioFinal)
            }
            
        }
        this.setState({
            boletinRendimiento: rendimiento,
            boletinAsignaturas: []
        });
    }

    _onPressMalla() {
        this.props.navigation.navigate('Malla', {
            id: this.props.navigation.getParam('id', null)
        });
    }

    _onPressBoletin() {
        /*this.props.navigation.navigate('Boletin', {
            id: this.props.navigation.getParam('id', null)
        });
        */
       if (ES_IOS) {
            Alert.alert('Esta función pronto estará diponible 💪 ');
        } else {
            ToastAndroid.show('Esta función pronto estará diponible 💪 ', ToastAndroid.SHORT);
        }
    }

    componentWillMount() {
        this._getBoletin();
        this._getMalla();
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <StatusBar
                    barStyle={ES_IOS ? "dark-content" : "light-content"}
                    backgroundColor={colors.primarioOscuro} />

                <View style={styles.rendimientoContainer}>
                    <View style={styles.containerHeader}>
                        <Text style={styles.textoHeader}>RENDIMIENTO</Text>
                    </View>
                    <View style={styles.chartContainer}>
                        <AreaChart
                            style={{ height: 200 }}
                            data={ this.state.boletinRendimiento }
                            contentInset={{ top: 30, bottom: 30 }}
                            curve={ shape.curveNatural }
                            numberOfTicks={ 4 }
                            svg={{ fill: 'url(#gradient)' }}
                            yMin={0}
                            yMax={7}
                            animate={true} >
                            <Line/>
                            <Decorator/>
                            <Gradient/>
                            <Grid/>
                        </AreaChart>
                        <YAxis
                            style={ { position: 'absolute', top: 0, bottom: 0 }}
                            data={ [0, 1, 2, 3, 4, 5, 6, 7] }
                            contentInset={ { top: 10, bottom: 10 } }
                            formatLabel={ value => `${value}.0` }
                            svg={ {
                                fontSize: 8,
                                fill: 'white',
                                stroke: 'black',
                                strokeWidth: 0.1,
                                alignmentBaseline: 'baseline',
                                baselineShift: '3',
                            } }
                        />

                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.valorContainer}>
                            <Text style={styles.valorText}>13</Text>
                            <Text style={styles.labelText}>Aprobadas</Text>
                        </View>
                        <View style={styles.valorContainer}>
                            <Text style={styles.valorText}>2</Text>
                            <Text style={styles.labelText}>Rendimiento</Text>
                        </View>
                        <View style={styles.valorContainer}>
                            <Text style={styles.valorText}>5</Text>
                            <Text style={styles.labelText}>Inscritas</Text>
                        </View>
                    </View>
                </View>

                <Button
                    onPress={this._onPressMalla.bind(this)}
                    title="Ir a Malla" />

                <Button
                    onPress={this._onPressBoletin.bind(this)}
                    title="Ir a Boletín" />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.material.grey['200']
    },
    containerHeader: {
        borderBottomWidth: 1,
        borderColor: colors.material.grey['300'],
        padding: 20
    },
    contentContainer: {
        padding: 10,
        paddingTop: 0,
        flexDirection: 'row'
    },
    valorContainer: {
        flex: 1,
        padding: 10
    },
    valorText: {
        color: 'black',
        fontSize: 22,
        fontWeight: '500',
        letterSpacing: 0.5,
        alignSelf: 'center'
    },
    labelText: {
        fontSize: 13,
        color: 'grey',
        alignSelf: 'center'
    },
    textoHeader: {
        color: 'black',
        fontSize: 13,
        fontWeight: '500',
        letterSpacing: 0.5
    },
    rendimientoContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    chartContainer: {
        height: 200
    },
    chart: {
        flex: 1
    }
  });