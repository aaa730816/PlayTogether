import React, {Component} from 'react';
import {View,Text} from 'react-native';
import CommonString from '../../resource/CommonString';
export default class Resgister extends Component{
    static navigationOptions={
        title:CommonString.register
    }
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View>
                <Text>注册</Text>
            </View>
        )
    }
}