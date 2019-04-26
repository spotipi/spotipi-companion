/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Linking } from 'react-native';
import { spotifyCredentials } from './secret';

const scopesArr = ['user-modify-playback-state','user-read-currently-playing','user-read-playback-state','user-library-modify',
                   'user-library-read','playlist-read-private','playlist-read-collaborative','playlist-modify-public',
                   'playlist-modify-private','user-read-recently-played','user-top-read'];
const scopes = scopesArr.join(' ');

const authURL = 'https://accounts.spotify.com/authorize?response_type=code&client_id='
  + spotifyCredentials.clientId + (scopes ? '&scope=' + encodeURIComponent(scopes) : '')
  + '&redirect_uri=' + encodeURIComponent(spotifyCredentials.redirectUri);

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>SpotiPi Companion App</Text>
        <Button title="Login to Spotify" onPress={() => Linking.openURL(authURL)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
