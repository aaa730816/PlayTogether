import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    TextInput,
    ScrollView,
    AsyncStorage,
    Alert
} from 'react-native';
import CommonString from '../../resource/CommonString';
import UserStyles from './UserSyles';
import IconFA from 'react-native-vector-icons/FontAwesome';
import colors from '../../Colors';
import UserHeader from './UserHeader';
import MCV from "../../MCV";

export default class Resgister extends Component {
    static navigationOptions = {
        title: CommonString.register,
        headerStyle: MCV.userHeaderStyle,
        header: (<UserHeader/>)
    }

    constructor(props) {
        super(props);
        this.state = {
            user: {
                userName: '',
                passWord: '',
                loginType: 'CMN'
            },
            checked: true
        }
    }

    checkUserName = (event) => {
        fetch(global.userModuleUrl + 'check?username=' + event.nativeEvent.text, {
            method: 'GET'
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState(() => {
                    return {
                        checked: responseJson
                    }
                })
            })
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
                                       })}
                                       onEndEditing={(event) => this.checkUserName(event)}
                                       underlineColorAndroid='transparent' value={this.state.user.userName}/>
                            <View style={UserStyles.iconStyle}>{this.state.checked ?
                                <IconFA name='check' size={20}></IconFA> :
                                <IconFA name='exclamation' size={20}></IconFA>}</View>
                        </View>
                        <View style={UserStyles.userNameView}>
                            <View style={UserStyles.iconStyle}><IconFA name='key' size={20}></IconFA></View>
                            <TextInput style={UserStyles.inputTextStyle}
                                       onChangeText={text => this.setState(previous => {
                                           previous.user.passWord = text;
                                           return previous;
                                       })} secureTextEntry={true}
                                       value={this.state.user.passWord} underlineColorAndroid='transparent'/>
                        </View>
                        <TouchableOpacity onPress={() => this.onRegister()}>
                            <View style={[UserStyles.userNameView, {
                                backgroundColor: colors.MaterialRed,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }]}>
                                <Text style={{color: 'white'}}>{CommonString.register}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }

    onRegister() {
        var _this = this;
        if (this.state.checked && this.state.user.userName != '' && this.state.user.passWord != '') {
            fetch(global.userModuleUrl + 'register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_this.state.user)
            }).then((response) => response.json())
                .then(responseJson => {
                    if (responseJson.success) {
                        AsyncStorage.setItem('user',
                            {
                                userId: responseJson.userOid,
                                userName: responseJson.username,
                                nickName: responseJson.nickName
                            }, () => {
                                global.userId = responseJson.userOid
                                global.userName = responseJson.username.length > 15 ? responseJson.username.slice(0, 15) + '...' : responseJson.username
                                global.nickName = responseJson.nickName
                                Alert.alert(
                                    '',
                                    '注册成功',
                                    [
                                        {
                                            text: '确认', onPress: () => this.props.navigation.navigate("UserProfile")
                                        }
                                    ]
                                )
                            })
                    }
                })
        }
    }
}