import React, {Component} from 'react';
import {View, TouchableOpacity, Image, StyleSheet, Text,ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'react-native-elements';
import CountryCurrencyPicker from 'react-native-country-currency-picker';

class Portfolio extends Component {
  state = {
    demo1: {},
    demo2: {},
    demo3: {},
    demo4: {},
  };
  onChange = demo => (index, selectedItem) => {
    this.setState({
      [demo]: {
        index,
        ...selectedItem,
      }
    })
  }
  renderDemo = (demo, title, props) => {
    return (
      <ScrollView style={styles.subContainer}>
        <Text style={styles.header}>{title}</Text>
        <View>
          <Text>Selected Index: {this.state[demo].index}</Text>
          <Text>Selected Country: {this.state[demo].country}</Text>
          <Text>Selected Currency: {this.state[demo].currency}</Text>
        </View>
        <CountryCurrencyPicker
         // containerStyle={styles.containerStyle}
          {...props}
        />
      </ScrollView>
    )
  }
  render() {
    return (
      <View style={{backgroundColor: '#000000', flex: 1}}>
        <View
          style={{
            height: hp('8%'),
            backgroundColor: '#00291e',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: wp('2%'),
          }}>
          <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
            <Icon name="menu" type="ionicons" size={35} color="#fff" />
          </TouchableOpacity>

          <Image
            style={{
              width: 205,
              height: 60,
              left: 53,
            }}
            source={require('../../../assests/images/logoname-bg.png')}
            resizeMode="contain"
          />
        </View>
        <View style={styles.box}>
<Text style={styles.text}>Overall Rewards</Text>
<Text style={[styles.text,{color:"#00e859",fontFamily:'NotoSerifBalinese-Regular',fontSize:23,top:-10}]}>0.00</Text>
<View style={{flexDirection:'row',justifyContent:"space-evenly",alignItems:'center',top:-10}}>
  <View>
  <Text style={styles.text2}>Total Contribution</Text>
  <Text style={styles.numText}>0.000</Text>
  </View>
  <View>
  <Text style={styles.text2}>Current Value</Text>
  <Text style={styles.numText}>0.000</Text>
  </View>
</View>
        </View>

        <Text style={{alignSelf:'center',color:'#fff',}}>No Data Found</Text>
      </View>

    );
  }
}

export default Portfolio;
const styles = StyleSheet.create({
  box:{
    width:wp('90%'),
    height:hp('22%'),
    backgroundColor:"#003020",
    borderWidth:0.5,
    borderColor:"#6dc66e",
    borderRadius:hp('1%'),
    alignSelf:"center",
    top:10,
    marginBottom:20
  },
  text:{
    fontFamily:"YoungSerif-Regular",
    color:"#cffcdb",
    fontSize:17,
    alignSelf:"center",
    marginTop:10
  },
  text2:{
    color:"#cffcdb",
    fontFamily:"YoungSerif-Regular"
  },
  numText:{
    color:"#00e859",
    alignSelf:"center",
    fontFamily:'NotoSerifBalinese-Regular'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  subContainer: {
    padding: 10,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
  },
  containerStyle: {
    backgroundColor: 'lightblue',
  },
});
