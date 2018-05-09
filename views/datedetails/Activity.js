import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    TextInput,
    ScrollView,
    CheckBox,
    DatePickerAndroid,
    TouchableOpacity,
    Picker, Alert, DeviceEventEmitter
} from 'react-native';
import MCV from '../../MCV';
import CommonString from '../../resource/CommonString';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import ConversitionUtil from '../utils/ConversitonUtil';

export default class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hourPickerItems: [],
            isDateTimePickerVisible: false,
            editable: true,
            component: '',
            dateInfo: {
                title: '',
                startTime: new Date(),
                location: {
                    longitude: 121.39903166666659,
                    latitude: 31.32143821296778,
                    address: '',
                    name: ''
                },
                id: '',
                cost: '',
                needBringEquipment: false,
                numOfPeople: '',
                description: '',
                type: this.props.navigation.state.params.item.type,
                participant: [],
                creator: '',
                game: ''
            },
            selectedGame: Activity.games[0]
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({submitDate: this._submitDate})
        this.props.navigation.setParams({joinDate: this._joinDate})
        var hourPickerItems = [];
        for (let i = 0; i <= 23; i++) {
            let display = i.toString();
            hourPickerItems.push((<Picker.Item key={i} label={display} value={display}/>))
        }
        let {params} = this.props.navigation.state;
        this.setState(previous => {
            previous.hourPickerItems = hourPickerItems;
            previous.dateInfo.creator = global.userId;
            previous.component = params.item.component
        })
        if (params.operation == 'update' || params.operation == 'join') {
            fetch(global.activityModuleUrl + 'getById?oid=' + params.oid, {
                method: 'GET'
            }).then(response => response.json())
                .then(responseJson => {
                    responseJson.numOfPeople = (responseJson.numOfPeople).toString();
                    responseJson.startTime = moment(responseJson.startTime).toDate();
                    let selectedGame = responseJson.game;
                    if (Activity.games.indexOf(responseJson.game) == -1) {
                        selectedGame = Activity.games[Activity.games.length - 1];
                    }
                    this.setState({dateInfo: responseJson, selectedGame: selectedGame})
                })
        }
        if (params.operation == 'join') {
            this.setState({editable: false})
        }
    }
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.item.title,
        headerStyle: MCV.headerStyle,
        headerRight: (
            <TouchableOpacity onPress={() => {
                navigation.state.params.operation == 'join' ? navigation.state.params.joinDate() : navigation.state.params.submitDate()
            }}>
                <Text style={{
                    color: 'white',
                    paddingRight: 20,
                    fontWeight: 'bold'
                }}>{navigation.state.params.operation == 'join' ? '参加' : '保存'}</Text>
            </TouchableOpacity>
        ),
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
        tabBarLabel: CommonString.DateTabName,
    })

    static games = ['守望先锋', '英雄联盟', '魔兽世界', '绝地求生', '风暴英雄', 'CS:GO', '彩虹六号', '其他'];
    handleClick = () => {
        this.setState((state) => {
            let info = state.dateInfo;
            info.needBringEquipment = info.needBringEquipment ? false : true;
            return {
                dateInfo: info
            }
        })
    }
    _submitDate = () => {
        if (this.state.dateInfo.title == '') {
            Alert.alert(
                '',
                '必须填写标题',
                [
                    {
                        text: '确认', type: 'cancel'
                    }
                ]
            )
        }
        else if (this.state.dateInfo.numOfPeople == '') {
            Alert.alert(
                '',
                '必须填写人数',
                [
                    {
                        text: '确认', type: 'cancel'
                    }
                ]
            )
        }
        else if (this.state.component != 'Game' && this.state.dateInfo.location.address == '') {
            Alert.alert(
                '',
                '必须填写地址',
                [
                    {
                        text: '确认', type: 'cancel'
                    }
                ]
            )
        } else if (this.state.component == 'Game' && this.state.dateInfo.game == '') {
            Alert.alert(
                '',
                '请填写游戏',
                [
                    {
                        text: '确认', type: 'cancel'
                    }
                ]
            )
        }
        else {
            var _this = this;
            fetch(global.activityModuleUrl + 'save', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_this.state.dateInfo)
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
                            _this.state.dateInfo.id == '' ? '创建活动成功' : '更新活动成功',
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
    _joinDate = () => {
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
        if (this.state.dateInfo.participant.indexOf(global.userId.toString()) != -1) {
            Alert.alert(
                '',
                '您已参加过该活动',
                [
                    {
                        text: '确认', type: 'cancel'
                    }
                ]
            )
            return;
        }
        if (this.state.dateInfo.numOfPeople == 0) {
            Alert.alert(
                '',
                '人数已满',
                [
                    {
                        text: '确认', type: 'cancel'
                    }
                ]
            )
            return;
        }
        let _this = this;
        let userId = global.userId;
        let {params} = this.props.navigation.state;
        let activityId = params.oid;
        fetch(global.activityModuleUrl + 'join', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: userId, activityId: activityId})
        }).then(response => response.json())
            .then(responseJson => {
                if (responseJson.success) {
                    let events = [];
                    events.push(responseJson.event);
                    ConversitionUtil.saveEvents(events);
                    Alert.alert(
                        '',
                        '参加活动成功',
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
    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        let info = this.state.dateInfo;
        info.startTime = date;
        this.setState({
            dateInfo: info
        })
        this._hideDateTimePicker();
    }
    _openGeoSelect = () => {
        var _this = this;
        this.props.navigation.navigate('SiteView', {
            setLocation: _this._setLocation,
            location: _this.state.dateInfo.location
        });
    }
    _setLocation = (location) => {
        this.setState((previous) => {
            previous.dateInfo.location = location;
            return previous;
        })
    }
    _chkPrice = (obj) => {
        obj = obj.replace(/[^\d]/g, "");
        return obj;
    }

    render() {
        let {params} = this.props.navigation.state;
        let item = params.item;
        let gamesPickers = [];
        for (var k in Activity.games) {
            gamesPickers.push(
                <Picker.Item label={Activity.games[k]} value={Activity.games[k]}/>
            )
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
                                                                           value={this.state.dateInfo.title}
                                                                           onChangeText={text => this.setState(previous => {
                                                                               previous.dateInfo.title = text;
                                                                               return previous;
                                                                           })}
                                                                           editable={this.state.editable}></TextInput></View>
                            </View>
                            <View style={MCV.sportInputView}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.startTime + CommonString.semicolon}</Text></View>
                                <View style={MCV.textInputView}>
                                    <TouchableOpacity onPress={() => this._showDateTimePicker()}
                                                      disabled={!this.state.editable}>
                                        <TextInput style={MCV.textInputStyle} editable={false}
                                                   underlineColorAndroid='#bdbdbd'
                                                   value={this.state.dateInfo.startTime.toLocaleDateString() + ' ' + this.state.dateInfo.startTime.toLocaleTimeString()}></TextInput>
                                    </TouchableOpacity>
                                    <DateTimePicker
                                        mode='datetime'
                                        date={this.state.dateInfo.startTime}
                                        isVisible={this.state.isDateTimePickerVisible}
                                        onConfirm={this._handleDatePicked}
                                        onCancel={this._hideDateTimePicker}
                                    />
                                </View>
                            </View>
                            <View
                                style={[MCV.sportInputView, {display: this.state.component == 'Game' ? 'none' : 'flex'}]}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.location + CommonString.semicolon}</Text></View>
                                <TouchableOpacity onPress={() => this._openGeoSelect()} disabled={!this.state.editable}><View
                                    style={MCV.textInputView}><TextInput editable={false} style={MCV.textInputStyle}
                                                                         value={this.state.dateInfo.location.address}
                                                                         underlineColorAndroid='#bdbdbd'></TextInput></View></TouchableOpacity>
                            </View>
                            <View
                                style={[MCV.sportInputView, {display: this.state.component == 'Game' ? 'flex' : 'none'}]}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.game + CommonString.semicolon}</Text></View>
                                <View style={[MCV.textInputView, {
                                    justifyContent: 'flex-end',
                                    alignItems: 'center'
                                }]}><Picker enabled={this.state.editable} mode={Picker.MODE_DROPDOWN}
                                            style={MCV.gamePicker}
                                            selectedValue={this.state.selectedGame}
                                            onValueChange={game => this.setState(previous => {
                                                if (game != Activity.games[Activity.games.length - 1]) {
                                                    previous.dateInfo.game = game;
                                                } else {
                                                    previous.dateInfo.game = '';
                                                }
                                                previous.selectedGame = game;
                                                return previous;
                                            })}>
                                    {gamesPickers}</Picker>
                                </View>
                            </View>
                            <View
                                style={[MCV.sportInputView, {display: (this.state.component == 'Game' && this.state.selectedGame == Activity.games[Activity.games.length - 1]) ? 'flex' : 'none'}]}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.otherGame + CommonString.semicolon}</Text></View>
                                <View
                                    style={MCV.textInputView}><TextInput style={MCV.textInputStyle}
                                                                         underlineColorAndroid='#bdbdbd'
                                                                         value={this.state.dateInfo.game}
                                                                         onChangeText={text => this.setState(previous => {
                                                                             previous.dateInfo.game = text;
                                                                             return previous;
                                                                         })}
                                                                         editable={this.state.editable}></TextInput></View>
                            </View>
                            <View
                                style={[MCV.sportInputView, {display: this.state.component == 'Game' ? 'none' : 'flex'}]}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.cost + CommonString.semicolon}</Text></View>
                                <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle}
                                                                           keyboardType='numeric'
                                                                           underlineColorAndroid='#bdbdbd'
                                                                           value={this.state.dateInfo.cost}
                                                                           onChangeText={text => this.setState(previous => {
                                                                               previous.dateInfo.cost = this._chkPrice(text);
                                                                               return previous;
                                                                           })}
                                                                           editable={this.state.editable}></TextInput></View>
                            </View>
                            <View style={MCV.sportInputView}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.numOfPeople + CommonString.semicolon}</Text></View>
                                <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle}
                                                                           keyboardType='numeric'
                                                                           underlineColorAndroid='#bdbdbd'
                                                                           value={this.state.dateInfo.numOfPeople}
                                                                           onChangeText={text => this.setState(previous => {
                                                                               previous.dateInfo.numOfPeople = this._chkPrice(text);
                                                                               return previous;
                                                                           })}
                                                                           editable={this.state.editable}></TextInput></View>
                            </View>
                            <View
                                style={[MCV.sportInputView, {display: this.state.component == 'Sport' ? 'flex' : 'none'}]}>
                                <View
                                    style={MCV.labelStyle}><Text>{CommonString.needBringEquipment + CommonString.semicolon}</Text></View>
                                <View style={MCV.textInputView}><CheckBox style={{alignSelf: 'flex-end'}}
                                                                          onValueChange={this.handleClick}
                                                                          value={this.state.dateInfo.needBringEquipment}
                                                                          editable={this.state.editable}></CheckBox></View>
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
                                                                          value={this.state.dateInfo.description}
                                                                          onChangeText={text => this.setState(previous => {
                                                                              previous.dateInfo.description = text;
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