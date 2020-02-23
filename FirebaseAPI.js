import firebase from "firebase";
import '@firebase/firestore'
import { firebaseConfig } from "./Config"

export default class FirebaseAPI {
  static initializeApp = () => {
    firebase.initializeApp(firebaseConfig)
    this.userCollection = firebase.firestore().collection('users');
    this.userPath = firebase.firestore().collection('userPath');
    this.auth = firebase.auth();
  };

  static registerWithEmail = (name, email, password, phone, exponentToken) => {
    return new Promise((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          this.userCollection.doc(userCredential.user.uid).set({
            name,
            email: email.toLowerCase(),
            phone,
            exponentToken
          })
          resolve();
        })
        .catch(reject);
    });
  };

  static signInWithEmail = (email, password, exponentToken) => {
    return new Promise((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(email, password).then(userCredential => {
        this.userCollection.doc(userCredential.user.uid).update({ exponentToken })
        resolve();
      })
        .catch(reject);
    })
  }

  static storeWaypoints = (waypoints) => {
    this.userPath.doc().set({
      waypoints,
      uid: this.auth.currentUser.uid
    })
  }

  static isLoggedIn = callback => {
    return this.auth.onAuthStateChanged(user => {
      if (user) {
        this.getUser(user.uid)
          .then(userInfo => this.userInfo = userInfo)
      }
      callback(user);
    });
  };

  static getPaths = () => {
    return new Promise((resolve, reject) => {
      this.userPath.get()
        .then(querySnapshot => {
          const pathArray = []
          querySnapshot.forEach(docSnapshot => {
            const { waypoints, uid } = docSnapshot.data()
            pathArray.push({ waypoints, uid })
          })
          resolve(pathArray)
        })
        .catch(reject)
    })
  }

  static getUser = (uid, percent) => {
    return new Promise((resolve, reject) => {
      this.userCollection.doc(uid).get()
        .then(docSnapshot => {
          const { name, exponentToken } = docSnapshot.data();
          resolve({ name, exponentToken, uid, percent })
        })
        .catch(reject)
    })
  }

  static getUsers = (uids) => {
    return new Promise((resolve, reject) => {
      const promises = [];
      uids.forEach(user => promises.push(this.getUser(user.uid, user.percent)))
      Promise.all(promises)
        .then(usersInfo => {
          const returnArray = []
          usersInfo.forEach(userInfo => returnArray.push(userInfo))
          resolve(returnArray)
        })
        .catch(reject)
    })
  }

  static removeUsersPath = (uid1) => {
    return new Promise((resolve, reject) => {
      this.userPath.where('uid', '==', uid1).get()
        .then(snapshot => {
          snapshot.forEach(docSnapshot => {

            this.userPath.doc(docSnapshot.id).delete()
            resolve();

          })
        })
        .catch(reject)
    })

  }

}