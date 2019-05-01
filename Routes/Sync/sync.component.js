
import React from 'react';
import { View, Button, Text } from 'react-native';
import { styles } from './sync.styles'
import { connect } from 'react-redux';
import { Bluetooth } from '../../bluetooth-manager'
import { getAlarmText } from '../Alarm/alarm.component';


class Sync extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            is_connecting: true,
            error_connecting: false,
            connected_peripheral: null
        }

    }



    componentWillMount() {
        this.subToBluetoothState()
    }

    componentWillUnmount() {
        Bluetooth.manager.stopDeviceScan();
        Bluetooth.manager.connectedDevices((ids) => {
            ids.forEach(id => {
                Bluetooth.manager.cancelDeviceConnection(id)
            })
        })
    }

    subToBluetoothState() {
        const subscription = Bluetooth.manager.onStateChange((state) => {
            console.log('TCL: Sync -> subToBluetoothState -> state', state);
            if (state === 'PoweredOn') {
                this.scanAndConnect();
                subscription.remove();
            }
        }, true);
    }

    scanAndConnect() {
        return new Promise((resolve, reject) => {
            Bluetooth.manager.startDeviceScan(null, null, (error, device) => {
                this.setState({ is_connecting: true })
                if (error) {
                    reject(error)
                    return
                }
                if (device.name === 'SpotiPiApp' || device.name === 'raspberrypi') {
                    Bluetooth.manager.stopDeviceScan();
                    device.connect().then((device) => {
                        return device.discoverAllServicesAndCharacteristics()
                    }).then((device) => {
                        this.setState({ connected_peripheral: device })
                        this.setState({ is_connecting: false })
                        resolve()
                    }).catch(e => {
                        console.log('TCL: Playlists -> scanAndConnect -> e', e)
                        reject(e)
                    })
                }
            });
        })

    }







    render() {
        let visibleComponent;
        if (this.state.is_connecting) {
            visibleComponent = (<View style={styles.container}>
                <Text style={{ fontSize: 30, fontWeight: "bold" }}>Connecting to SpotiPi...</Text>
            </View>)
        } else {
            visibleComponent = (<View style={styles.container}>
                <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Connected to SpotiPi</Text>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600" }}>Selected Playlist: {this.props.alarm.playlist.name || 'No playlist selected'}</Text>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600" }}>Alarm currently set to: {getAlarmText(this.props.alarm.alarmTime)}</Text>
                </View>
                <Button title="Sync with SpotiPi" onPress={() => this.sendAlarmData(this.props.alarm.alarmTime)}></Button>
            </View>)
        }
        return visibleComponent
    }

    async sendAlarmData() {
        const device = this.state.connected_peripheral;
        if (!device || (device && !await device.isConnected())) {
            try {
                await this.scanAndConnect()
                return this.sendAlarmData()
            } catch (e) {
                console.log('TCL: Sync -> sendAlarmData -> e', e);
            }

        } else {
            const strData = JSON.stringify({ alarmTime: this.props.alarm.alarmTime, tracks: this.props.alarm.playlist.tracks }); // convert the object to a string
            const encoded = btoa(strData)
            const BASE_UUID = '-5659-402b-aeb3-d2f7dcd1b999';
            const PERIPHERAL_ID = '0000';
            const PRIMARY_SERVICE_ID = '0100';

            const primary_service_uuid = PERIPHERAL_ID + PRIMARY_SERVICE_ID + BASE_UUID;
            const ps_characteristic_uuid = PERIPHERAL_ID + '0300' + BASE_UUID; // the characteristic ID to write on

            return device.writeCharacteristicWithResponseForService(primary_service_uuid, ps_characteristic_uuid, encoded, '1')
        }

    }



}

const mapStateToProps = (state) => {
    const { alarm } = state
    return { alarm }
};

export default connect(mapStateToProps)(Sync);