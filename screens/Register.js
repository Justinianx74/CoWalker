import React from 'react';
import { TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native'
import { Button, Input } from 'react-native-elements';
import FirebaseAPI from '../FirebaseAPI';
import styles from './Styles';
import Notifcation from '../Notification';


export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      phoneNumber: ''
    };
  }

  register = async () => {
    const exponentToken = await Notifcation.getExponentToken();
    FirebaseAPI.registerWithEmail(this.state.name, this.state.email, this.state.password, this.state.phoneNumber, exponentToken)
      .then(() => {

        const { navigation } = this.props;
        navigation.navigate('Login')

      }).catch(error => {

        console.log(`Register.js : ${error.code} -- ${error.message}`)

      })
  }

  render() {
    const { navigation } = this.props;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
          <Input placeholder='Full Name' onChangeText={name => this.setState({ name })} />
          <Input placeholder='Phone Number' onChangeText={phoneNumber => this.setState({ phoneNumber })} />
          <Input placeholder='Email' onChangeText={email => this.setState({ email })} />
          <Input placeholder='Password' onChangeText={password => this.setState({ password })} secureTextEntry={true} />

          <Button title="Register" style={styles.button} onPress={this.register} />
          <Button title="Go Back" style={styles.button} onPress={() => navigation.navigate('Login')} />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    )
  }
}