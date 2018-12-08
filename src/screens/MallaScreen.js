import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, SectionList } from 'react-native';
import { malla } from '../static/carrera';

import ListItem from '../components/ListItem';

const Header = () => (
    <View style={styles.list}>
        <Text style={styles.header}>Nivel</Text>
    </View>
);
  
export default class MallaScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            datos: []
        };
    }

    parseMalla = (objeto) => {
        var malla = [];
        objeto.malla.forEach(semestre => {
            var asignaturas = [];
            semestre.asignaturas.forEach(asignatura => {
                asignaturas.push(asignatura.nombre);
            });
            malla.push({
                title: semestre.nivel,
                data: asignaturas
            });
        });
        return malla;
    }

    getMalla() {
        var mallaParseada = [];
        malla.malla.forEach(semestre => {
            var asignaturas = [];
            semestre.asignaturas.forEach(asignatura => {
                asignaturas.push(asignatura.nombre);
            });
            mallaParseada.push({
                title: semestre.nivel,
                data: asignaturas
            });
        });

        this.setState({
            datos: mallaParseada
        });
    }

    _renderItem = (item) => {
        return <ListItem nombre={item.title} />
    }

    _renderSectionHeader = (object) => {
        return <Header nombre={object.email}/>
    }

    componentWillMount() {
        this.getMalla();
    }

    render() {
        
        
        return (
            <SectionList
                renderItem={({item, index, section}) => <Text key={index}>{item}</Text>}
                renderSectionHeader={({section: {title}}) => (
                    <Text style={{fontWeight: 'bold'}}>{title}</Text>
                )}
                sections={this.state.datos}
                keyExtractor={(item, index) => item + index}
                />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    list: {
        backgroundColor: 'white',
    },
    header: {
        fontWeight: 'bold',
        margin: 20,
    },
});