import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Playlists from '../Playlists/playlists.component'
import Alarm from '../Alarm/alarm.component'
import Sync from '../Sync/sync.component'


const TabNavigator = createBottomTabNavigator({
    Playlists,
    Alarm,
    Sync
}, {
        tabBarOptions: {
            showIcon: false,
            labelStyle: {
                fontSize: 20,
                fontWeight: 'bold'
            },
            style: {
                alignItems: 'center'
            }
        }
    });

export default MainTabNavigator = createAppContainer(TabNavigator);