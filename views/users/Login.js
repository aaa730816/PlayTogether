import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Image, TextInput } from 'react-native';
import * as QQAPI from 'react-native-qq';
import CommonString from '../../resource/CommonString';
import UserStyles from './UserSyles';
import IconFA from 'react-native-vector-icons/FontAwesome';
import colors from '../../Colors';
export default class Login extends Component {
    static navigationOptions = {
        title: CommonString.login
    }
    constructor(props) {
        super(props);
        this.state = {
            qq: 'qq'
        }
    }
    render() {
        return (
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
                            <Text style={{ color: 'white' }}>{CommonString.login}</Text>
                        </View></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.qqLogin()}>
                        <View style={{justifyContent:'center',alignItems:'center'}}><IconFA name='qq' size={30}></IconFA></View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    qqLogin = () => {
        var _this = this;
        QQAPI.login().then(function (result) {
            _this.setState(() => {
                return {
                    qq: result.access_token
                }
            })
        })
    }
}