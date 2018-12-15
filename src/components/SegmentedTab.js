import React, { Component } from 'react';
import {View, SegmentedControlIOS, StyleSheet} from 'react-native';

export default class SegmentedTab extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { selectedIndex, routes, values, navigation } = this.props;

        return (
            <View style={ styles.container }>
                <SegmentedControlIOS
                    values={ values }
                    selectedIndex={ selectedIndex }
                    onChange={(event) => {
                        navigation.navigate(routes[event.nativeEvent.selectedSegmentIndex]);
                    }}
                    style={ styles.control }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderColor: '#BDBDBD'
    },
    control: {
        marginHorizontal: 20,
        marginBottom: 10,
    }
});