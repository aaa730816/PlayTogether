import React, {Component} from 'react';
import {
    View, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList, Text, StatusBar, Alert,
    Picker, TouchableHighlight, TouchableNativeFeedback
} from 'react-native';
import {
    MapView,
    MapTypes
} from 'react-native-baidu-map';
import IconFA from 'react-native-vector-icons/FontAwesome';
import MCV from '../../MCV';
import CityMap from '../utils/CityMap';
import CityCodes from '../utils/CityCodes';
import Swiper from 'react-native-swiper';
import dateType from "../utils/DateType";
import costUnit from "../utils/CostUnit";
import moment from 'moment';

var Geolocation = require('Geolocation');

export default class EventMap extends Component {
    swiper;
    currentIndex=0;
    static navigationOptions = ({navigation}) => ({
        title: '地图搜索',
        headerRight: (
            <View/>
        )
    })

    constructor(props) {
        super(props);
        this.state = {
            showSwiper: false,
            eventType: props.navigation.state.params.event.eventType,
            eventCriteria: {
                location: {
                    longitude: 121.39903,
                    latitude: 31.32144,
                },
                page: 0,
                size: 50,
                type: props.navigation.state.params.event.type
            },
            eventData: [],
            mapType: MapTypes.NORMAL,
            zoom: 13,
            markers: [{
                longitude: 121.39903166666659,
                latitude: 31.32143821296778,
                title: '上海市宝山区泮池南路'
            }],
            modalVisiable: false,
            data: [],
            region: 289,
            query: '',
            location: {
                longitude: 121.39903166666659,
                latitude: 31.32143821296778,
                address: '',
                name: ''
            }
        }
    }


    componentDidMount() {
        Geolocation.getCurrentPosition(
            result => {
                var location = result.coords;
                this._baiduMapGeoSearch(location.longitude, location.latitude);
            })
    }

    openDate = (i) => {
        let item = {
            component: dateType[i.type].component,
            title: dateType[i.type].title
        }
        let operation = 'join';
        if (!(global.userId == '' || global.userId == undefined)) {
            if (item.creator == global.userId.toString()) {
                operation == 'update';
            } else {
                operation = 'join';
            }
        }
        if (this.state.eventType == 'equipment') {
            this.props.navigation.navigate('Equipment', {
                item: i,
                oid: i.id,
                operation: operation == 'update' ? 'update' : 'view'
            })
        }
        else {
            this.props.navigation.navigate('Activity', {
                operation: operation,
                item: item,
                oid: i.id
            })
        }
    }

