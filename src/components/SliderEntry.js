import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';

export default class SliderEntry extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        onPress: PropTypes.func,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image() {
        const { data: { illustration }, parallax, parallaxProps } = this.props;

        return parallax ? (
            <ParallaxImage
              source={{ uri: illustration }}
              containerStyle={ styles.imageContainer }
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor='rgba(255, 255, 255, 0.4)'
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: illustration }}
              style={styles.image}
            />
        );
    }

    render () {
        const { data: { id, title, subtitle, url } } = this.props;

        const uppercaseTitle = title ? (
            <Text
              style={ styles.title }
              numberOfLines={2}>
                { title.toUpperCase() }
            </Text>
        ) : false;

        return (
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
                    { uppercaseTitle }
                    <Text
                      style={ styles.subtitle }
                      numberOfLines={1} >
                        { subtitle }
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}