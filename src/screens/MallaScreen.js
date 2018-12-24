import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, AsyncStorage, SectionList } from 'react-native';
import { malla } from '../static/carrera';

import MallaItem from '../components/MallaItem';
import MallaHeader from '../components/MallaHeader';

const API_URL = 'https://api-utem.herokuapp.com/';
  
export default class MallaScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            datos: []
        };
    }

    _getMalla = async () => {
        const rut = await AsyncStorage.getItem('rut');
        const token = await AsyncStorage.getItem('userToken');
        const respuesta = await fetch(API_URL + "estudiantes/" + rut + "/carreras/" + 55978 + "/malla", {
            headers: {
                Authorization: "Bearer " + token  
            }
        }).then(response => response.json());

        this._parseMalla(respuesta)
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
            </SafeAreaView>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    }
});