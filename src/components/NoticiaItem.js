import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 5;

export default class NoticiaItem extends Component {

    /*static propTypes = {
        data: PropTypes.object.isRequired,
        onPress: PropTypes.func,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };*/

    get image() {
        const {parallaxProps} = this.props;
        const {illustration} = this.props.noticia;

        return (
            <ParallaxImage
                source={{ uri: illustration }}
                containerStyle={ styles.imageContainer }
                style={styles.image}
                parallaxFactor={0.35}
                showSpinner={true}
                spinnerColor='rgba(255, 255, 255, 0.4)'
                {...parallaxProps}
            />
        );
    }

    render () {
        const {id, title, subtitle, url} = this.props.noticia;

        return (
            <View style={{elevation: 2}}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.slideInnerContainer}
                    onPress={() => { this.props.onPress(id, title, url) }}>

                    <View style={styles.shadow} />
                    <View style={ styles.imageContainer }>
                        { this.image }
                        <View style={ styles.radiusMask } />
                    </View>
                    <View style={ styles.textContainer }>
                        <Text
                            style={ styles.title }
                            numberOfLines={2}>
                            { title.toUpperCase() }
                        </Text>
                        <Text
                            style={ styles.subtitle }
                            numberOfLines={1} >
                            { subtitle }
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18, // needed for shadow
        elevation: 2
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    title: {
        color: 'black',
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    subtitle: {
        marginTop: 6,
        color: 'grey',
        fontSize: 12,
        fontStyle: 'italic'
    }
});