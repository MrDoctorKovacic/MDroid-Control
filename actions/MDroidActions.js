import React from 'react';
import {
  ToastAndroid
} from 'react-native';

// Sends a GET request to check availability of host
export const PingHost = async (componentHandler) => {
    try {
        return fetch("http://"+global.SERVER_HOST+"/")
        .then(function(response) {
            return response;
        })
        .then(function(sessionObject) {
            console.log(sessionObject);
            if (!componentHandler.state.isConnected) {
                componentHandler.setState({
                    isConnected: true
                });
            }
        }).catch((error) => {
            console.log(error);
            if (componentHandler.state.isConnected) {
                componentHandler.setState({
                    isConnected: false
                });
            }
            componentHandler.setState({
                fails: this.state.fails + 1
            });
            if(componentHandler.state.fails > 4) {
                ToastAndroid.show("Disconnected", ToastAndroid.SHORT);
            }
        });
    }
    catch (error) {
        if (componentHandler.state.isConnected) {
            componentHandler.setState({
                isConnected: false
            });
        }
        console.log(error);
        ToastAndroid.show("Disconnected", ToastAndroid.SHORT);
    }
}

// Sends a GET request to fetch control data
export const SendCommand = async (command) => {
    try {
        return fetch("http://"+global.SERVER_HOST+"/"+command)
        .then(function(response) {
            return response.json();
        })
        .then(function(sessionObject) {
            console.log(sessionObject);
        }).catch((error) => {
            console.log(error);
            ToastAndroid.show("Failed to send command.", ToastAndroid.SHORT);
        });
    }
    catch (error) {
        console.log(error);
        ToastAndroid.show("Failed to send command.", ToastAndroid.SHORT);
    }
}

export const UpdateSetting = async (component, setting, value) => {
    console.log("Setting "+setting+" of "+component+" to "+value);
    try {
        return fetch("http://"+global.SERVER_HOST+"/settings/"+component+"/"+setting+"/"+value, { method: 'POST' })
        .then(function(response) {
            return response;
        })
        .then(function(sessionObject) {
            console.log(sessionObject);
            return sessionObject.status.toString();
        }).catch((error) => {
            console.log(error);
            ToastAndroid.show("Failed to update setting.", ToastAndroid.SHORT);
        });
    }
    catch (error) {
        console.log(error);
        ToastAndroid.show("Failed to update setting.", ToastAndroid.SHORT);
    }
}