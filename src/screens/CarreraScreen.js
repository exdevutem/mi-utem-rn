import React, { Component } from 'react';
import { ScrollView, Text, processColor, StatusBar, Button, Platform, Alert, ToastAndroid, StyleSheet, View, AsyncStorage } from 'react-native';
import {LineChart, BarChart} from 'react-native-charts-wrapper';
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

export default class CarreraScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
          title: navigation.getParam('nombre', 'Carrera'),
        };
    };

    constructor(props) {
        super(props);
        this.state = { 
            malla: null,
            boletinRendimiento: [0],
            cargandoMalla: true,
            cargandoBoletin: true,
            boletinAsignaturas: [0]
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
        var asignaturas = [];

        for (let i = 0; i < boletin.length; i++) {
            const semestre = boletin[i];
            if (semestre.promedioFinal) {
                rendimiento.push({
                    x: i,
                    y: semestre.promedioFinal
                })
            }

            asignaturas.push({
                y: semestre.asignaturas.length
            });
            
        }
        this.setState({
            boletinRendimiento: rendimiento,
            boletinAsignaturas: asignaturas
        });

        this.refs.rendimientoChart.highlights([])
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
                        <LineChart
                            ref="rendimientoChart"
                            style={styles.chart}
                            data={ {
                                dataSets: [
                                    {
                                        label: "",
                                        config: {
                                            mode: "CUBIC_BEZIER",
                                            drawValues: false,
                                            lineWidth: 2,
                                            drawCircles: true,
                                            circleColor: processColor(colors.primario),
                                            drawCircleHole: false,
                                            circleRadius: 5,
                                            highlightColor: processColor('transparent'), // Color del seleccionado
                                            color: processColor(colors.primario), // color de la linea
                                            drawFilled: true,
                                            fillGradient: {
                                            colors: [processColor('transparent'), processColor(colors.primario)],
                                            positions: [0, 1],
                                            angle: 90,
                                            orientation: "TOP_BOTTOM"
                                            },
                                            fillAlpha: 1000
                                        },
                                        values: this.state.boletinRendimiento
                                    }
                                ]
                            } }
                            xAxis={{
                                enabled: false
                            }}
                            yAxis={{
                                left: {
                                    axisMaximum: 7,
                                    axisMinimum: 1
                                },
                                right: {
                                    enabled: false
                                }
                            }}
                            chartDescription={{text: ''}}
                            legend={{enabled: false}}
                            animation={{
                                durationX: 0,
                                durationY: 1500,
                                easingY: "EaseInOutQuart"
                            }}
                        />
                    </View>
                    
                </View>

                <View style={styles.rendimientoContainer}>
                    <View style={styles.containerHeader}>
                        <Text style={styles.textoHeader}>RENDIMIENTO</Text>
                    </View>
                    <View style={styles.chartContainer}>
                    <BarChart
                        style={styles.chart}
                        data={{
                            dataSets: [{
                              values: [{y: 100}, {y: 105}, {y: 102}, {y: 110}, {y: 114}, {y: 109}, {y: 105}, {y: 99}, {y: 95}],
                              label: 'Bar dataSet',
                              config: {
                                color: processColor('teal'),
                                barShadowColor: processColor('lightgrey'),
                                highlightAlpha: 90,
                                highlightColor: processColor('red'),
                              }
                            }],
                    
                            config: {
                              barWidth: 0.7,
                            }
                        }}
                        xAxis={{
                            valueFormatter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                            granularityEnabled: true,
                            granularity : 1,
                        }}
                        animation={{durationX: 2000}}
                        legend={{
                            enabled: true,
                            textSize: 14,
                            form: 'SQUARE',
                            formSize: 14,
                            xEntrySpace: 10,
                            yEntrySpace: 5,
                            formToTextSpace: 5,
                            wordWrapEnabled: true,
                            maxSizePercent: 0.5
                        }}
                        gridBackgroundColor={processColor('#ffffff')}
                        visibleRange={{x: { min: 5, max: 5 }}}
                        drawBarShadow={false}
                        drawValueAboveBar={true}
                        drawHighlightArrow={true}
                        highlights={[{x: 3}, {x: 6}]}
                    />
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
    textoHeader: {
        color: 'black',
        fontSize: 13,
        fontWeight: '500',
        letterSpacing: 0.5
    },
    rendimientoContainer: {
        flex: 1,
        padding: 1,
        backgroundColor: 'white',
        margin: 10
    },
    chartContainer: {
        height: 200,
        padding: 10
    },
    chart: {
        flex: 1,
        margin: 0
    }
  });