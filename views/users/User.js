import React, {Component} from 'react';
import {TabNavigator, StackNavigator} from 'react-navigation';
import Login from './Login';
import Register from './Register';
import UserHeader from './UserHeader';
import CommonString from '../../resource/CommonString';
import UserProfile from './UserProfile';
import UserActivity from './UserActivity';
import Activity from '../datedetails/Activity';
import MCV from '../../MCV';

const UserTab = TabNavigator({
    Login: {screen: Login},
    Register: {screen: Register}
}, {
    tabBarOptions: {
        style: MCV.userTabStyle,
        labelStyle: MCV.userTabLabelStyle
    }
});
const UserStack = StackNavigator({
    Users: {screen: UserTab},
    UserProfile: {screen: UserProfile},
    UserActivity: {screen: UserActivity},
    Activity:{screen:Activity}
});
export default class User extends Component {
    static navigationOptions = {
        title: CommonString.user
    }

    render() {
        return (
            <UserStack></UserStack>
        );
    }
}