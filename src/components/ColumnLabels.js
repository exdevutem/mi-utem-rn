import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
//import type { Cell } from '../static/data';
import colors from '../colors';

export default class ColumnLabels extends Component {
  render() {
    return (
      <View style={styles.container} pointerEvents={'box-none'}>
        { this.props.data.map((label, index) => this._renderColumnLabel(label, index)) }
      </View>
    );
  }

  _renderColumnLabel(label, index) {
    return (
      <View key={index} style={styles.columnLabel} pointerEvents={'box-none'}>
        <Text style={styles.columnTitle}>
          {label}
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
    paddingLeft: 50
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