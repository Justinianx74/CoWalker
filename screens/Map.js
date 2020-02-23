import React from 'react';
import { TouchableWithoutFeedback, View, Dimensions, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Keyboard, Alert } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { googleMapsConfig } from '../Config'
import { SafeAreaView } from 'react-navigation';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './Styles'
import GoogleMapsAPI from '../GoogleMapsAPI';
import FirebaseAPI from '../FirebaseAPI';
import CompareWaypoints from '../CompareWaypoints'
import Notification from '../Notification'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 38.6347;
const LONGITUDE = -90.2341;
const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    // SLU and Washu
    this.state = {
      coordinates: [
        {
          latitude: 38.6347,
          longitude: -90.2341,
        },
        {
          latitude: 38.636199,
          longitude: -90.238208,
        },
      ],
    };
    this.mapView = null;
  }

  componentDidMount() {
    GoogleMapsAPI.getPosition()
      .then(location => {
        this.setMarker(0, location)
      })
      .catch(console.log)
    Notification.registerForPushNotification(notification => {
      const { uid, name } = notification.data
      Alert.alert("You matched with: \n" + name)

    })

  }

  setRoute = (coordinates) => {
    this.route = coordinates;
  }

  dropMarker = (index, event) => {
    if (index === 0 || index === 1) {
      const { coordinates } = this.state;
      const { latitude, longitude } = event.nativeEvent.coordinate
      coordinates[index] = { latitude, longitude }
      this.setState({ coordinates })
    }
  }

  setMarker = (index, coordinate) => {
    const { coordinates } = this.state;
    coordinates[index] = coordinate
    console.log(coordinate)
    this.setState({ coordinates })
  }

  getPosition = () => {
    GoogleMapsAPI.getPosition()
      .then(location => {
        const { coordinates } = this.state;
        coordinates[0] = location
        this.setState({ coordinates })
      })
      .catch(console.log)
  }

  searchForPeople = () => {
    FirebaseAPI.getPaths()
      .then(paths => {
        //console.log("This is paths[0].waypoints[0].latitude " + paths[0].waypoints[0].latitude)
        let i;
        const people = []
        for (i = 0; i < paths.length; i++) {
          let percent = 0;
          let start = CompareWaypoints.compareFirst(this.route, paths[i].waypoints)
          let end = CompareWaypoints.compareLast(this.route, paths[i].waypoints)
          let similar = CompareWaypoints.similarPath(this.route, paths[i].waypoints)
          let same = CompareWaypoints.samePaths(this.route, paths[i].waypoints)

          if (start.bool === true && end.bool === true) {
            if (start.distancePercent > percent) { percent = start.distancePercent }
            console.log("start")
            if (end.distancePercent > percent) { percent = end.distancePercent }
            console.log("end")
          }
          if (similar.bool === true) {
            if (similar.accuracyPercent > percent) { percent = similar.accuracyPercent }
            console.log("similar")
          }
          if (same.bool === true) {
            if (same.accuracyPercent > percent) { percent = same.accuracyPercent }
            console.log("same")
          }
          if (percent > 0) { people.push({ uid: paths[i].uid, percent }) }
        }
        // FirebaseAPI.storeWaypoints(this.route);
        const { navigation } = this.props;
        navigation.navigate('Matches', { users: people })
      })
      .catch(console.log)
  }

  navigateMatches = (paths) => {
    const people = this.getPathMatches(paths)
    const { navigation } = this.props
    navigation.navigate('Matches', { users: people })
  }

  getPathMatches = (paths) => {
    let i;
    const people = []
    for (i = 0; i < paths.length; i++) {
      let percent = 0;
      let start = CompareWaypoints.compareFirst(this.route, paths[i].waypoints)
      let end = CompareWaypoints.compareLast(this.route, paths[i].waypoints)
      let similar = CompareWaypoints.similarPath(this.route, paths[i].waypoints)
      let same = CompareWaypoints.samePaths(this.route, paths[i].waypoints)

      if (start.bool === true && end.bool === true) {
        if (start.distancePercent > percent) { percent = start.distancePercent }
        console.log("start")
        if (end.distancePercent > percent) { percent = end.distancePercent }
        console.log("end")
      }
      if (similar.bool === true) {
        if (similar.accuracyPercent > percent) { percent = similar.accuracyPercent }
        console.log("similar")
      }
      if (same.bool === true) {
        if (same.accuracyPercent > percent) { percent = same.accuracyPercent }
        console.log("same")
      }
      if (percent > 0) { people.push({ uid: paths[i].uid, percent }) }
    }
    console.log(people)
    return people;
  }

  render() {
    const { coordinates } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <MapView
              initialRegion={{
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              style={StyleSheet.absoluteFill}
              ref={c => this.mapView = c}
            >
              {coordinates.map((coordinate, index) =>
                <MapView.Marker draggable key={`coordinate_${index}`} coordinate={coordinate} onDragEnd={event => this.dropMarker(index, event)} title={index === 0 ? 'Start' : 'End'} />
              )}
              {(coordinates.length === 2) && (
                <MapViewDirections
                  origin={coordinates[0]}
                  destination={coordinates[1]}
                  mode="WALKING"
                  apikey={googleMapsConfig.apiKey}
                  strokeWidth={3}
                  strokeColor="hotpink"
                  optimizeWaypoints={true}
                  onStart={(params) => {
                    console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                  }}
                  onReady={result => {
                    //Render route
                    this.setRoute(result.coordinates)
                    this.mapView.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        right: (width / 20),
                        bottom: (height / 20),
                        left: (width / 20),
                        top: (height / 20),
                      }
                    });
                  }}
                  onError={(errorMessage) => {
                    // console.log('GOT AN ERROR');
                  }}
                />
              )}
            </MapView>
          </SafeAreaView>
          <KeyboardAvoidingView style={styles.fixFloating} behavior='padding' >
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Button title='Search' style={styles.button} onPress={this.searchForPeople} />
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.touchableOpacityStyle} onPress={this.getPosition} >
              <Icon name='map-marker-alt' size={30} color='#000' />
            </TouchableOpacity>

          </KeyboardAvoidingView>
        </View>

      </TouchableWithoutFeedback>
    );
  }
}
