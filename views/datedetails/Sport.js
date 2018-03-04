import React, { Component } from 'react';
import { View, Image, Text, TextInput, ScrollView, CheckBox, DatePickerAndroid, TouchableOpacity, Picker } from 'react-native';
import MCV from '../../MCV';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import CommonString from '../../resource/CommonString';
import DateTimePicker from 'react-native-modal-datetime-picker';
export default class Sport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hourPickerItems: [],
            isDateTimePickerVisible: false,
            dateInfo: {
                title: '',
                startTime: new Date(),
                location: '',
                cost: '',
                needBringEquipment: false,
                numOfPeople: '',
                description: ''
            }
        }
    }
    componentDidMount() {
        var hourPickerItems = [];
        for (let i = 0; i <= 23; i++) {
            let display = i.toString();
            hourPickerItems.push((<Picker.Item key={i} label={display} value={display} />))
        }
        this.setState({
            hourPickerItems: hourPickerItems
        })
    }
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.item.title,
        headerStyle: MCV.headerStyle,
        headerRight: (<View></View>),
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
        tabBarLabel: navigation.state.params.item.tabName
    })
    handleClick = () => {
        this.setState((state) => {
            let info = state.dateInfo;
            info.needBringEquipment = info.needBringEquipment ? false : true;
            return {
                dateInfo: info
            }
        })
    }
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        let info = this.state.dateInfo;
        info.startTime = date;
        this.setState({
            dateInfo: info
        })
        this._hideDateTimePicker();
    };
    render() {
        let { params } = this.props.navigation.state;
        let item = params.item;
        return (
            <View style={MCV.dateDetailContainer}>
                <View>
                    {item.isFA ? <IconFA size={item.size} name={item.icon}></IconFA> : (item.isLocal ? <Image style={[MCV.iconStyle, { marginVertical: 5 }]} source={item.source}></Image> : <Icon size={item.size} name={item.icon}></Icon>)}
                </View>
                <View style={MCV.dateDetailView}>
                    <ScrollView>
                        <View style={MCV.sportInputView}>
                            <View style={MCV.labelStyle}><Text>{CommonString.title + CommonString.semicolon}</Text></View>
                            <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle} underlineColorAndroid='#bdbdbd'></TextInput></View>
                        </View>
                        <View style={MCV.sportInputView}>
                            <View style={MCV.labelStyle}><Text>{CommonString.startTime + CommonString.semicolon}</Text></View>
                            <View style={MCV.textInputView}>
                                <TouchableOpacity onPress={() => this._showDateTimePicker()}>
                                    <TextInput style={MCV.dateTextStyle} editable={false} underlineColorAndroid='#bdbdbd'>{this.state.dateInfo.startTime.toLocaleString()}</TextInput>
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
                        <View style={MCV.sportInputView}>
                            <View style={MCV.labelStyle}><Text>{CommonString.location + CommonString.semicolon}</Text></View>
                            <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle} underlineColorAndroid='#bdbdbd'></TextInput></View>
                        </View>
                        <View style={MCV.sportInputView}>
                            <View style={MCV.labelStyle}><Text>{CommonString.cost + CommonString.semicolon}</Text></View>
                            <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle} underlineColorAndroid='#bdbdbd'></TextInput></View>
                        </View>
                        <View style={MCV.sportInputView}>
                            <View style={MCV.labelStyle}><Text>{CommonString.numOfPeople + CommonString.semicolon}</Text></View>
                            <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle} keyboardType='numeric' underlineColorAndroid='#bdbdbd'></TextInput></View>
                        </View>
                        <View style={MCV.sportInputView}>
                            <View style={MCV.labelStyle}><Text>{CommonString.needBringEquipment + CommonString.semicolon}</Text></View>
                            <View style={MCV.textInputView}><CheckBox style={{ alignSelf: 'flex-end' }} onValueChange={this.handleClick} value={this.state.dateInfo.needBringEquipment}></CheckBox></View>
                        </View>
                        <View style={[MCV.sportInputView, { flexDirection: 'column', alignItems: 'flex-start', paddingHorizontal: 10, paddingVertical: 10 }]}>
                            <View style={MCV.labelStyle}><Text>{CommonString.description + CommonString.semicolon}</Text></View>
                            <View style={MCV.textAreaView}><TextInput style={MCV.textArea} multiline={true} placeholder={CommonString.descriptionPlaceHolder} underlineColorAndroid='transparent'></TextInput></View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}