import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, Text, SectionList } from 'react-native';
import { malla } from '../static/carrera';

import AsignaturaItem from '../components/AsignaturaItem';
  
export default class MallaScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            datos: []
        };
    }

    _parseMalla() {
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

        console.log(malla);

        this.setState({
            datos: mallaParseada
        });
    }

    _renderItem = (item) => {
        return <AsignaturaItem nombre={item} />
    }

    _renderSectionHeader = (object) => {
        return <Header nombre={object}/>
    }

    componentWillMount() {
        this._parseMalla();
    }

    render() {
        return (
            <SafeAreaView style={ styles.container }>
                <SectionList
                    sections={ this.state.datos }
                    stickySectionHeadersEnabled={ true }
                    renderSectionHeader={({section: {title}}) => (
                        <View style={styles.header}>
                            <Text style={styles.headerText}>{"Semestre " + title}</Text>
                        </View>
                    )}
                    renderItem={({item, index, section}) => (
                        <AsignaturaItem nombre={item}/>
                    )}
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
    },
    headerText: {
        fontWeight: 'bold',
        margin: 20,
    },
    header: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
    }
});