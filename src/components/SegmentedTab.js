import React, { Component } from 'react';
import {View, SegmentedControlIOS, StyleSheet} from 'react-native';

export default class SegmentedTab extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { selectedIndex, values, navigation } = this.props;

        return (
            <View style={ styles.container }>
                <SegmentedControlIOS
                    values={ values }
                    selectedIndex={ selectedIndex }
                    tintColor='#009d9b'
                    onChange={(event) => {
                        navigation.navigate(values[event.nativeEvent.selectedSegmentIndex]);
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