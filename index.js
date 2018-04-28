import {AppRegistry, View, Text} from 'react-native';
import React, {Component} from 'react';
import {StackNavigator, TabNavigator} from 'react-navigation';
import MainPage from './views/MainPage';
import DateList from './views/datedetails/DateList';
import Activity from './views/datedetails/Activity';
import SiteView from './views/utils/SiteView';
import User from './views/users/User';
import EquipmentList from './views/equipment/EquipmentList';
import MCV from './MCV';
import './resource/UrlSetting';

const ActivityStack = StackNavigator({
    Main: {screen: MainPage},
    DateList: {screen: DateList},
    Activity: {screen: Activity},
    SiteView: {screen: SiteView},
}, {
    headerMode: 'float',
    navigationOptions: {
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
    }
});
const EquipmentStack = StackNavigator({
    EquipmentList: {screen:EquipmentList}
}, {
    headerMode: 'float',
    navigationOptions: {
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
    }
});
const PlayTogether = TabNavigator({
    Activity: {screen: ActivityStack},
    Equipment:{screen:EquipmentStack},
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
