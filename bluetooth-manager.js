import { BleManager } from 'react-native-ble-plx';

export const BluetoothManager = new BleManager();


export function scanAndConnect(deviceName) {
    BluetoothManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            alert(error)
            // Handle error (scanning will be stopped automatically)
            return
        }

        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        alert(device)
        if (device.name === deviceName) {

            // Stop scanning as it's not necessary if you are scanning for one device.
            BluetoothManager.stopDeviceScan();

            // Proceed with connection.
        }
    });
}