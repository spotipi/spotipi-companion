
import React from 'react';
import { View, Button } from 'react-native';
import { styles } from './sync.styles'


export default class Sync extends React.Component {



    constructor(props) {
        super(props);
        this.state = {

        }

    }







    render() {
        return (
            <View style={styles.container}>
                <Button title="Sync with SpotiPi"></Button>
            </View>
        );
    }

}