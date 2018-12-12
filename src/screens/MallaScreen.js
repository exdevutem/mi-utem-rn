import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, Text, SectionList } from 'react-native';
import { malla } from '../static/carrera';

import ListItem from '../components/ListItem';

const Header = () => (
    <View style={styles.list}>
        <Text style={styles.header}>{"Semestre " + this.props.nombre}</Text>
    </View>
);
  
export default class MallaScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            datos: []
        };
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
        return <ListItem nombre={item} />
    }

    _renderSectionHeader = (object) => {
        return <Header nombre={object}/>
    }

    componentWillMount() {
        this.getMalla();
    }

    render() {
        return (
            <SafeAreaView style={ styles.container }>
                <SectionList
                    sections={ this.state.datos }
                    stickySectionHeadersEnabled={ true }
                    renderSectionHeader={({section: {title}}) => (
                        <View style={styles.list}>
                            <Text style={styles.header}>{"Semestre " + title}</Text>
                        </View>
                    )}
                    renderItem={({item, index, section}) => (
                        <ListItem style={styles.list} nombre={item}/>
                    )}
                    keyExtractor={ (item, index) => item + index }/>
            </SafeAreaView>
            
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
    contentContainer: {
        height: 1000,
        width: 1000,
      },
});