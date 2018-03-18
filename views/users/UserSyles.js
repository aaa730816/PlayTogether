import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../Colors';
let totalHeight = Dimensions.get('window').height;
let totalWidth = Dimensions.get('window').width;
let UserStyles = StyleSheet.create({
    userHeaderView: {
        width: totalWidth,
        height: totalHeight / 4,
        backgroundColor: colors.MaterialRed,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userHeaderLogo: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    loginContainer: {
        flex: 1,
        width: totalWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginInputContainer: {
        width: (totalWidth * 2) / 3,
        height:200,
        justifyContent:'space-around'
    },
    userNameView: {
        flexDirection: 'row',
        height: 40,
        borderRadius: 5,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        elevation:0.5
    },
    inputTextStyle: {
        flex: 1,
        height: 40,
        fontSize:12,
        textAlign:'center'
    },
    iconStyle: { 
        padding: 5, 
        backgroundColor: '#e0e0e0',
        width:40,
        height:40,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export { UserStyles as default }