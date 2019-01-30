import React, { Component } from 'react';
import { Platform, StyleSheet, View, SafeAreaView, AsyncStorage, SectionList, StatusBar, ActivityIndicator } from 'react-native';
import { Cache } from "react-native-cache";

import BoletinItem from '../components/BoletinItem';
import BoletinHeader from '../components/BoletinHeader';

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
  
export default class BoletinScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            datos: [],
            estaCargando: true
        };
    }

    _getBoletin = async (forzarApi) => {
        const rut = await AsyncStorage.getItem('rut');
        const carrera = this.props.navigation.getParam('carrera', null);
        
        const key = rut + 'carrera' + carrera._id + 'boletin';
        cache.getItem(key, async (err, boletinCache) => {
            if (forzarApi || err || !boletinCache) {
                
                try {
                    const boletin = await apiUtem.getBoletin(rut, carrera._id, true);
                    cache.setItem(key, boletin, (err) => {
                        if (err) console.error(err);
                        this.setState({
                            estaCargando: false
                        });

                        this._parseBoletin(boletin)
                    });
                } catch (error) {
                    if (error == "La token ya no es válida") {
                        this.props.navigation.navigate('Login');
                    }
                }
                
            } else {
                this.setState({
                    estaCargando: false
                });

                this._parseBoletin(boletinCache);
            }
        });
    }

    _parseBoletin = (json) => {
        console.log(json);
        
        var boletin = [];
        json.forEach(semestre => {
            boletin.push({
                titulo: semestre.nombre,
                data: semestre.asignaturas
            });
        });

        this.setState({
            datos: boletin
        });
    }

    componentWillMount() {
        this._getBoletin();
    }

    render() {
        return (
            <SafeAreaView style={ styles.container }>
                <StatusBar
                    barStyle={ES_IOS ? "dark-content" : "light-content"}
                    backgroundColor={colors.primarioOscuro} />

                <ActivityIndicator 
                    size="large" 
                    color={colors.primario} 
                    style={[styles.cargando, this.state.estaCargando ? {opacity: 1} : {opacity: 0}]}/>

                <View style={[styles.contentContainter, this.state.estaCargando ? {opacity: 0} : {opacity: 1}]}>
                    <SectionList
                        sections={ this.state.datos }
                        stickySectionHeadersEnabled={ true }
                        renderSectionHeader={({section: {titulo}}) => <BoletiniHeader nivel={titulo}/>}
                        renderItem={({item, index, section}) => <BoletinItem asignatura={item} />}
                        SectionSeparatorComponent={({ trailingItem, section }) =>
                            trailingItem ? null : (<View style={{padding: 5}} />)
                        }
                        ItemSeparatorComponent={() => (<View style={{borderBottomWidth: 1, borderColor: '#dcdcdc'}} />)}
                        keyExtractor={ (item, index) => item + index }/>
                </View>
                
            </SafeAreaView>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.material.grey['200'],
    },
    contentContainter: {
        flex: 1
    },
    cargando: {
        position: 'absolute',
        alignSelf: 'center',
        top: 0, 
        left: 0,
        bottom: 0,
        right: 0
    }
});