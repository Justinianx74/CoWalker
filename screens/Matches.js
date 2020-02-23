import React from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import Styles from './Styles';
import Notification from '../Notification'
import FirebaseAPI from '../FirebaseAPI';

export default class Matches extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    users = navigation.getParam('users');
    console.log('Matches: ----------');
    console.log(users);
    this.state = {
      users: [],
    };

    this.getUserInfo(users)
  }

  getUserInfo = (users) => {
    const userUIDS = [];
    users.forEach(user => userUIDS.push({ uid: user.uid, percent: user.percent }));
    FirebaseAPI.getUsers(userUIDS)
      .then(usersInfo => this.setState({ users: usersInfo }))
      .catch(console.log)
  }

  sendNotification = (exponentToken) => {
    const { uid, name } = FirebaseAPI.userInfo
    Notification.sendNotification(exponentToken, { uid, name })
  }

  renderMatch = (item) => {
    return (
      <View style={Styles.touchableOpacityContainer}>
        <TouchableOpacity style={Styles.touchableOpacityButton} onPress={() => this.sendNotification(item.exponentToken)}>
          <Text>{item.name} matched with you {(item.percent * 100).toFixed(0)} %</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { users } = this.state;
    return (
      <View style={Styles.container}>
        <FlatList data={users}
          renderItem={({ item }) => this.renderMatch(item)}
          keyExtractor={item => item.id} />
      </View>
    );
  }
}
