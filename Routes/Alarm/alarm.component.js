
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './alarm.styles'


export default class Alarm extends React.Component {



    constructor(props) {
        super(props);
        this.state = {

        }

    }





    render() {
        return (
            <View style={styles.container}>
                <Text>Hello Alarm</Text>
            </View>
        );
    }

}