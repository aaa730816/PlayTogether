import { AppRegistry } from 'react-native';
import React, { Component } from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import MainPage from './views/MainPage';
import DateList from './views/DateList';
import Sport from './views/datedetails/Sport';
import SiteView from './views/utils/SiteView';
import Login from './views/Login';
import MCV from './MCV';
const PlayTogetherStack = StackNavigator({
    Main: { screen: Login },
    DateList: { screen: DateList },
    Sport: { screen: Sport },
    SiteView: { screen: SiteView },
    Login:{ screen : Login}
}, {
        headerMode: 'float'
    })
const PlayTogether = TabNavigator({
    Home: { screen: PlayTogetherStack }
}, {
        tabBarPosition: 'bottom',
        swipeEnabled: true,
        animationEnabled: true,
        showIcon: true,
        tabBarOptions: {
            style: MCV.tabStyle,
            labelStyle: MCV.tabLabelStyle
        },
    })

AppRegistry.registerComponent('PlayTogether', () => PlayTogether);
