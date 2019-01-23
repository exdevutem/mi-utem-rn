import StarRating from 'react-native-star-rating';

export default class Estrellas extends Component {

  constructor(props) {
    super(props);
    /*this.state = {
      starCount: false
    };*/
  }

  /*onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }*/

  render() {
    return (
      <StarRating
        disabled={true}
        maxStars={5}
        rating={this.props.numero}
      />
    );
  }
}