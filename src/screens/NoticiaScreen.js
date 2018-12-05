import React, { Component } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import HTML from 'react-native-render-html';

export default class NoticiaScreen extends Component {
    static navigationOptions = {
        title: 'Inicio',
        headerStyle: {
            //backgroundColor: '#f4511e',
        },
        //headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    constructor (props) {
        super(props);
        this.state = {
            datos: [],
            activeSlide: SLIDER_1_FIRST_ITEM
        };
    }
  
    render() {
        const noticiasCarousel = this._renderNoticiasCarousel();
        return (
            <ScrollView style={styles.container}>
                <HTML html={htmlContent} imagesMaxWidth={Dimensions.get('window').width} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    titulo: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: colors.black,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    slider: {
        marginTop: 15,
        overflow: 'visible' // for custom animations
    }
});