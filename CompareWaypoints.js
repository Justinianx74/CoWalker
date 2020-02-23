/* eslint-disable prettier/prettier */
/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
export default class CompareWaypoints {
  static compareFirst(w1, w2) {
    const lat1 = w1[0].latitude;
    const lon1 = w1[0].longitude;
    const lat2 = w2[0].latitude;
    const lon2 = w2[0].longitude;

    const d = this.distanceBetweenPoints(lat1, lon1, lat2, lon2);
    if (d > 0.09144) {
      return { bool: false };
    }
    return { bool: true, distancePercent: (0.09144 - d) / 0.09144 };
  }

  static compareLast(w1, w2) {
    const lat1 = w1[w1.length - 1].latitude;
    const lon1 = w1[w1.length - 1].longitude;
    const lat2 = w2[w2.length - 1].latitude;
    const lon2 = w2[w2.length - 1].longitude;

    const d = this.distanceBetweenPoints(lat1, lon1, lat2, lon2);
    if (d > 0.09144) {
      return { bool: false };
    }
    return { bool: true, distancePercent: (0.09144 - d) / 0.09144 };
  }

  static distanceBetweenPoints(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180; // deg2rad below
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) /
      2;

    return R * 2 * Math.asin(Math.sqrt(a));
  }

  static similarPath(w1, w2) {
    let i;
    let j;
    let count = 0;
    for (i = 0; i < w1.length; i++) {
      const lat1 = w1[i].latitude;
      const lon1 = w1[i].longitude;
      second:
      for (j = 0; j < w2.length; j++) {
        const lat2 = w2[j].latitude;
        const lon2 = w2[j].longitude;
        const d = this.distanceBetweenPoints(lat1, lon1, lat2, lon2);

        if (d < 0.005) {
          count++;
          break second;
        }
      }
    }
    if (count > w1.length * 0.75 || count > w2.length * 0.75) {
      return { bool: true, accuracyPercent: count / w1.length };
    }
    return { bool: false };
  }

  static samePaths(w1, w2) {
    let i;
    let j;
    let count = 0;
    for (i = 0; i < w1.length; i++) {
      const lat1 = w1[i].latitude;
      const lon1 = w1[i].longitude;
      for (j = 0; j < w2.length; j++) {
        const lat2 = w2[j].latitude;
        const lon2 = w2[j].longitude;
        if (lat1 === lat2 && lon1 === lon2) {
          count++;
        }
      }
    }
    if (count > w1.length * 0.5 || count > w2.length * 0.5) {
      return { bool: true, accuracyPercent: count / w1.length };
    }
    return { bool: false };
  }
}
