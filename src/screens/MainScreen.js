import React, { Component } from 'react';
import { Platform, Text, StyleSheet, Button, View, SafeAreaView } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import SliderEntry from '../components/SliderEntry';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';

const postUrl = 'https://www.utem.cl/wp-json/wp/v2/posts/';
const mediaUrl = 'https://www.utem.cl/wp-json/wp/v2/media/';

const SLIDER_1_FIRST_ITEM = 1;

export default class MainScreen extends Component {
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
    
    getNoticias = () => {
        fetch(postUrl)
            .then(response => response.json())
            .then(noticias => {
                var noticiasPromises = noticias.map((noticia) => {
                    return new Promise((resolve, reject) => {
                        var excerpt = noticia.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").trim();
                        var content = noticia.content.rendered.replace(/<\/?[^>]+(>|$)/g, "").trim();
                        fetch(mediaUrl + noticia.featured_media)
                            .then(response => response.json())
                            .then(media => {
                                var noticiaParseada = {
                                    title: noticia.title.rendered,
                                    subtitle: excerpt != "" ? excerpt : content,
                                    illustration: media.guid.rendered
                                }
                                resolve(noticiaParseada);
                            });
                    });
                });
              
                Promise.all(noticiasPromises).then((noticias) => {
                    this.setState(previousState => ({
                        datos: noticias,
                        activeSlide: previousState.activeSlide 
                    }))
                });
            }).done();
    }

    _renderNoticiaItem ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              parallax={true}
              parallaxProps={parallaxProps}/>
        );
    }


    _renderNoticiasCarousel = () => {
        const { activeSlide, datos } = this.state;
        this.getNoticias();
        return (
            <View>
                <Carousel
                    ref={c => this._slider1Ref = c}
                    data={datos}
                    renderItem={this._renderNoticiaItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    hasParallaxImages={true}
                    firstItem={SLIDER_1_FIRST_ITEM}
                    inactiveSlideScale={0.94}
                    inactiveSlideOpacity={0.7}
                    // inactiveSlideShift={20}
                    containerCustomStyle={styles.slider}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                    loop={true}
                    loopClonesPerSide={2}
                    autoplay={true}
                    autoplayDelay={500}
                    autoplayInterval={3000}
                    onSnapToItem={(index) => this.setState(previousState => (
                        { datos: previousState.datos, activeSlide: index }
                    ))}/>
            </View>
        );
    }
  
    render() {
        const noticiasCarousel = this._renderNoticiasCarousel();
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.titulo}>Noticias</Text>
                <View>
                    { noticiasCarousel }
                    <Button onPress={() => this.props.navigation.navigate('Malla')} title="Ir a Malla"></Button>
                    <Button onPress={() => this.props.navigation.navigate('Perfil')} title="Ir a Perfil"></Button>
                </View>
            </SafeAreaView>
        );
    }
}

const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};

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