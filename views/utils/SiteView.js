import React, {Component} from 'react';
import {
    View, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList, Text, StatusBar, Alert,
    Picker
} from 'react-native';
import {
    MapView,
    MapTypes
} from 'react-native-baidu-map';
import IconFA from 'react-native-vector-icons/FontAwesome';
import MCV from '../../MCV';
import CityMap from './CityMap';
import CityCodes from './CityCodes';

var Geolocation = require('Geolocation');

export default class SiteView extends Component {
    static navigationOptions = ({navigation}) => ({
        title: '位置',
        headerRight: (
            <TouchableOpacity onPress={() => navigation.state.params.selectGeo()}>
                <Text style={{color: 'white', paddingRight: 20, fontWeight: 'bold'}}>确定</Text>
            </TouchableOpacity>
        )
    })

    constructor(props) {
        super(props);
        this.state = {
            center: {
                longitude: 121.39903166666659,
                latitude: 31.32143821296778
            },
            mapType: MapTypes.NORMAL,
            zoom: 15,
            markers: [{
                longitude: 121.39903166666659,
                latitude: 31.32143821296778,
                title: '上海市宝山区泮池南路'
            }],
            modalVisiable: false,
            data: [],
            region: '289',
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
        this.props.navigation.setParams({selectGeo: this._selectGeo})
        var location = this.props.navigation.state.params.location;
        if (location.address == '') {
            Geolocation.getCurrentPosition(
                result => {
                    var location = result.coords;
                    this._baiduMapGeoSearch(location.longitude, location.latitude);
                })
        } else {
            this._setMarkAndLocation(parseFloat(location.longitude), parseFloat(location.latitude), location.address, location.name)
        }
    }

    _selectGeo = () => {
        if (this.state.location.address == '') {
            Alert.alert(
                '',
                '必须填写地址',
                [
                    {
                        text: '确认', type: 'cancel'
                    }
                ]
            )
        } else if (this.state.location.name == '') {
            Alert.alert(
                '',
                '请在地图或搜索框内选择位置',
                [
                    {
                        text: '确认', type: 'cancel'
                    }
                ]
            )
        }
        else {
            this.props.navigation.state.params.setLocation(this.state.location);
            this.props.navigation.pop()
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
                <MapView style={MCV.mapViewStyle} center={this.state.center}
                         markers={this.state.markers} zoom={this.state.zoom} mapType={this.state.mapType}
                         onMapClick={e => this._mapClick(e)}></MapView>
                <View style={MCV.locationSearchView}>
                    <TouchableOpacity onPress={() => this._onClickSearch()}>
                        {/*<IconFA name='search' size={30}/>*/}
                        <TextInput style={[MCV.locationSearchField, {
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
                    <TextInput style={[MCV.locationSearchField, {
                        borderWidth: this.state.location.address == '' ? 1 : 0,
                        borderColor: this.state.location.address == '' ? 'red' : 'white'
                    }]} value={this.state.location.address}
                               onChangeText={(text) => this.setState((previous) => {
                                   previous.location.address = text;
                                   return previous;
                               })} underlineColorAndroid={'transparent'}/>
                </View>
            </View>
        )
    }

    _mapClick = (e) => {
        this._baiduMapGeoSearch(e.longitude, e.latitude);
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
        this.setState({
            center: {
                longitude: longitude,
                latitude: latitude
            },
            markers: [{
                longitude: longitude,
                latitude: latitude,
                title: address
            }],
            location: {
                longitude: longitude,
                latitude: latitude,
                address: address,
                name: name
            }
        });
    }
    _onPressLocationItem = (item) => {
        this._setMarkAndLocation(item.location.lng, item.location.lat, item.address, item.name);
        this.setState({modalVisiable: false});
    }
}
