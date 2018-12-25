import React, { Component } from 'react';
import { StyleSheet, Text, SafeAreaView, AsyncStorage, FlatList, TouchableHighlight } from 'react-native';
import { Cache } from "react-native-cache";

import ApiUtem from '../ApiUtem';

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
            datos: []
        };
    }

    _getCarreras = async () => {
        const rut = await AsyncStorage.getItem('rut');
        cache.getItem(rut + 'carreras', (err, value) => {
            if (err) console.error(err);
            this.setState({
                datos: value
            });
        });
    }

    _refreshCarreras = async () => {
        const rut = await AsyncStorage.getItem('rut');
        const token = await AsyncStorage.getItem('userToken');
        var carreras = await apiUtem.getCarreras(token, rut);

        this.setState({
            datos: carreras
        });
    }

    componentWillMount() {
        this._getCarreras();
    }

    render() {
        return (
            <SafeAreaView style={ styles.container }>
                <FlatList
                    data={this.state.datos}
                    renderItem={({item}) => 
                        <TouchableHighlight
                            style={styles.item}
                            onPress={() => {
                                this.props.navigation.navigate('Malla', {
                                    id: item._id
                                })
                              }} >
                            <Text style={styles.texto}>{item.carrera.nombre}</Text>
                        </TouchableHighlight>
                    } />
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