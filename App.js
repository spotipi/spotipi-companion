import React from 'react';

import { createStackNavigator, createAppContainer, createSwitchNavigator } from "react-navigation";

import Login from './Routes/Login/login.component'
import MainTabNavigator from './Routes/MainTabNavigator/main-tab-navigator.component';




const AuthStack = createStackNavigator({
  Login,
});

const AppStack = createStackNavigator({ MainTabNavigator });


const AppContainer = createAppContainer(createSwitchNavigator(
  {
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Auth',
  }
));


export default class App extends React.Component {

  render() {
    return <AppContainer />
  }

}