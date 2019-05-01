/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, PermissionsAndroid, Button } from 'react-native';
import { Bluetooth } from './bluetooth-manager'
import { stringToBytes } from 'convert-string'; // for converting string to byte array
import bytesCounter from 'bytes-counter'; // for getting the number of bytes in a string


const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});


export default class App extends Component {
    constructor() {
        super();
        this.state = {
            is_scanning: false, // whether the app is currently scanning for peripherals or not
            peripherals: null, // the peripherals detected
            connected_peripheral: null, // the currently connected peripheral
        }

        this.peripherals = []; // temporary storage for the detected peripherals

        this.startScan = this.startScan.bind(this); // function for scanning for peripherals
        // this.openBox = this.openBox.bind(this);
    }

    componentWillMount() {
        Bluetooth.manager.enableBluetooth()
            .then(() => {
                console.log('Bluetooth is already enabled');
            })
            .catch((error) => {
                console.log('TCL: App -> componentWillMount -> error', error);
            });

        // initialize the BLE module
        Bluetooth.manager.start({ showAlert: false })
            .then(() => {
                console.log('Module initialized');
            });

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (!result) {
                    PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (!result) {
                            alert('You need to give access to coarse location to use this app.');
                        }
                    });
                }
            });
        }

    }

    componentDidMount() {
        Bluetooth.emitter.addListener('BleManagerDiscoverPeripheral', (peripheral) => {
            console.log('TCL: App -> componentDidMount -> peripheral', peripheral);

            var peripherals = this.peripherals; // get the peripherals
            // check if the peripheral already exists 
            var el = peripherals.filter((el) => {
                return el.id === peripheral.id;
            });

            if (!el.length) {
                peripherals.push({
                    id: peripheral.id, // mac address of the peripheral
                    name: peripheral.name // descriptive name given to the peripheral
                });
                this.peripherals = peripherals; // update the array of peripherals
            }
        });
        Bluetooth.emitter.addListener(
            'BleManagerStopScan',
            () => {
                console.log('scan stopped');
                if (this.peripherals.length == 0) {
                    console.log('Nothing found');
                }
                this.setState({
                    is_scanning: false,
                    peripherals: this.peripherals
                });
            }
        );
    }

    startScan() {
        this.peripherals = [];
        this.setState({
            is_scanning: true
        });

        Bluetooth.manager.scan([], 2)
            .then(() => {
                console.log('scan started');
            });

    }

    connect(peripheral_id) {
        Bluetooth.manager.connect(peripheral_id)
            .then(() => {
                console.log('Connected');
                this.setState({
                    connected_peripheral: peripheral_id
                });

                // retrieve the services advertised by this peripheral
                Bluetooth.manager.retrieveServices(peripheral_id)
                    .then((peripheralInfo) => {
                        console.log('Peripheral info:', peripheralInfo);
                    }
                    ).catch(e => {
                        console.log('TCL: App -> connect -> e', e);
                    });

            })
            .catch((error) => {
                console.log('TCL: App -> connect -> error', error);

            });

    }


    sendData() {


        let str = JSON.stringify({ hello: 'world' }); // convert the object to a string
        let bytes = bytesCounter.count(str); // count the number of bytes
        let data = stringToBytes(str); // convert the string to a byte array

        // construct the UUIDs the same way it was constructed in the server component earlier
        const BASE_UUID = '-5659-402b-aeb3-d2f7dcd1b999';
        const PERIPHERAL_ID = '0000';
        const PRIMARY_SERVICE_ID = '0100';

        let primary_service_uuid = PERIPHERAL_ID + PRIMARY_SERVICE_ID + BASE_UUID; // the service UUID
        let ps_characteristic_uuid = PERIPHERAL_ID + '0300' + BASE_UUID; // the characteristic ID to write on

        // write the attendees info to the characteristic
        Bluetooth.manager.write(this.state.connected_peripheral, primary_service_uuid, ps_characteristic_uuid, data, bytes)
            .then(() => {

                console.log('DATA SENT');
                // disconnect to the peripheral
                // Bluetooth.manager.disconnect(this.state.connected_peripheral)
                //   .then(() => {
                //     console.log('Disconnected');
                //   })
                //   .catch((error) => {
                //     console.log('TCL: App -> sendData -> error', error);

                //   });

            })
            .catch((error) => {
                console.log('TCL: App -> sendData -> error', error);
            });
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                <Text style={styles.instructions}>To get started, edit App.js</Text>
                <Text style={styles.instructions}>{instructions}</Text>
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
