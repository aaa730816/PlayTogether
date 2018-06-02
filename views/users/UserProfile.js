import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
    AsyncStorage, ScrollView, DeviceEventEmitter
} from 'react-native';
import CommonString from '../../resource/CommonString';
import CommonHeader from "../common/CommonHeader";
import UserStyles from './UserSyles';
import Color from '../../Colors';
import IconFA from 'react-native-vector-icons/FontAwesome';
import MCV from "../../MCV";
import JPushUtils from '../utils/JPushUtils';

export default class UserProfile extends Component {
    static navigationOptions = {
        title: CommonString.userProfile,
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
        header: (<CommonHeader title={CommonString.userProfile}/>)
    }

    constructor(props) {
        super(props)
        this.state = {
            modalVisiable: false,
            newNickName: '',
            nickName: global.nickName,
            expandActivityPanel: false,
            expandEquipmentPanel: false,
        }
    }

    render() {
        return (
            <ScrollView>
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
                    <TouchableWithoutFeedback onPress={() => this.setState((previous) => {
                        previous.expandActivityPanel = previous.expandActivityPanel ? false : true;
                        return previous;
                    })}>
                        <View style={UserStyles.userProfileCard}>
                            <Text style={{fontSize: 16}}>活动</Text>
                            {this.state.expandActivityPanel ? <IconFA size={16} name={'angle-up'}/> :
                                <IconFA size={16} name={'angle-down'}/>}
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={[{display: this.state.expandActivityPanel ? 'flex' : 'none'}]}>
                        <TouchableOpacity onPress={() => this._goToUserAct('create')}>
                            <View style={UserStyles.userProfileCard}>
                                <Text style={{fontSize: 16}}>我发布的活动</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._goToUserAct('join')}>
                            <View style={UserStyles.userProfileCard}>
                                <Text style={{fontSize: 16}}>我参加的活动</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableWithoutFeedback onPress={() => this.setState((previous) => {
                        previous.expandEquipmentPanel = previous.expandEquipmentPanel ? false : true;
                        return previous;
                    })}>
                        <View style={UserStyles.userProfileCard}>
                            <Text style={{fontSize: 16}}>器材</Text>
                            {this.state.expandEquipmentPanel ? <IconFA size={16} name={'angle-up'}/> :
                                <IconFA size={16} name={'angle-down'}/>}
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={[{display: this.state.expandEquipmentPanel ? 'flex' : 'none'}]}>
                        <TouchableOpacity onPress={() => this._goToUserEquip('create')}>
                            <View style={UserStyles.userProfileCard}>
                                <Text style={{fontSize: 16}}>我发布的器材</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._goToUserEquip('rent')}>
                            <View style={UserStyles.userProfileCard}>
                                <Text style={{fontSize: 16}}>我租借的器材</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.logOut()}>
                        <View style={UserStyles.userProfileCard}>
                            <Text style={{color: Color.MaterialRed, fontWeight: 'bold', fontSize: 16}}>注销</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
                JPushUtils.removeAlias();
                this.props.navigation.navigate('Users')
                for (let i in global.sockets) {
                    sockets[i].close();
                }
                global.events = [];
                global.sockets = {};
                DeviceEventEmitter.emit('FreshUnread');
                AsyncStorage.setItem('events', JSON.stringify({}))
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

    _goToUserAct = (type) => {
        this.props.navigation.navigate('UserActivity', {
            type: type
        })
    }
    _goToUserEquip = (type) => {
        this.props.navigation.navigate('UserEquipment', {
            type: type
        })
    }
}