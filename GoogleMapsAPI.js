import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class GoogleMapsAPI {
  static async locationPermission() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }
  }

  static getPosition() {
    return new Promise((resolve, reject) => {
      Permissions.askAsync(Permissions.LOCATION)
        .then(status => {
          const { granted } = status;
          if (granted === true) {
            Location.getCurrentPositionAsync().then(location => {
              const {
                coords: { latitude, longitude },
              } = location;
              resolve({ latitude, longitude });
            });
          } else {
            reject(status);
          }
        })
        .catch(reject);
    });
  }
}
