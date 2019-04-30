import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Playlists from '../Playlists/playlists.component'
import Alarm from '../Alarm/alarm.component'

const TabNavigator = createBottomTabNavigator({
    Playlists,
    Alarm
});

export default MainTabNavigator = createAppContainer(TabNavigator);