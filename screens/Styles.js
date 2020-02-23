import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  button: {
    borderRadius: 2,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  backButton: {
    borderRadius: 2,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  touchableOpacityStyle: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixFloating: {
    flexDirection: 'row',
  },
  flatListText: {
    fontSize: 22,
  },
  flatListSubtle: {
    fontSize: 22,
    color: '#999',
  },
  flatListSeperater: {
    height: 1,
    width: '95%',
    margin: 5,
    backgroundColor: '#000',
    alignSelf: 'center',
  },
  touchableOpacityContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    padding: 20,
  },
  touchableOpacityButton: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  countContainer: {
    alignItems: 'center',
    padding: 10,
  },
  countText: {
    color: '#FF00FF',
  },
});
