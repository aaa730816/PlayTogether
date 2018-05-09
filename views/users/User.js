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
import SiteView from '../utils/SiteView';
import Equipment from "../equipment/Equipment";
import UserEquipment from "../users/UserEquipment";
import {BackHandler} from "react-native";

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
    Activity: {screen: Activity},
    SiteView: {screen: SiteView},
    UserEquipment: {screen: UserEquipment},
    Equipment: {screen: Equipment}
}, {
    headerMode: 'float',
    navigationOptions: {
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
    }
});
export default class User extends Component {
    static navigationOptions = {
        title: CommonString.user
    }

    componentDidMount() {
        var _this=this;
        BackHandler.addEventListener('hardwareBackPress',_this.handleBack)
        this.didFocusListener=this.props.navigation.addListener('willFocus',payload=>{
            BackHandler.addEventListener('hardwareBackPress',_this.handleBack)
            console.log('didFocus')
        })
        this.didBlurListener=this.props.navigation.addListener('didBlur',payload=>{
            BackHandler.removeEventListener('hardwareBackPress',_this.handleBack)
            console.log('didBlur')
        })
    }

    handleBack=()=>{
        return true;
    }
    componentWillUnmount() {
        this.didBlurListener.remove();
        this.didFocusListener.remove();
    }
    render() {
        return (
            <UserStack></UserStack>
        );
    }
}