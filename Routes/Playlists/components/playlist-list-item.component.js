
import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { styles } from './playlist-list-item.styles'


export default class PlaylistListItem extends React.Component {



    constructor(props) {
        super(props);

    }

    onPress = () => {
        console.log('Pressed');
        this.props.onPressItem(this.props.playlist.id);
        console.log('TCL: PlaylistListItem -> onPress -> this.props', this.props);

    };

    getImage(images) {
        return images[0] ? images[0].url : ''
    }



    render() {
        return (
            <TouchableOpacity style={{ ...styles.container, opacity: this.props.selected ? 0.5 : 1 }} onPress={this.onPress}>
                <View style={styles.imageWrapper}>
                    <Image
                        style={{ width: 100, height: 100 }}
                        source={{ uri: this.getImage(this.props.playlist.images) }}
                    />
                </View>
                <View style={styles.infoWrapper}>
                    <View>
                        <Text style={styles.playlistName}>{this.props.playlist.name}</Text>
                    </View>
                    <View>
                        <Text style={styles.songCount}>{this.props.playlist.tracks.total} song{this.props.playlist.tracks.total === 1 ? '' : 's'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

}