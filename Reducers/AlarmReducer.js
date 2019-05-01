import { combineReducers } from 'redux';
import { ALARM_ACTIONS } from '../Actions/AlarmActions';
const INITIAL_STATE = {
    playlist: {
        id: '',
        name: '',
        tracks: []
    },
    alarmTime: {
        hour: 0,
        minute: 0
    }
};

const alarmReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ALARM_ACTIONS.SET_PLAYLIST:
            const { alarmTime } = state
            const newPlaylist = action.payload
            return { playlist: newPlaylist, alarmTime }
        case ALARM_ACTIONS.SET_ALARM_TIME:
            const { playlist } = state;
            const newAlarmTime = action.payload;
            return { alarmTime: newAlarmTime, playlist };
        default:
            return state
    }
};

export default combineReducers({
    alarm: alarmReducer,
});