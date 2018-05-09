import {AppRegistry, View, Text} from 'react-native';
import React, {Component} from 'react';
import {StackNavigator, TabNavigator} from 'react-navigation';
import MainPage from './views/MainPage';
import DateList from './views/datedetails/DateList';
import Activity from './views/datedetails/Activity';
import SiteView from './views/utils/SiteView';
import User from './views/users/User';
import EquipmentList from './views/equipment/EquipmentList';
import Equipment from './views/equipment/Equipment';
import MCV from './MCV';
import './resource/UrlSetting';
import CommonString from './resource/CommonString';
import MessageList from './views/message/MessageList';
import ChatView from "./views/message/ChatView";
import EventSummary from "./views/message/EventSummary";
import EventMap from "./views/common/EventMap";

const ActivityStack = StackNavigator({
    Main: {screen: MainPage},
    DateList: {screen: DateList},
    Activity: {screen: Activity},
    SiteView: {screen: SiteView},
    EventMap:{screen:EventMap}
}, {
    headerMode: 'float',
    navigationOptions: {
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
    }
});
const EquipmentStack = StackNavigator({
    EquipmentList: {screen: EquipmentList},
    Equipment: {screen: Equipment},
    SiteView: {screen: SiteView},
    EventMap:{screen:EventMap}
}, {
    headerMode: 'float',
    navigationOptions: {
        title: CommonString.equipmentList,
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
    }
});
const MessageStack = StackNavigator({
    MessageList: {screen: MessageList},
    ChatView:{screen:ChatView},
    EventSummary:{screen:EventSummary}
}, {
    headerMode: 'float',
    navigationOptions: {
        title: CommonString.message,
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
    }
});
const PlayTogether = TabNavigator({
    Activity: {screen: ActivityStack},
    Equipment: {screen: EquipmentStack},
    Message: {screen: MessageStack},
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
