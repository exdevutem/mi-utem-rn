import React, { Component } from 'react';
import {StyleSheet} from 'react-native';
import StarRating from 'react-native-star-rating';
import colors from '../colors'
export default class GeneralStarExample extends Component {

  constructor(props) {
    super(props);
    this.state = {
      starCount: 3.5
    };
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  render() {
    return (
      <StarRating
        containerStyle={styles.foto}
        disabled={this.props.bool}
        maxStars={5}
        starSize={this.props.tamaño}
        rating={parseInt(this.props.valor)}
        fullStarColor={colors.primario}
        //selectedStar={(rating) => this.onStarRatingPress(rating)}
      />
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.material.grey['200']
    },
    foto: {
        marginRight: 150
    }
});