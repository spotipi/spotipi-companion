import {
    NativeEventEmitter, // for emitting events for the BLE manager
    NativeModules, // for getting an instance of the BLE manager module
} from 'react-native';

import BleManager from 'react-native-ble-manager'; // for talking to BLE peripherals
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule); // create an event emitter for the BLE Manager module


export const Bluetooth = {
    manager: BleManager,
    module: BleManagerModule,
    emitter: bleManagerEmitter
}