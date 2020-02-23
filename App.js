import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoginLoader from './screens/LoginLoader';
import Login from './screens/Login';
import Register from './screens/Register';
import Map from './screens/Map';
import Matches from './screens/Matches';

const LoginStack = createSwitchNavigator({
  Login,
  Register,
});

const App = createSwitchNavigator(
  {
    Map,
    Matches,
  },
  {
    initialRouteName: 'Map',
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      LoginLoader,
      LoginStack,
      App,
    },
    {
      initialRouteName: 'LoginLoader',
    }
  )
);
