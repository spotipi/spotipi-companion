
import React from 'react';
import { Text, View, Button } from 'react-native';
import { styles } from './login.styles'
import Spotify from 'rn-spotify-sdk';


export default class Login extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            spotifyInitialized: false
        };
        this.loginToSpotify = this.loginToSpotify.bind(this);
    }

    navToPlaylists() {
        this.props.navigation.navigate('Playlists')
    }

    async initializeIfNeeded() {
        // initialize Spotify if it hasn't been initialized yet
        if (!await Spotify.isInitializedAsync()) {
            // initialize spotify
            const spotifyOptions = {
                "clientID": "e2e89f3caaf14eb6ad4a91beefb9b41d",
                "sessionUserDefaultsKey": "SpotiPiSession",
                "redirectURL": "spotipi-companion://auth",
                "scopes": ["user-read-private", "playlist-read", "playlist-read-private", "streaming"],
            };
            const loggedIn = await Spotify.initialize(spotifyOptions);
            // update UI state
            this.setState({
                spotifyInitialized: true
            });
            if (loggedIn) {
                this.navToPlaylists()
            }

        }
        else {
            // update UI state
            this.setState({
                spotifyInitialized: true
            });
            // handle logged in
            if (await Spotify.isLoggedInAsync()) {
                this.navToPlaylists()
            }
        }
    }

    componentDidMount() {
        this.initializeIfNeeded().catch((error) => {
            alert("Error", error.message);
        });
    }
    loginToSpotify() {
        Spotify.login().then((loggedIn) => {
            if (loggedIn) {
                this.navToPlaylists()
            }
            else {
                // cancelled
                console.log('Problem logging in');
            }
        }).catch((error) => {
            console.log('TCL: Login -> loginToSpotify -> error', error);
            // error
            alert("Error", error.message);
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to the SpotiPi Companion!</Text>
                <View>
                    <Button title="Login to Spotify" onPress={this.loginToSpotify}></Button>
                </View>
            </View>
        );
    }

}