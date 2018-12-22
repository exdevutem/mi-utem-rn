import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
//import type { Row, Cell } from '../static/data';
import colors from '../colors';

export default class GridContent extends Component {

  render() {
    return (
      <View style={styles.container}>
        { this.props.data.map((row, index) => this._renderRow(row, index)) }
      </View>
    );
  }

  _renderRow(fila, i) {
    return (
      <View style={styles.rowContainer}>
        { fila.map((celda, j) => this._renderCell(celda, i, j)) }
      </View>
    );
  }

  _renderCell(celda, indexF, indexC) {
    return (
      <TouchableOpacity
        style={styles.cellContainer}
        onPress={() => { this._onCellPressed(indexF, indexC); }}
      >
      </TouchableOpacity>
    );
  }

  _onCellPressed(i, j) {
    Alert.alert(`Pressed (${i}, ${j})`);
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingLeft: 50
  },
  rowContainer: {
    flexDirection: 'row'
  },
  cellContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 100,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#9b59b6',
  },
});