export const ALARM_ACTIONS = {
    SET_PLAYLIST: 'SET_PLAYLIST',
    SET_ALARM_TIME: 'SET_ALARM_TIME'
}

export const setPlaylist = playlist => (
    {
        type: ALARM_ACTIONS.SET_PLAYLIST,
        payload: playlist,
    }
);

export const setAlarmTime = alarmTime => (
    {
        type: ALARM_ACTIONS.SET_ALARM_TIME,
        payload: alarmTime,
    }
);