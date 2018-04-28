import React, {Component} from 'react';
import {View, FlatList, TouchableOpacity, Text, Picker} from 'react-native';
import MCV from "../../MCV";

export default class EquipmentList extends Component{
    constructor(props){
        super(props);
        this.state={
            refreshing: true,
            data: [],
            totalPages: 0,
            equipmentCriteria: {
                geoLocation: {
                    longitude: 121.39903,
                    latitude: 31.32144,
                },
                page: 0,
                size: 10,
                equipmentType:''
            }
        }
    }
    onRenderItem = ({item}) => {
        return (
            <TouchableOpacity>
                <View style={MCV.dateContainer}>
                    <View style={MCV.dateFirstRow}><Text style={MCV.dateTitle}>{item.title+(item.numOfPeople==0?'(已满)':'')}</Text>{this.state.component!='Game'?<Text
                        style={MCV.dateDistance}>{item.distance / 1000 + 'km'}</Text>:(<View/>)}</View>
                    <Text style={MCV.dateTime}>时间:{new Date(item.startTime).toLocaleDateString()+' '+new Date(item.startTime).toLocaleTimeString()}</Text>
                    {this.state.component=='Game'?<Text style={MCV.dateSite}>游戏:{item.game}</Text>:<Text style={MCV.dateSite}>地点:{item.address}</Text>}
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
        fetch(global.activityModuleUrl + 'nearest', {
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
        return (
            <View style={MCV.dateListContainer}>
                <View>
                    <Picker></Picker>
                    <Picker>
                        <Picker.Item label={'距离最近'} value={'nearest'}/>
                        <Picker.Item label={'五公里内'} value={'in5km'}/>
                        <Picker.Item label={'价格最低'} value={'cheapest'}/>
                    </Picker>
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