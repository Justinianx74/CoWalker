import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

export default class Notifcation {
  static async notificationCheck() {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      throw new Error('Notifcation access not granted');
    }
  }

  static getExponentToken() {
    return new Promise((resolve, reject) => {
      this.notificationCheck()
        .then(() => {
          Notifications.getExpoPushTokenAsync().then(resolve);
        })
        .catch(reject);
    });
  }

  static registerForPushNotification(callback) {
    Notifications.addListener(callback);
  }

  static sendNotification(exponentToken, data) {
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        host: 'exp.host',
        accept: 'application/json',
        'accept-encoding': 'gzip, deflate',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        to: exponentToken,
        title: 'New Match',
        data,
      }),
    });
  }
}
