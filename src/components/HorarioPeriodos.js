import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class HorarioPeriodos extends Component {
  render() {
    return (
      <View style={styles.container} pointerEvents={'box-none'}>
        { this.props.data.map(periodo => this._renderPeriodoLabel(periodo)) }
      </View>
    );
  }

  _renderPeriodoLabel(periodo) {
    return (
      <View style={styles.rowLabel} pointerEvents={'box-none'}>
        <Text style={styles.rowTitle}>
          {periodo}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    width: 50,
    paddingTop: 35
  },
  rowLabel: {
    height: 110,    
    justifyContent: 'center',
    alignItems: 'center',    
  },
  rowTitle: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontWeight: '500',
    fontSize: 16,
    color: 'grey'
  },
});