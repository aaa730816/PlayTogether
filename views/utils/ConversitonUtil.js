import JPushModule from 'jpush-react-native';
import {AsyncStorage, DeviceEventEmitter, AppState} from 'react-native';

var eventType = {
    'activity': '活动',
    'equipment': '器材'
}
export default class ConversitonUtil {
    static openWsServer = (events) => {
        for (let i in events) {
            var socket = new WebSocket((events[i].type == 'activity' ? global.activityWsServer : global.equipmentWsServer) + events[i].id+'/'+global.deviceId);
            socket.onmessage = function (evt) {
                let msg = JSON.parse(evt.data);
                ConversitonUtil._incrementUnread(events[i].id, events[i].type);
                DeviceEventEmitter.emit('FreshUnread');
                DeviceEventEmitter.emit('ReceiveMessage', events[i], msg);
            }
            global.sockets[events[i].id + events[i].type] = socket;
        }
    }

    static saveEvents = (events) => {
        var _this = this;
        global.events = global.events.concat(events);
        AsyncStorage.setItem('events', JSON.stringify(global.events), function () {
            ConversitonUtil.openWsServer(events);
            DeviceEventEmitter.emit('ReceiveEvent', events);
        })
    }

    static quitConversition = (id, type) => {
        var events = global.events.concat();
        var temp = (events.filter(e => e.id == id && e.type == type))[0];
        var event = ConversitonUtil.copyObject(temp);
        var index = events.indexOf(temp);
        if (index != -1) {
            events.splice(index, 1);
            global.events = events;
            global.sockets[id + type].close();
            delete global.sockets[id + type];
            AsyncStorage.setItem('events', JSON.stringify(global.events));
            DeviceEventEmitter.emit('FreshUnread');
        }

    }

    static _incrementUnread = (id, type) => {
        var events = global.events.concat();
        var temp = (events.filter(e => e.id == id && e.type == type))[0];
        var event = ConversitonUtil.copyObject(temp);
        var index = events.indexOf(temp);
        if (index != -1) {
            events.splice(index, 1);
            event.unread = event.unread + 1;
            events.splice(index, 0, event);
            global.events = events;
            AsyncStorage.setItem('events', JSON.stringify(global.events));
        }
    }

    static _clearUnread = (id, type) => {
        var events = global.events.concat();
        var temp = (events.filter(e => e.id == id && e.type == type))[0];
        var event = ConversitonUtil.copyObject(temp);
        var index = events.indexOf(temp);
        if (index != -1) {
            events.splice(index, 1);
            event.unread = 0;
            events.splice(index, 0, event);
            global.events = events;
            AsyncStorage.setItem('events', JSON.stringify(global.events));
        }
    }

    static copyObject = (old) => {
        var newObj = {};
        if (old instanceof Array) {
            newObj = [];
        }
        for (let key in old) {
            let val = old[key];
            newObj[key] = typeof val === 'object' ? this.copyObject(val) : val;
        }
        return newObj;
    }

}