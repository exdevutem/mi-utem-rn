import React, { Component } from 'react';
import { StyleSheet, Platform, SafeAreaView, AsyncStorage, View, FlatList, RefreshControl, StatusBar } from 'react-native';
import { Cache } from "react-native-cache";
import firebase from 'react-native-firebase';

import ApiUtem from '../ApiUtem';
import AsignaturasItem from '../components/AsignaturasItem';
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
  
export default class AsignaturasScreen extends Component {
    constructor(props) {
        super(props);
        firebase.analytics().setCurrentScreen("AsignaturasScreen", "AsignaturasScreen");
        this.state = { 
            datos: [],
            estaCargando: true
        };
    }

    _parseAsignaturas = (json) => {
        /*if (json.length == 1) {
            this.props.navigation.navigate('Carrera', {
                id: json[0]._id
            });
        } else {
            this.setState({
                datos: json,
                estaActualizando: false
            });
        }
        */
        this.setState({
            datos: json,
            estaCargando: false
        });
    }

    _getAsignaturas = async () => {
        const rut = await AsyncStorage.getItem('rut');
        const key = rut + 'asignaturas';
        cache.getItem(key, async (err, asignaturasCache) => {
          
            if (err || !asignaturasCache) {
                const asignaturas = await apiUtem.getAsignaturas(rut);
                cache.setItem(key, asignaturas, (err) => {
                    if (err) console.error(err);
        
                    this._parseAsignaturas(asignaturas);
                });
            } else {
    
                this._parseAsignaturas(asignaturasCache)
            }
        });
    }

    _refreshCarreras = async () => {
        this.setState({
            estaCargando: true
        });
        const rut = await AsyncStorage.getItem('rut');
        const key = rut + 'asignaturas';
        const asignaturas = await apiUtem.getAsignaturas(rut);
        cache.setItem(key, asignaturas, (err) => {
            if (err) console.error(err);
            this._parseAsignaturas(asignaturas);
        });
    }

    componentWillMount() {
        this._getAsignaturas();
    }

    render() {
        return (
            <SafeAreaView style={ styles.container }>
                <StatusBar
                    barStyle={ES_IOS ? "dark-content" : "light-content"}
                    backgroundColor={colors.primarioOscuro} />
                <FlatList
                    data={this.state.datos}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.estaCargando}
                            onRefresh={this._refreshCarreras.bind(this)}
                            title="Pull to refresh"
                            colors={[colors.primario]}
                         />
                      }
                    keyExtractor={(item) => item._id.toString()}
                    ItemSeparatorComponent={() => (<View style={{borderBottomWidth: 1, borderColor: colors.material.grey['300']}} />)}
                    renderItem={({item}) => <AsignaturasItem asignatura={item} navigation={this.props.navigation}/> } />
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