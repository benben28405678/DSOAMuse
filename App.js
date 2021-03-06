/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Image,
  Animated,
} from 'react-native';

import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import HomeScreen from './HomeScreen';
import NewsScreen from './NewsScreen';

var map = [[]];

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  News: {screen: NewsScreen},
});

const App = createAppContainer(MainNavigator);

export default App;
