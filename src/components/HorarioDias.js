import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../colors';

const dias = ['Lunes', 'Martes','Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default class HorarioDias extends Component {
  render() {
    return (
      <View style={styles.container} pointerEvents={'box-none'}>
        { dias.slice(0, this.props.largo).map((dia, index) => this._renderDiaLabel(dia, index)) }
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
    borderBottomWidth: 1,
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