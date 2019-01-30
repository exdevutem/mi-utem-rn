import React, { Component } from 'react';
import { StyleSheet, Platform, SafeAreaView, AsyncStorage, FlatList, RefreshControl, StatusBar } from 'react-native';
import { Cache } from "react-native-cache";

import ApiUtem from '../ApiUtem';
import CarrerasItem from '../components/CarrerasItem';
import colors from '../colors';

const ES_IOS = Platform.OS === 'ios';

var apiUtem = new ApiUtem();

var cache = new Cache({
    namespace: "estudiantes",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
});

var apiUtem = new ApiUtem();
  
export default class CarrerasScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            carreras: [],
            estaActualizando: false
        };
    }

    _parseCarreras = (json) => {
        this.setState({
            carreras: json,
            estaActualizando: false
        });
    }

    _getCarreras = async (forzarApi) => {
        const rut = await AsyncStorage.getItem('rut');
        const key = rut + 'carreras';
        cache.getItem(key, async (err, carrerasCache) => {
          
            if (forzarApi || err || !carrerasCache) {
                const carreras = await apiUtem.getCarreras(rut);
                cache.setItem(key, carreras, (err) => {
                    if (err) console.error(err);
                    this._parseCarreras(carreras);
                });
            } else {
                this._parseCarreras(carrerasCache);
            }
        });
      }

    _refreshCarreras = async () => {
        this.setState({
            estaActualizando: true
        });

       this._getCarreras(true);
    }

    componentWillMount() {
        this._getCarreras();
    }

    render() {
        return (
            <SafeAreaView style={ styles.container }>
                <StatusBar
                    barStyle={ES_IOS ? "dark-content" : "light-content"}
                    backgroundColor={colors.primarioOscuro} />
                <FlatList
                    data={this.state.carreras}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.estaActualizando}
                            onRefresh={this._refreshCarreras.bind(this)}
                            colors={[colors.primario]}
                         />
                      }
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({item}) => <CarrerasItem carrera={item} navigation={this.props.navigation}/> } />
            </SafeAreaView>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee'
    },
    item: {
        backgroundColor: 'white'
    },
    texto: {
        padding: 20
    }
});