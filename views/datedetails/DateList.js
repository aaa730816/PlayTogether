import React, {Component} from 'react';
import {View, FlatList, Text, TouchableOpacity, Alert, Picker} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CommonString from '../../resource/CommonString';
import MCV from '../../MCV';
import moment from 'moment';

var Geolocation = require('Geolocation');
export default class DateList extends Component {
    static navigationOptions = ({navigation}) => ({
        title: CommonString.DateListTitle,
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerRight: (
            <TouchableOpacity onPress={() => navigation.state.params.addPress()}><View><Icon name={'md-add'} size={25}
                                                                                             style={{
                                                                                                 color: 'white',
                                                                                                 marginRight: 20
                                                                                             }}></Icon></View></TouchableOpacity>),
        headerTitleStyle: MCV.headerTitleStyle,
        tabBarLabel: navigation.state.params.item.tabName
    })

    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            data: [],
            totalPages: 0,
            component: '',
            requestType: 'nearest',
            activityCriteria: {
                location: {
                    longitude: 121.39903,
                    latitude: 31.32144,
                },
                page: 0,
                size: 10,
                type: ''
            }
        }
    }

    componentDidMount() {
        Geolocation.getCurrentPosition(
            result => {
                var location = result.coords;
                this.setState(previous => {
                    previous.activityCriteria.location.latitude = location.latitude;
                    previous.activityCriteria.location.longitude = location.longitude;
                    return previous;
                })
            })
        let {params} = this.props.navigation.state;
        this.setState(previous => {
            previous.activityCriteria.type = this.props.navigation.state.params.item.type;
            previous.component = params.item.component;
            return previous;
        }, function () {
            this._doLoadDatas(this);
        })
        this.props.navigation.setParams({addPress: this.createDate})
    }

    createDate = () => {
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
        } else {
            let {params} = this.props.navigation.state;
            this.props.navigation.navigate('Activity', {
                operation: 'new',
                item: params.item
            })
        }
    }
    openDate = (item) => {
        let {params} = this.props.navigation.state;
        let operation = 'join';
        if (!(global.userId == '' || global.userId == undefined)) {
            if (item.creator == global.userId.toString()) {
                operation == 'update';
            } else {
                operation = 'join';
            }
        }
        this.props.navigation.navigate('Activity', {
            operation: operation,
            item: params.item,
            oid: item.id
        })
    }
    onRenderItem = ({item}) => {
        return (
            <TouchableOpacity
                onPress={() => this.openDate(item)}>
                <View style={MCV.dateContainer}>
                    <View style={MCV.dateFirstRow}><Text
                        style={MCV.dateTitle}>{item.title + (item.numOfPeople == 0 ? '(已满)' : '')}</Text>{this.state.component != 'Game' ?
                        <Text
                            style={MCV.dateDistance}>{item.distance / 1000 + 'km'}</Text> : (<View/>)}</View>
                    <Text style={MCV.dateTime}>时间:{moment(item.startTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    {this.state.component == 'Game' ? <Text style={MCV.dateSite}>游戏:{item.game}</Text> :
                        <Text style={MCV.dateSite}>地点:{item.address}</Text>}
                </View>
            </TouchableOpacity>
        )
    }
    onKeyExtractor = (item, index) => item.id
    separator = () => {
        return (<View style={MCV.separator}></View>);
    }
    _onRefresh = () => {
        this.setState(previous => {
            previous.activityCriteria.page = 0;
            previous.totalPages = 0;
            previous.data = [];
            previous.refreshing = true;
            return previous;
        }, () => this._doLoadDatas(this))
    }
    _onEndReach = () => {
        if (!(this.state.totalPages != 0 && this.state.activityCriteria.page == this.state.totalPages - 1)) {
            if (this.state.totalPages != 0) {
                this.setState(previous => {
                    previous.activityCriteria.page += 1;
                    previous.refreshing = true;
                    return previous;
                }, () => this._doLoadDatas(this))
            }
        }
    }
    _doLoadDatas = (_this) => {
        fetch(global.activityModuleUrl + 'search/' + _this.state.requestType, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(_this.state.activityCriteria)
        }).then(response => response.json())
            .then(responseJson => {
                this.setState(previous => {
                        previous.totalPages = responseJson.totalPages;
                        previous.data = previous.data.concat(responseJson.content);
                        previous.refreshing = false;
                        return previous;
                    }
                )
            })
    }

    render() {
        return (
            <View style={MCV.dateListContainer}>
                <View
                    style={[MCV.equipmentPickerView, {display: this.state.activityCriteria.type == 'game' ? 'none' : 'flex'}]}>
                    <Picker mode={Picker.MODE_DROPDOWN}
                            style={MCV.activityPicker}
                            selectedValue={this.state.requestType}
                            onValueChange={requestType => {
                                var _this = this;
                                this.setState({requestType: requestType}, function () {
                                    _this._onRefresh();
                                })
                            }}>
                        <Picker.Item label={'距离最近'} value={'nearest'}/>
                        <Picker.Item label={'附近范围'} value={'around'}/>
                        <Picker.Item label={'价格最低'} value={'cheapest'}/>
                        <Picker.Item label={'最新发布'} value={'newest'}/>
                    </Picker>
                    <View style={MCV.activityPicker}>
                        <TouchableOpacity onPress={() => {
                            let type = this.state.activityCriteria.type;
                            this.props.navigation.navigate('EventMap', {
                                event: {
                                    eventType: 'activity',
                                    type: type
                                }
                            })
                        }}><Text style={MCV.dateSearchBtn}>地图搜索</Text></TouchableOpacity>
                    </View>
                </View>
                <FlatList ItemSeparatorComponent={this.separator} data={this.state.data} renderItem={this.onRenderItem}
                          onRefresh={() => this._onRefresh()}
                          refreshing={this.state.refreshing}
                          onEndReached={() => this._onEndReach()}
                          onEndReachedThreshold={0.1}
                          keyExtractor={this.onKeyExtractor}/>
            </View>
        )
    }
}