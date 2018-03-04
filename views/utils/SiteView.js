import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    MapView, 
    MapTypes, 
    Geolocation 
} from 'react-native-baidu-map';
export default class SiteView extends Component {
    static navigationOptions = {
        title: '位置'
    }
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <MapView style={{width:400,height:400}}/>
        )
    }
}
