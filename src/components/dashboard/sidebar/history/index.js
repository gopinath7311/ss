import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import Indexhistory from './indexhistory';

class History extends Component {
  state = {
    search: '',
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#000000'}}>
        <View
          style={{
            height: hp('8%'),
            backgroundColor: '#00291e',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: wp('2%'),
          }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('home')}>
            <Icon name="arrow-back" type="ionicons" size={35} color="#fff" />
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <Image
              style={{
                width: 205,
                height: 60,
              }}
              source={require('../../../../assests/images/logoname-bg.png')}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity></TouchableOpacity>
        </View>
        <Indexhistory props={this.props} />
      </SafeAreaView>
    );
  }
}

export default History;
const styles = StyleSheet.create({
  icon: {
    marginLeft: 10,
    bottom: 7,
  },
  history: {
    fontSize: 23,
    fontWeight: 'bold',
    marginLeft: 100,
    color: 'white',
    bottom: 10,
  },
});
