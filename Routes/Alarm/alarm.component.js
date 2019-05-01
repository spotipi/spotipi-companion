
import React from 'react';
import { Text, View, Button, TimePickerAndroid } from 'react-native';
import { styles } from './alarm.styles'


export default class Alarm extends React.Component {



    constructor(props) {
        super(props);
        this.state = {

        }

    }


    async openTimePicker() {
        try {
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: 14,
                minute: 0,
                is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                // Selected hour (0-23), minute (0-59)
                console.log('SELECTED: ', hour, minute);
            }
        } catch ({ code, message }) {
            console.warn('Cannot open time picker', message);
        }
    }




    render() {
        return (
            <View style={styles.container}>
                <Button title="Set Alarm" onPress={() => this.openTimePicker()}></Button>
            </View>
        );
    }

}