import React, { Component } from 'react';
import { Platform, Text, StyleSheet, StatusBar, View, SafeAreaView } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import SliderEntry from '../components/SliderEntry';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import colors from '../colors';

const ES_IOS = Platform.OS === 'ios';

const postUri = 'wp-json/wp/v2/posts/';
const mediaUri = 'wp-json/wp/v2/media/';

const SLIDER_1_FIRST_ITEM = 1;

export default class MainScreen extends Component {

    constructor(props) {
        super(props);
        this._renderNoticiaItem = this._renderNoticiaItem.bind(this);
        this.state = {
            datos: [],
            activeSlide: SLIDER_1_FIRST_ITEM
        };
    }

    _getNoticias = async (https) => {
        var url = 'http' + ((https == null || https) ? 's' : '') + '://www.utem.cl/';
        try {
            var noticias = await fetch(url + postUri).then(response => response.json());

            var noticiasPromises = noticias.map((noticia) => {
                return new Promise(async (resolve, reject) => {
                    var excerpt = noticia.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").trim();
                    var content = noticia.content.rendered.replace(/<\/?[^>]+(>|$)/g, "").trim();
                    var media = await fetch(url + mediaUri + noticia.featured_media).then(response => response.json())
                    
                    resolve({
                        id: noticia.id,
                        title: noticia.title.rendered,
                        subtitle: excerpt != "" ? excerpt : content,
                        illustration: media.guid.rendered
                    });
                });
            });
            
        
            Promise.all(noticiasPromises).then((noticias) => {
                
                this.setState(previousState => ({
                    datos: noticias,
                    activeSlide: previousState.activeSlide 
                }))
            });
        } catch (error) {
            if (https == null || https) {
                this._getNoticias(false)
            } else {
                console.error(error)
            }
        }
        
    }

    _onPress = (id, titulo) => {
        //this.props.navigation.navigate('Noticia', {title: titulo, id: id});
    }

    _renderNoticiaItem ({item, index}, parallaxProps) {

        return (
            <SliderEntry
              data={item}
              parallax={true}
              onPress={this._onPress}
              parallaxProps={parallaxProps}/>
        );
    }


    _renderNoticiasCarousel = () => {
        const { activeSlide, datos } = this.state;
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

    componentWillMount() {
        this._getNoticias();
    }
  
    render() {
        const noticiasCarousel = this._renderNoticiasCarousel();
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.primarioOscuro} />
                <Text style={styles.titulo}>Noticias</Text>
                <View>
                    { noticiasCarousel }
                </View>
            </SafeAreaView>
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
        color: 'black',
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