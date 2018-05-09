import React, {Component} from 'react';
import {View, FlatList, TouchableOpacity, Text, Picker, Alert} from 'react-native';
import MCV from "../../MCV";
import costUnit from '../utils/CostUnit';
import equipmentType from '../equipment/EquipmentType';
import CommonString from '../../resource/CommonString';
import Icon from 'react-native-vector-icons/Ionicons';
var Geolocation = require('Geolocation');
export default class EquipmentList extends Component {
    static navigationOptions = ({navigation}) => ({
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerLeft:(<View></View>),
        headerRight: (
            <TouchableOpacity onPress={() => navigation.state.params.addPress()}><View><Icon name={'md-add'} size={25}
                                                                                             style={{
                                                                                                 color: 'white',
                                                                                                 marginRight: 20
                                                                                             }}></Icon></View></TouchableOpacity>)
    })

    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            data: [],
            totalPages: 0,
            equipmentCriteria: {
                location: {
                    longitude: 121.39903,
                    latitude: 31.32144,
                },
                page: 0,
                size: 10,
                type: 'basketball'
            },
            requestType: 'nearest'
        }
    }

    componentDidMount() {
        Geolocation.getCurrentPosition(
            result => {
                var location = result.coords;
                this.setState(previous => {
                    previous.equipmentCriteria.location.latitude = location.latitude;
                    previous.equipmentCriteria.location.longitude = location.longitude;
                    return previous;
                }, function () {
                    this._doLoadDatas(this);
                })
            })
        this.props.navigation.setParams({addPress:this._createEquipment})
    }
    _createEquipment=()=>{
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
            this.props.navigation.navigate('Equipment', {
                operation: 'new'
            })
        }
    }
    _openEquipmentDetail=(item)=>{
        var _this=this;
        this.props.navigation.navigate('Equipment',{
            operation:item.creator==global.userId?'update':'view',
            oid:item.id,
            item:item,
            removeEquipmentFromList:_this._removeEquipmentFromList
        })
    }
    _removeEquipmentFromList=(item)=>{
        this.setState(previous=>{
            previous.data.splice(previous.data.indexOf(item),1);
            return previous;
        })
    }
    onRenderItem = ({item}) => {
        return (
            <TouchableOpacity onPress={()=>this._openEquipmentDetail(item)}>
                <View style={[MCV.dateContainer, {height: 150}]}>
                    <View style={MCV.dateFirstRow}><Text style={MCV.dateTitle}>{item.title}</Text>
                        <Text style={MCV.dateDistance}>{item.distance / 1000 + 'km'}</Text></View>
                    <Text style={MCV.dateSite}>数量:{item.num}</Text>
                    <Text style={MCV.dateSite}>费用:{item.cost + '/' + costUnit[item.unit]} </Text>
                    <Text style={MCV.dateSite}>押金:{item.guarantee}</Text>
                    <Text style={MCV.dateSite}>地点:{item.address}</Text>
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
            previous.equipmentCriteria.page = 0;
            previous.totalPages = 0;
            previous.data = [];
            previous.refreshing = true;
            return previous;
        }, () => this._doLoadDatas(this))
    }
    _onEndReach = () => {
        if (!(this.state.totalPages != 0 && this.state.equipmentCriteria.page == this.state.totalPages - 1)) {
            if (this.state.totalPages != 0) {
                this.setState(previous => {
                    previous.equipmentCriteria.page += 1;
                    previous.refreshing = true;
                    return previous;
                }, () => this._doLoadDatas(this))
            }
        }
    }
    _doLoadDatas = (_this) => {
        fetch(global.equipmentModuleUrl + 'search/' + _this.state.requestType, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(_this.state.equipmentCriteria)
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
        var equipmentList = [];
        for (var i in equipmentType) {
            equipmentList.push((
                <Picker.Item label={equipmentType[i]} value={i}/>
            ))
        }
        return (
            <View style={[MCV.dateListContainer]}>
                <View style={MCV.equipmentPickerView}>
                    <Picker mode={Picker.MODE_DROPDOWN}
                            style={MCV.equipmentPicker}
                            selectedValue={this.state.equipmentCriteria.type}
                            onValueChange={equipmentType => {
                                var _this = this;
                                this.setState(previous => {
                                    previous.equipmentCriteria.type = equipmentType;
                                    return previous;
                                }, function () {
                                    _this._onRefresh();
                                })
                            }}>{equipmentList}</Picker>
                    <Picker mode={Picker.MODE_DROPDOWN}
                            style={MCV.equipmentPicker}
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
                    <View style={MCV.equipmentPicker}>
                        <TouchableOpacity onPress={()=>{
                            let type = this.state.equipmentCriteria.type;
                            this.props.navigation.navigate('EventMap', {
                                event: {
                                    eventType: 'equipment',
                                    type: type
                                }
                            })}}><Text style={MCV.dateSearchBtn}>地图搜索</Text></TouchableOpacity>
                    </View>
                </View>
                <FlatList ItemSeparatorComponent={this.separator} data={this.state.data} renderItem={this.onRenderItem}
                          onRefresh={() => this._onRefresh()}
                          refreshing={this.state.refreshing}
                          onEndReached={() => this._onEndReach()}
                          onEndReachedThreshold={0.1}
                          keyExtractor={this.onKeyExtractor}/>
            </View>
        );
    }
}