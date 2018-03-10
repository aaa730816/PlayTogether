import React,{Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import * as QQAPI from 'react-native-qq';
import IconFA from 'react-native-vector-icons/FontAwesome';
export default class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            qq:'qq'
        }
    }
    render() {
        return (
            <View>
                <TouchableOpacity onPress={()=>this.qqLogin}>
                <IconFA name='qq' size={30}></IconFA>
                </TouchableOpacity>
                <Text>{this.state.qq}</Text>
            </View>
        )
    }
    qqLogin = () => {
        QQAPI.login().then(function(result) {
            this.setState({
                qq:result
            })
        })
    }
}