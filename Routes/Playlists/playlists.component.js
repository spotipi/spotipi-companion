
import React from 'react';
import { View, FlatList, ToastAndroid } from 'react-native';
import { styles } from './playlists.styles'
import Spotify from 'rn-spotify-sdk';
import PlaylistListItem from './components/playlist-list-item.component';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPlaylist } from '../../Actions/AlarmActions';

class Playlists extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playlists: [],
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



    async componentDidMount() {
        this.getPlaylists();
    }

    _playlistSelected = (id) => {
        ToastAndroid.show('Loading playlist tracks...', ToastAndroid.SHORT);
        Spotify.sendRequest(`v1/playlists/${id}`, 'GET', {}, true).then(playlist => {
            const tracks = playlist.tracks.items.slice(0, 3).map(trackData => ({ name: trackData.track.name, url: trackData.track.preview_url })).filter((track) => track.url != null && track.url !== 'null')
            const playlistData = { id, tracks, name: playlist.name };
            this.props.setPlaylist(playlistData)
            ToastAndroid.show(`${playlist.name} is set to play!`, ToastAndroid.SHORT);
            console.log('TCL: Playlists -> _playlistSelected -> this.props', this.props.alarm);
        }).catch(e => {
            ToastAndroid.show('Could not load playlist.', ToastAndroid.SHORT);
        })
    };

    _renderItem = ({ item }) => (
        <PlaylistListItem playlist={item} selected={this.props.alarm.playlist.id === item.id} onPressItem={this._playlistSelected}
        />
    )



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

const mapStateToProps = (state) => {
    const { alarm } = state
    return { alarm }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setPlaylist,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Playlists);