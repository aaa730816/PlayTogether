import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Image, TextInput, ScrollView } from 'react-native';
import * as QQAPI from 'react-native-qq';
import CommonString from '../../resource/CommonString';
import UserStyles from './UserSyles';
import IconFA from 'react-native-vector-icons/FontAwesome';
import colors from '../../Colors';
export default class Resgister extends Component{
    static navigationOptions={
        title:CommonString.register
    }
    constructor(props){
        super(props);
    }
    render() {
        return (
            <ScrollView>
            <View style={UserStyles.loginContainer}>
                <View style={UserStyles.loginInputContainer}>
                    <View style={UserStyles.userNameView}>
                        <View style={UserStyles.iconStyle}><IconFA name='user' size={20}></IconFA></View>
                        <TextInput style={UserStyles.inputTextStyle} underlineColorAndroid='transparent'></TextInput>
                    </View>
                    <View style={UserStyles.userNameView}>
                        <View style={UserStyles.iconStyle}><IconFA name='key' size={20}></IconFA></View>
                        <TextInput style={UserStyles.inputTextStyle} secureTextEntry={true} underlineColorAndroid='transparent'></TextInput>
                    </View><TouchableOpacity>
                        <View style={[UserStyles.userNameView, { backgroundColor: colors.MaterialRed, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ color: 'white' }}>{CommonString.register}</Text>
                        </View></TouchableOpacity>
                </View>
            </View>
                </ScrollView>
        )
    }
}