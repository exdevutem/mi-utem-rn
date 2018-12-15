import React, { Component } from 'react';
import {Platform, View, Text, TouchableNativeFeedback, TouchableHighlight} from 'react-native';

class ListItem extends Component {
    constructor(props) {
        super(props);
    }

    onPress = () => {
        
    }

    render() {
        if (Platform.OS === 'android') {
            return (
            <TouchableNativeFeedback
                    onPress={this.onPress} style={this.props.style}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                <View>
                    <Text style={{margin: 20}}>{this.props.nombre}</Text>
                </View>
            </TouchableNativeFeedback>
           )
        } else {
            return (
                <TouchableHighlight onPress={this.onPress}
                        underlayColor='#E0E0E0' style={this.props.style}>
                    <View>
                        <Text style={{margin: 20}}>{this.props.nombre}</Text>
                    </View>
                </TouchableHighlight>    
           )
        }
    }
}

module.exports = ListItem;