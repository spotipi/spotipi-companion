import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

    imageWrapper: {
        marginRight: 20
    },

    infoWrapper: {
        flexDirection: 'column'
    },
    playlistName: {
        fontSize: 16,
        marginBottom: 10
    },
    songCount: {
        fontSize: 14
    }
});
