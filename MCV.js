import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import colors from './Colors';
let totalHeight = Dimensions.get('window').height;
let totalWidth = Dimensions.get('window').width;
let MCV = StyleSheet.create({
    headerStyle: {
        backgroundColor: colors.MaterialRed,
        height: totalHeight / 13
    },
    headerTitleStyle: {
        alignSelf: 'center'
    },
    tabStyle: {
        height: totalHeight / 13,
        backgroundColor: 'white',
        borderColor: 'black'
    },
    userHeaderStyle: {
        backgroundColor: colors.MaterialRed,
        height: totalHeight / 4,
        elevation: 0
    },
    userTabStyle: {
        backgroundColor: colors.MaterialRed
    },
    userTabLabelStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
    },
    tabLabelStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black'
    },
    mainPageContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: 'white'
    },
    touchBox: {
        width: totalWidth / 3 - 0.33334,
        height: totalWidth / 3,
        backgroundColor: '#fff'
    },
    boxContainer: {
        width: totalWidth / 3,
        height: totalWidth / 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconStyle: {
        width: 50,
        height: 50
    },
    dateListContainer: {
        flex: 1,
        width: totalWidth
    },
    dateContainer: {
        flex: 1,
        height: 100,
        backgroundColor: '#fff',
        justifyContent: 'space-around'
    },
    dateFirstRow: {
        marginHorizontal: 12,
        flexDirection: 'row',
        width: totalWidth - 24,
        justifyContent: 'space-between'
    },
    dateTitle: {
        fontSize: totalWidth / 20,
        flex: 1,
        fontWeight: 'bold',
    },
    dateDistance: {
        width: totalWidth / 6,
        textAlign: 'center',
        fontSize: totalWidth / 30
    },
    dateTime: {
        fontSize: totalWidth / 30,
        marginHorizontal: 12
    },
    dateSite: {
        fontSize: totalWidth / 30,
        marginHorizontal: 12
    },
    separator: {
        width: totalWidth,
        height: 1,
        backgroundColor: '#e0e0e0'
    },
    dateDetailContainer: {
        flex: 1,
        width: totalWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dateDetailView: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: totalWidth - 40,
        height: totalHeight - 50 - 20 - (totalHeight * 2) / 13 - 50,
        elevation: 25,
        backgroundColor: 'white',
        alignItems: 'flex-end'
    },
    sportInputView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        width: totalWidth - 40 - 40,
        alignItems: 'center'
    },
    textInputView: {
        // justifyContent:'flex-end',
        width: (totalWidth - 40) * 0.6
    },
    textInputStyle: {
        height: 40,
        textAlign: 'right'
    },
    dateTextStyle: {
        height: 40,
        flex: 1,
        textAlign: 'center'
    },
    labelStyle: {
        width: 80
    },
    textAreaView: {
        width: totalWidth - 40 - 40 - 20,
        height: 150,
        borderWidth: 1,
        marginVertical: 10,
        borderRadius: 5,
        borderColor: '#bdbdbd'
    },
    textArea: {
        marginTop: 0,
        // height:150,
        width: totalWidth - 40 - 40 - 20,
    }
})
export { MCV as default }