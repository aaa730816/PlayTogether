import React, {Component} from 'react';
import {View, Text, ScrollView, Picker, TextInput, TouchableOpacity, Alert} from 'react-native';
import MCV from '../../MCV';
import Activity from '../datedetails/Activity';
import CommonString from '../../resource/CommonString';
import CostUnit from '../utils/CostUnit';
import EquipmentType from './EquipmentType';
import ConversitionUtil from '../utils/ConversitonUtil';

export default class Equipment extends Component {
    static navigationOptions = ({navigation}) => ({
        title: CommonString.equipmentList,
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerRight: (
            <TouchableOpacity
                onPress={() => navigation.state.params.operation == 'view' ? navigation.state.params.rent() : navigation.state.params.submitEquipment()}><Text
                style={{
                    color: 'white',
                    paddingRight: 20,
                    fontWeight: 'bold'
                }}>{navigation.state.params.operation == 'view' ? '租借' : '保存'}</Text></TouchableOpacity>)
    })

    constructor(props) {
        super(props);
        this.state = {
            editable: true,
            equipmentInfo: {
                title: '',
                location: {
                    longitude: 121.39903166666659,
                    latitude: 31.32143821296778,
                    address: '',
                    name: ''
                },
                id: '',
                cost: '0',
                guarantee:'0',
                num: '0',
                description: '',
                type: 'basketball',
                otherType: '',
                creator: global.userId,
                unit: 'hour',
                tenant: ''
            }
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({rent: this._rent});
        this.props.navigation.setParams({submitEquipment: this._submit});
        let {params} = this.props.navigation.state;
        if (params.operation != 'new') {
            if (params.operation == 'view')
                this.setState({editable: false})
            this._loadEquipmentData(params.oid);
        }
    }

    _loadEquipmentData = (id) => {
        fetch(global.equipmentModuleUrl + 'get?equipmentId=' + id, {
            method: 'GET'
        }).then(response => response.json())
            .then(responseJson => {
                let equipmentInfo = responseJson;
                equipmentInfo.num = (equipmentInfo.num).toString();
                equipmentInfo.cost = (equipmentInfo.cost).toString();
                equipmentInfo.guarantee = (equipmentInfo.guarantee).toString();
                this.setState({equipmentInfo: responseJson})
            })
    }
    _rent = () => {
        var _this = this;
        if (global.userId == '' || global.userId == undefined) {
            Alert.alert(
                '',
                '请先登录',
                [
                    {
                        text: '确认', onPress: () => this.props.navigation.navigate('Users')
                    }
                ]
            )
            return;
        }
        fetch(global.equipmentModuleUrl + 'rent?userId=' + global.userId + '&equipmentId=' + _this.state.equipmentInfo.id, {
            method: 'GET'
        }).then(response => response.json())
            .then(responseJson => {
                if (responseJson.success) {
                    _this.props.navigation.state.params.removeEquipmentFromList(_this.props.navigation.state.params.item);
                    let events = [];
                    events.push(responseJson.event);
                    ConversitionUtil.saveEvents(events);
                    Alert.alert(
                        '',
                        '租借器材成功',
                        [
                            {
                                text: '确认', onPress: () => _this.props.navigation.pop()
                            }
                        ]
                    )
                } else {
                    Alert.alert(
                        '',
                        responseJson.message,
                        [
                            {
                                text: '确认', type: 'cancel'
                            }
                        ]
                    )
                }
            })
    }
    _submit = () => {
        var _this = this;
        if (global.userId == '' || global.userId == undefined) {
            Alert.alert(
                '',
                '请先登录',
                [
                    {
                        text: '确认', onPress: () => this.props.navigation.navigate('Users')
                    }
                ]
            )
            return;
        }
        if (this._validateData()) {
            fetch(global.equipmentModuleUrl + 'save', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_this.state.equipmentInfo)
            }).then(response => response.json())
                .then(responseJson => {
                    if (responseJson.success) {
                        if (responseJson.event) {
                            let events = [];
                            events.push(responseJson.event);
                            ConversitionUtil.saveEvents(events);
                        }
                        Alert.alert(
                            '',
                            _this.state.equipmentInfo.id == '' ? '创建器材租借成功' : '更新器材租借成功',
                            [
                                {
                                    text: '确认', onPress: () => _this.props.navigation.pop()
                                }
                            ]
                        )
                    } else {
                        Alert.alert(
                            '',
                            responseJson.message,
                            [
                                {
                                    text: '确认', type: 'cancel'
                                }
                            ]
                        )
                    }
                })
        }
    }
    _validateData = () => {
        if (this.state.equipmentInfo.title == '') {
            Alert.alert(
                '',
                '必须填写标题',
                [
                    {
                        text: '确认', type: 'cancel'
                    }
                ]
            )
            return false;
        }
        else if (this.state.equipmentInfo.num == '0') {
            Alert.alert(
                '',
                '必须填写数量',
                [
                    {
                        text: '确认', type: 'cancel'
                    }
                ]
            )
            return false;
        } else if (this.state.equipmentInfo.location.address == '') {
            Alert.alert(
                '',
                '必须填写地址',
                [
                    {
                        text: '确认', type: 'cancel'
                    }
                ]
            )
            return false;
        }
        else if (this.state.equipmentInfo.type == 'other' && this.state.equipmentInfo.otherType == '') {
            Alert.alert(
                '',
                '必须填写器材类型',
                [
                    {
                        text: '确认', type: 'cancel'
                    }
                ]
            )
            return false;
        } else {
            return true;
        }
    }
    _openGeoSelect = () => {
        var _this = this;
        this.props.navigation.navigate('SiteView', {
            setLocation: _this._setLocation,
            location: _this.state.equipmentInfo.location
        });
    }
    _setLocation = (location) => {
        this.setState((previous) => {
            previous.equipmentInfo.location = location;
            return previous;
        })
    }
    _chkPrice = (obj) => {
        obj=(obj==''||obj==undefined)?'0':obj;
        obj = obj.replace(/[^\d]/g, "");
        return obj;
    }

    render() {
        var costItems = [];
        for (var i in CostUnit) {
            costItems.push((
                <Picker.Item label={CostUnit[i]} value={i}/>
            ))
        }
        var equipmentList = [];
        for (var i in EquipmentType) {
            equipmentList.push((
                <Picker.Item label={EquipmentType[i]} value={i}/>
            ))
        }
        return (
            <ScrollView>
                <View style={MCV.dateDetailContainer}>
                    <View style={MCV.dateDetailView}>
                        <ScrollView>
                            <View style={MCV.sportInputView}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.title + CommonString.semicolon}</Text></View>
                                <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle}
                                                                           underlineColorAndroid='#bdbdbd'
                                                                           value={this.state.equipmentInfo.title}
                                                                           onChangeText={text => this.setState(previous => {
                                                                               previous.equipmentInfo.title = text;
                                                                               return previous;
                                                                           })}
                                                                           editable={this.state.editable}></TextInput></View>
                            </View>
                            <View
                                style={[MCV.sportInputView]}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.location + CommonString.semicolon}</Text></View>
                                <TouchableOpacity onPress={() => this._openGeoSelect()} disabled={!this.state.editable}><View
                                    style={MCV.textInputView}><TextInput editable={false} style={MCV.textInputStyle}
                                                                         value={this.state.equipmentInfo.location.address}
                                                                         underlineColorAndroid='#bdbdbd'></TextInput></View></TouchableOpacity>
                            </View>
                            <View
                                style={[MCV.sportInputView]}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.equipmentType + CommonString.semicolon}</Text></View>
                                <View style={[MCV.textInputView, {
                                    justifyContent: 'flex-end',
                                    alignItems: 'center'
                                }]}>
                                    <Picker
                                        enabled={this.state.editable} mode={Picker.MODE_DROPDOWN}
                                        style={[MCV.gamePicker]}
                                        selectedValue={this.state.equipmentInfo.type}
                                        onValueChange={type => this.setState(previous => {
                                            previous.equipmentInfo.type = type;
                                            return previous;
                                        })}>
                                        {equipmentList}</Picker></View>
                            </View>
                            <View
                                style={[MCV.sportInputView, {display: (this.state.equipmentInfo.type == 'other' ? 'flex' : 'none')}]}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.otherEquipmentType + CommonString.semicolon}</Text></View>
                                <View style={[MCV.textInputView]}>
                                    <TextInput editable={this.state.editable}
                                               style={[MCV.textInputStyle]}
                                               value={this.state.equipmentInfo.otherType}
                                               onChangeText={text => this.setState(previous => {
                                                   previous.equipmentInfo.otherType = text;
                                                   return previous;
                                               })}
                                               underlineColorAndroid='#bdbdbd'></TextInput></View>
                            </View>
                            <View
                                style={[MCV.sportInputView]}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.cost + CommonString.semicolon}</Text></View>
                                <View style={[MCV.textInputView, {flexDirection: 'row'}]}>
                                    <View style={{height: 40, flex: 1}}><TextInput
                                        style={{textAlign:'center'}}
                                        keyboardType='numeric'
                                        underlineColorAndroid='#bdbdbd'
                                        value={this.state.equipmentInfo.cost}
                                        onChangeText={text => this.setState(previous => {
                                            previous.equipmentInfo.cost = this._chkPrice(text);
                                            return previous;
                                        })}
                                        editable={this.state.editable}></TextInput></View>
                                    <View
                                        style={{width: 20, height: 40, alignItems: 'center', justifyContent: 'center'}}><Text>/</Text></View>
                                    <Picker
                                        enabled={this.state.editable} mode={Picker.MODE_DROPDOWN}
                                        style={[MCV.gamePicker, {width: 100}]}
                                        selectedValue={this.state.equipmentInfo.unit}
                                        onValueChange={unit => this.setState(previous => {
                                            previous.equipmentInfo.unit = unit;
                                            return previous;
                                        })}>
                                        {costItems}</Picker></View>
                            </View>
                            <View
                                style={[MCV.sportInputView]}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.guarantee + CommonString.semicolon}</Text></View>
                                <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle}
                                                                           keyboardType='numeric'
                                                                           underlineColorAndroid='#bdbdbd'
                                                                           value={this.state.equipmentInfo.guarantee}
                                                                           onChangeText={text => this.setState(previous => {
                                                                               previous.equipmentInfo.guarantee = this._chkPrice(text);
                                                                               return previous;
                                                                           })}
                                                                           editable={this.state.editable}></TextInput></View>
                            </View>
                            <View style={MCV.sportInputView}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.numOfEquipment + CommonString.semicolon}</Text></View>
                                <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle}
                                                                           keyboardType='numeric'
                                                                           underlineColorAndroid='#bdbdbd'
                                                                           value={this.state.equipmentInfo.num}
                                                                           onChangeText={text => this.setState(previous => {
                                                                               previous.equipmentInfo.num = this._chkPrice(text);
                                                                               return previous;
                                                                           })}
                                                                           editable={this.state.editable}></TextInput></View>
                            </View>
                            <View style={[MCV.sportInputView, {
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                paddingHorizontal: 10,
                                paddingVertical: 10
                            }]}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.description + CommonString.semicolon}</Text></View>
                                <View style={MCV.textAreaView}><TextInput style={[MCV.textArea]} multiline={true}
                                                                          placeholder={CommonString.descriptionPlaceHolder}
                                                                          underlineColorAndroid='transparent'
                                                                          value={this.state.equipmentInfo.description}
                                                                          onChangeText={text => this.setState(previous => {
                                                                              previous.equipmentInfo.description = text;
                                                                              return previous;
                                                                          })}
                                                                          editable={this.state.editable}></TextInput></View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        )
    }
}