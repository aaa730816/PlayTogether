import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity, TouchableHighlight, Image, TextInput, ScrollView,
    AsyncStorage, Alert
} from 'react-native';
import * as QQAPI from 'react-native-qq';
import CommonString from '../../resource/CommonString';
import UserHeader from './UserHeader';
import UserStyles from './UserSyles';
import IconFA from 'react-native-vector-icons/FontAwesome';
import colors from '../../Colors';
import MCV from "../../MCV";

export default class Login extends Component {
    static navigationOptions = {
        title: CommonString.login,
        headerStyle: MCV.userHeaderStyle,
        header:(<UserHeader/>)
    }

    constructor(props) {
        super(props);
        this.state = {
            qq: 'qq',
            user: {
                userName: '',
                passWord: '',
                loginType: ''
            }
        }
    }

    componentWillMount() {
        if (!(global.userId == '' || global.userId == undefined)) {
            this.props.navigation.navigate('UserProfile');
        }
    }
    render() {
        return (
            <ScrollView>
                <View style={UserStyles.loginContainer}>
                    <View style={UserStyles.loginInputContainer}>
                        <View style={UserStyles.userNameView}>
                            <View style={UserStyles.iconStyle}><IconFA name='user' size={20}></IconFA></View>
                            <TextInput style={UserStyles.inputTextStyle}
                                       onChangeText={text => this.setState(previous => {
                                           previous.user.userName = text;
                                           return previous;
                                       })} underlineColorAndroid='transparent' value={this.state.user.userName}/>
                        </View>
                        <View style={UserStyles.userNameView}>
                            <View style={UserStyles.iconStyle}><IconFA name='key' size={20}></IconFA></View>
                            <TextInput style={UserStyles.inputTextStyle}
                                       onChangeText={text => this.setState(previous => {
                                           previous.user.passWord = text;
                                           return previous;
                                       })} secureTextEntry={true} underlineColorAndroid='transparent'
                                       value={this.state.user.passWord}/>
                        </View>
                        <TouchableOpacity onPress={() => this.commonLogin()}>
                            <View style={[UserStyles.userNameView, {
                                backgroundColor: colors.MaterialRed,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }]}>
                                <Text style={{color: 'white'}}>{CommonString.login}</Text>
                            </View></TouchableOpacity>
                        <TouchableOpacity onPress={() => this.qqLogin()}>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}><IconFA name='qq'
                                                                                                   size={30}></IconFA></View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }

    qqLogin = () => {
        var _this = this;
        QQAPI.login().then(function (result) {
            var user = {
                userName: result.access_token,
                loginType: 'QQ'
            }
            _this.doLogin(user)
        })
    }

    commonLogin = () => {
        this.setState((previous) => {
            previous.user.loginType = 'CMN';
            return previous;
        })
        if (this.state.user.userName != '' && this.state.user.passWord != '')
            this.doLogin(this.state.user);
    }

    doLogin(user) {
        fetch(global.userModuleUrl + 'login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(response => response.json())
            .then(responseJson => {
                if (responseJson.success) {
                    AsyncStorage.setItem('user',
                        JSON.stringify({
                            userId:responseJson.userOid,
                            userName:responseJson.username,
                            nickName:responseJson.nickName
                        }), () => {
                        global.userId = responseJson.userOid
                        global.userName = responseJson.username.length > 15 ? responseJson.username.slice(0, 15) + '...' : responseJson.username
                        global.nickName = responseJson.nickName
                        Alert.alert(
                            '',
                            '登陆成功',
                            [
                                {
                                    text: '确认', onPress: () => this.props.navigation.navigate("UserProfile")
                                }
                            ]
                        )
                    })
                } else {
                    Alert.alert(
                        '',
                        '用户名或密码错误',
                        [
                            {
                                text: '确认', style:'cancel'
                            }
                        ]
                    )
                }
            })
    }
}