    render() {
        let regions = [];
        for (var i in CityCodes) {
            regions.push(
                <Picker.Item label={CityMap[CityCodes[i]]} value={CityCodes[i]}/>
            )
        }
        return (
            <View style={{flex: 1}}>
                <MapView style={MCV.mapViewStyle} center={this.state.eventCriteria.location}
                         markers={this.state.markers} onMarkerClick={marker => this._onMarkerClick(marker)}
                         zoom={this.state.zoom} mapType={this.state.mapType}></MapView>
                <View style={[MCV.locationSearchView, {height: 50}]}>
                    <TouchableOpacity onPress={() => this._onClickSearch()}>
                        {/*<IconFA name='search' size={30}/>*/}
                        <TextInput style={[MCV.locationSearchField, {
                            color: '#424242',
                            borderBottomWidth: 1,
                            borderBottomColor: '#bdbdbd',
                            borderWidth: this.state.location.name == '' ? 1 : 0,
                            borderColor: this.state.location.name == '' ? 'red' : 'white'
                        }]} editable={false} value={this.state.location.name}
                                   onChangeText={(text) => this.setState((previous) => {
                                       previous.location.name = text;
                                       return previous
                                   })} underlineColorAndroid={'transparent'}/>
                    </TouchableOpacity>
                </View>
                {this.state.showSwiper ?
                    (<View style={MCV.eventSwiperStyle}>
                        {this._renderSwiper()}
                    </View>) : <View/>
                }
                <Modal animationType={'slide'} transparent={false} visible={this.state.modalVisiable}
                       onRequestClose={() => this.setState({modalVisiable: false})}>
                    <View style={MCV.locationSearchContainer}>
                        <StatusBar backgroundColor={'white'}/>
                        <View style={MCV.locationSearchTextField}>
                            <Picker style={[MCV.doLocationSearchBtn, {width: 150}]} selectedValue={this.state.region}
                                    onValueChange={region => this.setState({region: region})}>
                                {regions}
                            </Picker>
                            <TextInput style={{flex: 1}} onChangeText={(text) => this.setState({query: text})}
                                       underlineColorAndroid={'transparent'}></TextInput>
                            <TouchableOpacity onPress={() => this._searchLocation()}>
                                <View style={MCV.doLocationSearchBtn}><IconFA name='search' size={25}/></View>
                            </TouchableOpacity>
                        </View>
                        <View style={MCV.locationListView}>
                            <FlatList ItemSeparatorComponent={this.separator} data={this.state.data}
                                      renderItem={this.onRenderItem}
                                      keyExtractor={this.onKeyExtractor}></FlatList>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    _renderSwiper = () => {
        return (
            <Swiper ref={swiper => this.swiper = swiper} height={150} autoplay={false} loop={true} autoplay={false}
                    onIndexChanged={index=>this.currentIndex=index}
                    showsButtons={true}
                    showsPagination={false}>
                {this.state.eventData.map((item, i) => {
                    if (this.state.eventType == 'activity') {
                        return (
                            <View style={{elevation: 1,}}>
                                <TouchableNativeFeedback
                                    onPress={() => this.openDate(item)}>
                                    <View style={[MCV.swiperEventContainer]}>
                                        <View style={MCV.swiperContent}>
                                            <View style={MCV.swiperEventFirstRow}><Text
                                                style={MCV.dateTitle}>{item.title + (item.numOfPeople == 0 ? '(已满)' : '')}</Text>{this.state.component != 'Game' ?
                                                <Text
                                                    style={MCV.dateDistance}>{item.distance / 1000 + 'km'}</Text> : (
                                                    <View/>)}</View>
                                            <Text
                                                style={MCV.dateTime}>时间:{moment(item.startTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                            {this.state.component == 'Game' ?
                                                <Text style={MCV.dateSite}>游戏:{item.game}</Text> :
                                                <Text style={MCV.dateSite}>地点:{item.address}</Text>}
                                        </View>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        );
                    }
                    else {
                        return (
                            <View>
                                <TouchableNativeFeedback onPress={() => this.openDate(item)}>
                                    <View style={[MCV.swiperEventContainer]}>
                                        <View style={MCV.swiperContent}>
                                            <View style={MCV.swiperEventFirstRow}><Text
                                                style={MCV.dateTitle}>{item.title}</Text>
                                                <Text
                                                    style={MCV.dateDistance}>{item.distance / 1000 + 'km'}</Text></View>
                                            <Text style={MCV.dateSite}>数量:{item.num}</Text>
                                            <Text
                                                style={MCV.dateSite}>费用:{item.cost + '/' + costUnit[item.unit]} </Text>
                                            <Text style={MCV.dateSite}>押金:{item.guarantee}</Text>
                                            <Text style={MCV.dateSite}>地点:{item.address}</Text>
                                        </View>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        )
                    }
                })}
            </Swiper>
        )
    }

    _baiduMapGeoSearch(longitude, latitude) {
        fetch(global.baiduGeoLocationSearchUrl + '&location=' + latitude + ',' + longitude, {
            method: 'GET'
        })
            .then((response) => response._bodyText)
            .then((responseJson) => {
                var returnVal = JSON.parse(responseJson);
                if (returnVal.status == 0) {
                    var result = returnVal.result;
                    this.setState({region: result.cityCode})
                    this._setMarkAndLocation(result.location.lng, result.location.lat, result.formatted_address, result.sematic_description);
                }
            })
    }

    separator = () => {
        return (<View style={MCV.separator}></View>);
    }
    onKeyExtractor = (item, index) => item.uid
    onRenderItem = ({item}) => {
        return (
            <TouchableOpacity onPress={() => {
                this._onPressLocationItem(item)
            }}>
                <View style={MCV.locationSearchItem}>
                    <Text style={{fontSize: 16, marginLeft: 10}}>{item.name}</Text>
                    <Text style={{fontSize: 10, marginLeft: 10}}>{item.address}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    _onClickSearch = () => {
        this.setState({modalVisiable: true, data: []})
    }
    _searchLocation = () => {
        if (this.state.query != '') {
            fetch(global.baiduPlaceSearchUrl + '&query=' + this.state.query + '&region=' + this.state.region)
                .then((response) => response._bodyText)
                .then((responseJson) => {
                    var results = JSON.parse(responseJson).results;
                    this.setState({data: results});
                })
        }
    }
    _setMarkAndLocation = (longitude, latitude, address, name) => {
        var _this = this;
        let eventType = _this.state.eventType;
        let eventCriteria = this.state.eventCriteria;
        eventCriteria.location = {
            longitude: longitude,
            latitude: latitude
        }
        fetch((eventType == 'activity' ? global.activityModuleUrl : global.equipmentModuleUrl) + 'search/around', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(eventCriteria)
        }).then(response => response.json())
            .then(responseJson => {
                let markers = [{
                    longitude: longitude,
                    latitude: latitude,
                    title: '我'
                }];
                for (let k in responseJson.content) {
                    markers.push({
                        longitude: parseFloat(responseJson.content[k].location.longitude),
                        latitude: parseFloat(responseJson.content[k].location.latitude),
                        title: responseJson.content[k].title,
                        event: responseJson.content[k]
                    })
                }
                _this.setState(previous => {
                    previous.eventCriteria = eventCriteria;
                    previous.eventData = responseJson.content;
                    previous.markers = markers;
                    previous.showSwiper = responseJson.content.length > 0 ? true : false;
                    previous.location = {
                        longitude: longitude,
                        latitude: latitude,
                        address: address,
                        name: name
                    }
                    return previous;
                });
            })

    }
    _onMarkerClick = (marker) => {
        let title = marker.title;
        let events = this.state.eventData.concat();
        if (title != undefined && this.swiper != undefined) {
            let index;
            events.forEach((e, i) => {
                if (e.title == title) {
                    index = i;
                }
            })
            if (index != undefined) {
                this.swiper.scrollBy(index-this.currentIndex, true);
                this.currentIndex=index;
            }
        }

    }
    _onPressLocationItem = (item) => {
        this._setMarkAndLocation(item.location.lng, item.location.lat, item.address, item.name);
        this.setState({modalVisiable: false});
    }
}
