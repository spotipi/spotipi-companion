
import React from 'react';
import { View, FlatList } from 'react-native';
import { styles } from './playlists.styles'
import Spotify from 'rn-spotify-sdk';
import PlaylistListItem from './components/playlist-list-item.component';
import { Bluetooth } from '../../bluetooth-manager'

import base64 from 'react-native-base64'


export default class Playlists extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playlists: [],
            selected: new Map(),
            is_scanning: false, // whether the app is currently scanning for peripherals or not
            peripherals: [], // the peripherals detected
            connected_peripheral: null,
        }



    }

    async getSelf() {
        try {
            const me = await Spotify.getMe();
            console.log('TCL: Home -> componentDidMount -> me', me);
        } catch (e) {
            this.handleSpotifyError(e)
        }
    }

    async  getPlaylists() {
        try {
            const response = await Spotify.sendRequest('v1/me/playlists', 'GET', {}, true)
            const playlists = response.items
            this.setState({ playlists })
            console.log('TCL: Home -> getPlaylists -> playlists', this.state.playlists);

        } catch (e) {
            this.handleSpotifyError(e)
        }

    }

    handleSpotifyError(e) {
        if (/access token expired/ig.test(e.message)) {
            Spotify.logout();
            this.props.navigation.popToTop()
        } else {
            console.log('Error: ', e);
        }
    }

    componentWillMount() {
        this.subToBluetoothState();
    }

    subToBluetoothState() {
        const subscription = Bluetooth.manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                this.scanAndConnect();
                subscription.remove();
            }
        }, true);
    }

    scanAndConnect() {
        Bluetooth.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                // Handle error (scanning will be stopped automatically)
                return
            }
            if (device.name === 'SpotiPiApp' || device.name === 'raspberrypi') {
                Bluetooth.manager.stopDeviceScan();
                device.connect().then((device) => {
                    console.log('Connected');
                    return device.discoverAllServicesAndCharacteristics()
                }).then((device) => {
                    this.setState({ connected_peripheral: device })
                }).catch(e => {
                    console.log('TCL: Playlists -> scanAndConnect -> e', e)
                })
            }
        });
    }


    async componentDidMount() {
        this.getPlaylists();
    }

    _playlistSelected = (id) => {
        this.setState((state) => {
            //create new Map object, maintaining state immutability
            const selected = new Map(state.selected);
            //remove key if selected, add key if not selected
            this.state.selected.has(id) ? selected.delete(id, !selected.get(id)) : selected.set(id, !selected.get(id));
            return { selected }
        })
        Spotify.sendRequest(`v1/playlists/${id}`, 'GET', {}, true).then(playlist => {
            const tracks = playlist.tracks.items.slice(0, 3).map(trackData => ({ name: trackData.track.name, url: trackData.track.preview_url })).filter((track) => track.url != null && track.url !== 'null')
            const piData = { tracks, alarmTime: { minute: 19, hour: 14 } };
            this.sendPlaylistData(piData)
        })
    };

    _renderItem = ({ item }) => (
        <PlaylistListItem playlist={item} selected={!!this.state.selected.get(item.id)} onPressItem={this._playlistSelected}
        />
    )

    sendPlaylistData(piData) {
        const device = this.state.connected_peripheral;
        const str = JSON.stringify(piData); // convert the object to a string
        const encoded = btoa(str)
        console.log('TCL: sendPlaylistData -> encoded', encoded);
        const BASE_UUID = '-5659-402b-aeb3-d2f7dcd1b999';
        const PERIPHERAL_ID = '0000';
        const PRIMARY_SERVICE_ID = '0100';

        const primary_service_uuid = PERIPHERAL_ID + PRIMARY_SERVICE_ID + BASE_UUID;
        const ps_characteristic_uuid = PERIPHERAL_ID + '0300' + BASE_UUID; // the characteristic ID to write on

        return device.writeCharacteristicWithResponseForService(primary_service_uuid, ps_characteristic_uuid, encoded, '1')
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.playlists}
                    extraData={this.state}
                    keyExtractor={item => item.id}
                    renderItem={this._renderItem}
                />
            </View>
        );
    }

}