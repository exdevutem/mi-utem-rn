import React, { Component } from 'react';
import { Platform, Text, StyleSheet, StatusBar, View, SafeAreaView, Linking } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Orientation from 'react-native-orientation';

import NoticiaItem from '../components/NoticiaItem';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import colors from '../colors';
import firebase from 'react-native-firebase';

const ES_IOS = Platform.OS === 'ios';

const postUri = 'wp-json/wp/v2/posts/';
const mediaUri = 'wp-json/wp/v2/media/';

const SLIDER_1_FIRST_ITEM = 1;

export default class MainScreen extends Component {

    constructor(props) {
        super(props);
        firebase.analytics().setCurrentScreen("MainScreen", "MainScreen");
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
                        url: noticia.link,
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

    _onNoticiaPress = (id, titulo, url) => {
        //this.props.navigation.navigate('Noticia', {title: titulo, id: id});
        firebase.analytics().logEvent("press_noticia", {id: id, titulo: titulo, url: url});
        console.log(url);
        
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    }

    _renderNoticiaItem ({item, index}, parallaxProps) {

        return (
            <NoticiaItem
                noticia={item}
                onPress={this._onNoticiaPress}
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
                    barStyle={ES_IOS ? "dark-content" : "light-content"}
                    backgroundColor={colors.primarioOscuro} />
                <Text style={styles.titulo}>Noticias</Text>
                <View>
                    { noticiasCarousel }
                </View>
            </SafeAreaView>
        );
    }

    componentDidMount() {
        Orientation.lockToPortrait();
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