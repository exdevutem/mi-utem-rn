import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../colors';

export default class HorarioDias extends Component {
  render() {
    return (
      <View style={styles.container} pointerEvents={'box-none'}>
        { this.props.data.map((dia, index) => this._renderDiaLabel(dia, index)) }
      </View>
    );
  }

  _renderDiaLabel(dia, index) {
    return (
      <View key={index} style={styles.columnLabel} pointerEvents={'box-none'}>
        <Text style={styles.columnTitle}>
          {dia}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 55
  },
  columnLabel: {
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnTitle: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontWeight: '500',
    fontSize: 16,
    color: 'grey'
  },
});