import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
    BackHandler,
    AsyncStorage
} from 'react-native';
import CommonString from '../../resource/CommonString';
import CommonHeader from "../common/CommonHeader";
import UserStyles from './UserSyles';
import Color from '../../Colors';

export default class UserProfile extends Component {
    static navigationOptions = {
        title: CommonString.userProfile,
        header: (<CommonHeader title={CommonString.userProfile}/>)
    }

    constructor(props) {
        super(props)
        this.state = {
            modalVisiable: false,
            newNickName: '',
            nickName: global.nickName
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    }

    onBackAndroid = () => {
        return true;
    }

    render() {
        return (
            <View style={UserStyles.userProfileContainer}>
                <Modal animationType={'slide'} transparent={true} visible={this.state.modalVisiable}
                       onRequestClose={() => this.setState({modalVisiable: false})}>
                    <View style={UserStyles.modalContainer}>
                        <View style={UserStyles.subView}>
                            <Text style={{alignSelf: 'center'}}>更改昵称</Text>
                            <View style={{
                                borderWidth: 1,
                                borderColor: '#e0e0e0',
                                margin: 10,
                                height: 40
                            }}><TextInput style={{height: 40, fontSize: 12}}
                                          onChangeText={text => this.setState({newNickName: text})}
                                          value={this.state.newNickName}
                                          underlineColorAndroid={'transparent'}/></View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                <TouchableOpacity onPress={() => this.onChangeNickName()}>
                                    <Text>确定</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    this.setState({modalVisiable: false})
                                }}>
                                    <Text>取消</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={UserStyles.userProfileCard}>
                    <Text style={{fontSize: 16}}>用户名:</Text>
                    <Text style={{fontSize: 16}}>{global.userName}</Text>
                </View>
                <TouchableWithoutFeedback onPress={() => this.changeNickName()}>
                    <View style={UserStyles.userProfileCard}>
                        <Text style={{fontSize: 16}}>昵称:</Text>
                        <Text style={{fontSize: 16}}>{this.state.nickName}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableOpacity onPress={() => this.logOut()}>
                    <View style={UserStyles.userProfileCard}>
                        <Text style={{color: Color.MaterialRed, fontWeight: 'bold', fontSize: 16}}>注销</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    logOut = () => {
        Alert.alert(
            '',
            '是否注销登陆?',
            [
                {
                    text: '确认', onPress: () => this.onLogOut()
                },
                {
                    text: '取消', style: 'cancel'
                }
            ]
        )
    }
    onLogOut = () => {
        AsyncStorage.setItem('user', JSON.stringify({}),
            () => {
                global.userId = '';
                global.userName = '';
                global.nickName = '';
                this.props.navigation.navigate('Users')
            })
    }
    changeNickName = () => {
        this.setState(() => {
            return {modalVisiable: true, newNickName: ''}
        })
    }
    onChangeNickName = () => {
        var _this = this;
        fetch(global.userModuleUrl + 'changeNickName', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userOid: global.userId,
                nickName: _this.state.newNickName
            })
        }).then(response => response.json())
            .then(responseJson => {
                if (responseJson.success) {
                    AsyncStorage.setItem('user', JSON.stringify({
                        userId: global.userId,
                        userName: global.userName,
                        nickName: global.nickName
                    }), () => {
                        global.nickName = _this.state.newNickName
                        _this.setState({modalVisiable: false, nickName: global.nickName})
                        Alert.alert(
                            '',
                            responseJson.message,
                            [
                                {
                                    text: '确认', style: 'cancel'
                                }
                            ]
                        )
                    })
                } else {
                    Alert.alert(
                        '',
                        responseJson.message,
                        [
                            {
                                text: '确认', style: 'cancel'
                            }
                        ]
                    )
                }
            })
    }
}