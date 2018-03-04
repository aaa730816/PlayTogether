import { AppRegistry } from 'react-native';
import React, { Component } from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import MainPage from './views/MainPage';
import DateList from './views/DateList';
import Sport from './views/datedetails/Sport';
import SiteView from './views/utils/SiteView';
import MCV from './MCV';
const PlayTogetherStack = StackNavigator({
    Main: { screen: MainPage },
    DateList: { screen: DateList },
    Sport: { screen: Sport },
    SiteView: { screen: SiteView }
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
        labelStyle:{
            fontColor:'black'
        }
    })

AppRegistry.registerComponent('PlayTogether', () => PlayTogether);
