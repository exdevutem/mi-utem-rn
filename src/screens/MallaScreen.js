import React, { Component } from 'react';
import { Platform, StyleSheet, View, SafeAreaView, AsyncStorage, SectionList, StatusBar, ActivityIndicator } from 'react-native';
import { Cache } from "react-native-cache";

import MallaItem from '../components/MallaItem';
import MallaHeader from '../components/MallaHeader';

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
  
export default class MallaScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            datos: [],
            estaCargando: true
        };
    }

    _getMalla = async () => {
        const rut = await AsyncStorage.getItem('rut');
        const carreraId = this.props.navigation.getParam('id', null);
        console.log(carreraId);
        
        const key = rut + 'carrera' + carreraId + 'malla';
        cache.getItem(key, async (err, mallaCache) => {
            if (err || !mallaCache) {
                const malla = await apiUtem.getMalla(rut, carreraId);
                cache.setItem(key, malla, (err) => {
                    if (err) console.error(err);
                    this.setState({
                        estaCargando: false
                    });
        
                    this._parseMalla(malla)
                });
            } else {
                this.setState({
                    estaCargando: false
                });

                this._parseMalla(mallaCache);
            }
        });
    }

    _parseMalla = (json) => {
        var malla = [];
        json.malla.forEach(semestre => {
            malla.push({
                titulo: semestre.nivel,
                data: semestre.asignaturas
            });
        });

        this.setState({
            datos: malla
        });
    }

    _renderItem = (asignatura, index) => {
        return <MallaItem asignatura={asignatura} />
    }

    _renderSectionHeader = (nivel) => {
        return <MallaHeader nivel={nivel}/>
    }

    componentWillMount() {
        this._getMalla();
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
                        renderSectionHeader={({section: {titulo}}) => this._renderSectionHeader(titulo)}
                        renderItem={({item, index, section}) => this._renderItem(item, index)}
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