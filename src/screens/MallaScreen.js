import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, SectionList } from 'react-native';

import ListItem from '../components/ListItem';

const Header = () => (
    <View style={styles.list}>
        <Text style={styles.header}>Nivel</Text>
    </View>
);
  
export default class MallaScreen extends Component {
    state = {
        data: []
    };

    componentWillMount() {
        this.fetchData();
    };

    fetchData = async () => {
        const url = "https://jsonplaceholder.typicode.com/todos/";
        var response = await fetch(url);
        var json = response.json();
        this.setState({
        data: json
        });
    };

    renderItem = (item) => {
        return <ListItem nombre={item.title} />
    };

    renderSectionHeader = (object) => {
        return <Header nombre={object.email}/>
    };

    procesarJson() {
        
    }

    render() {

        return (
        <ScrollView contentContainerStyle={ styles.container }>
            <SectionList
            style={ styles.list }
            stickySectionHeadersEnabled={ true }
            sections={ datos }
            renderSectionHeader={ this.renderSectionHeader }
            renderItem={ this.renderItem(item) }
            keyExtractor={ (item) => item.id }/>
        </ScrollView>
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