
import React from 'react';
import { Text, View, Button, TimePickerAndroid } from 'react-native';
import { styles } from './alarm.styles'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setAlarmTime } from '../../Actions/AlarmActions';

class Alarm extends React.Component {



    constructor(props) {
        super(props);
        this.state = {

        }

    }


    async openTimePicker() {
        try {
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: this.props.alarm.alarmTime.hour,
                minute: this.props.alarm.alarmTime.minute,
                is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                // Selected hour (0-23), minute (0-59)
                const alarmTimeData = { hour, minute };
                this.props.setAlarmTime(alarmTimeData);
                console.log('TCL: Playlists -> _playlistSelected -> this.props', this.props.alarm);
            }
        } catch ({ code, message }) {
            console.warn('Cannot open time picker', message);
        }
    }




    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Current Alarm</Text>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 25 }}>{getAlarmText(this.props.alarm.alarmTime)}</Text>
                </View>
                <Button title="Set Alarm" onPress={() => this.openTimePicker()}></Button>
            </View>
        );
    }



}

const mapStateToProps = (state) => {
    const { alarm } = state
    return { alarm }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setAlarmTime,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Alarm);

export function getAlarmText(alarmTime) {
    let AM_PM = 'AM'
    let hour = alarmTime.hour;
    let minute = alarmTime.minute;

    if (hour >= 12) {
        hour = hour === 12 ? hour : hour - 12
        AM_PM = 'PM'
    } else if (hour === 0) {
        hour = 12
    }
    if (minute < 10) {
        minute = `0${minute}`
    }
    return `${hour}:${minute} ${AM_PM}`
}