import React from 'react'
import { TouchableWithoutFeedback, Alert, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Button, Input } from 'react-native-elements';
import styles from './Styles';
import FirebaseAPI from '../FirebaseAPI';
import Notifcation from '../Notification';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  validateInformation = () => {
    let isValid = true;
    const { email, password } = this.state;

    if (!email) {
      this.setState({
        emailError: 'Please enter an email',
      });
    } else {
      const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(email) === true) {
        this.setState({
          emailError: '',
        });
      } else {
        this.setState({
          emailError: 'Please enter a valid email',
        });
        isValid = false;
      }
    }

    if (!password) {
      this.setState({
        passwordError: 'Please enter a password',
      });
      isValid = false;
    } else {
      this.setState({
        passwordError: '',
      });
    }

    return isValid;
  };


  logIn = async () => {
    if (this.validateInformation()) {
      const { email, password } = this.state;
      const exponentToken = await Notifcation.getExponentToken();
      FirebaseAPI.signInWithEmail(email, password, exponentToken)
        .then(() => {
          const { navigation } = this.props;
          navigation.navigate('App')
        })
        .catch(error => {
          console.log(`Login.js: ${error.code} -- ${error.message}`);
          switch (error.code) {
            case 'auth/invalid-email':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              Alert.alert('', 'Incorrect email and/or password');
              break;
            case 'auth/user-disabled':
              Alert.alert('', 'User account is disabled');
              break;
            default:
              break;
          }
        });
    }
  };

  navigateRegister = () => {
    const { navigation } = this.props;
    navigation.navigate('Register')
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
          <Input
            placeholder='Email'
            onChangeText={email => this.setState({ email })} />
          <Input
            placeholder='Password'
            onChangeText={password => this.setState({ password })}
            secureTextEntry={true} />
          <Button title="Login"
            style={styles.button}
            onPress={this.logIn} />
          <Button title="Register"
            style={styles.button}
            onPress={this.navigateRegister} />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    )
  }
}