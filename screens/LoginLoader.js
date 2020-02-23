import React from 'react';
import { View } from 'react-native';
import { SplashScreen } from 'expo';
import PropTypes from 'prop-types';
import FirebaseAPI from '../FirebaseAPI';

export default class LoginLoader extends React.Component {
  constructor(props) {
    super(props);
    FirebaseAPI.initializeApp();
  }

  componentDidMount() {
    SplashScreen.preventAutoHide();
    this.authUnsubscriber = FirebaseAPI.isLoggedIn(user => {
      const { navigation } = this.props;
      navigation.navigate(user ? 'App' : 'LoginStack');
      SplashScreen.hide();
    });
  }

  componentWillUnmount() {
    this.authUnsubscriber();
  }

  render() {
    return <View />;
  }
}

LoginLoader.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
