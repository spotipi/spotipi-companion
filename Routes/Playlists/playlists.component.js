
import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { styles } from './playlists.styles'
import Spotify from 'rn-spotify-sdk';
import PlaylistListItem from './components/playlist-list-item.component';


export default class Playlists extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            playlists: [],
            selected: new Map()
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

        this.getPlaylists()

    }

    _playlistSelected = (id) => {
        this.setState((state) => {
            //create new Map object, maintaining state immutability
            const selected = new Map(state.selected);
            //remove key if selected, add key if not selected
            this.state.selected.has(id) ? selected.delete(id, !selected.get(id)) : selected.set(id, !selected.get(id));
            return { selected }
        })
    };

    _renderItem = ({ item }) => (
        <PlaylistListItem playlist={item} selected={!!this.state.selected.get(item.id)} onPressItem={this._playlistSelected}
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