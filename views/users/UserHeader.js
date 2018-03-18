import React, { Component } from 'react';
import { View, Image } from 'react-native';
import UserStyles from './UserSyles';
export default class UserHeader extends Component {
    render() {
        return (
        <View style={UserStyles.userHeaderView}>
            <Image style={UserStyles.userHeaderLogo} source={require('../../images/userHeader.jpg')}/>
        </View>
        );
    }
}