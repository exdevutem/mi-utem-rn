import React, { Component } from 'react';
import { StyleSheet, Text, SafeAreaView, AsyncStorage, FlatList, RefreshControl } from 'react-native';
import { Cache } from "react-native-cache";

import ApiUtem from '../ApiUtem';
import CarrerasItem from '../components/CarrerasItem';
import colors from '../colors';

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
            datos: [],
            estaActualizando: false
        };
    }

    _parseCarreras = (json) => {
        this.setState({
            datos: json,
            estaActualizando: false
        });
    }

    _getCarreras = async () => {
        const rut = await AsyncStorage.getItem('rut');
        cache.getItem(rut + 'carreras', async (err, cache) => {
            if (err) {
                const token = await AsyncStorage.getItem('userToken');
                const carreras = await apiUtem.getCarreras(token, rut);
                this._parseCarreras(carreras);
            } else {
                this._parseCarreras(cache);
            }
            
        });
    }

    _refreshCarreras = async () => {
        this.setState({
            estaActualizando: true
        });

        const rut = await AsyncStorage.getItem('rut');
        const token = await AsyncStorage.getItem('userToken');
        var carreras = await apiUtem.getCarreras(token, rut);

        this._parseCarreras(carreras);
    }

    componentWillMount() {
        this._getCarreras();
    }

    render() {
        return (
            <SafeAreaView style={ styles.container }>
                <FlatList
                    data={this.state.datos}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.estaActualizando}
                            onRefresh={this._refreshCarreras.bind(this)}
                            title="Pull to refresh"
                            tintColor={colors.primario}
                            titleColor="#fff"
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