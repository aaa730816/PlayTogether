import {AppRegistry, View, Text} from 'react-native';
import React, {Component} from 'react';
import {StackNavigator, TabNavigator} from 'react-navigation';
import MainPage from './views/MainPage';
import DateList from './views/DateList';
import Sport from './views/datedetails/Sport';
import SiteView from './views/utils/SiteView';
import User from './views/users/User';
import MCV from './MCV';
import './resource/UrlSetting';
const PlayTogetherStack = StackNavigator({
    Main: {screen: MainPage},
    DateList: {screen: DateList},
    Sport: {screen: Sport},
    SiteView: {screen: SiteView},
}, {
    headerMode: 'float',
    navigationOptions:{
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
    }
});
const PlayTogether = TabNavigator({
    Home: {screen: PlayTogetherStack},
    Users: {screen: User}
}, {
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    showIcon: true,
    tabBarOptions: {
        style: MCV.tabStyle,
        labelStyle: MCV.tabLabelStyle
    }
})
AppRegistry.registerComponent('PlayTogether', () => PlayTogether);
