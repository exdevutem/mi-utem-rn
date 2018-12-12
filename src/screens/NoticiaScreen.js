import React, { Component } from 'react';
import { Dimensions, Text, StyleSheet, View, ScrollView } from 'react-native';
import HTML from 'react-native-render-html';

const postUrl = 'https://www.utem.cl/wp-json/wp/v2/posts/';

export default class NoticiaScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
        headerStyle: {
            //backgroundColor: '#f4511e',
        },
        //headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    });

    constructor (props) {
        super(props);
        this.state = {
            html: ''
        };
    }

    _renderNode = (node, index) => {
        if (node.name == 'p') {
            return (
                <View key={index} style={styles.parrafo}>
                    <Text>
                        {node.attribs.src}
                    </Text>
                </View>
            );
        }
    }

    getHtml = async (id) => {
        var post = await fetch(postUrl + id).then(response => response.json());

        this.setState(previousState => ({
            titulo: post.title.rendered,
            html: post.content.rendered
        }))
    }
  
    render() {
        const id = this.props.navigation.getParam('id', '0');
        var tagsStyles = {
            p: {
                paddingLeft: 30,
                paddingRight: 30,
                paddingTop: 15,
                paddingBottom: 15,
                fontSize: 16,
                textAlign: 'justify',
            },
        };

        this.getHtml(id);
        return (
            <ScrollView style={styles.container}>
                <HTML html={this.state.html} imagesMaxWidth={Dimensions.get('window').width} tagsStyles={tagsStyles} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    
});