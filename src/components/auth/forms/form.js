
import React, { Component } from 'react';
import { View,Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import { Icon } from 'react-native-elements';
class Form extends Component {
    state = {  } 

    render() { 
   //console.log(this.props)
        return (
              <View style={styles.Mainform}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 13,
                  fontFamily: 'Montserrat-SemiBold',
                  textTransform: 'uppercase',
                }}>
                {this.props.label}
              </Text>
              <View style={styles.sidecont}>
                {/* <View style={styles.sideconts}>
                      <Icon
                        name="user"
                        type="entypo"
                        size={20}
                        color="#ecb830"
                      />
                    </View> */}
                <TextInput
                  style={styles.inputStyle}
                  placeholder={this.props.placeholder}
                  maxLength={15}
                  placeholderTextColor={'lightgray'}
                  returnKeyType="done"
                  onChangeText={e => this.props.onChangeText(e)}
                  value={this.state.name}
                />
              </View>
              </View>
            
        );
    }
}
 
export default Form;
const styles=StyleSheet.create({
  Mainform: {
    alignItems: 'flex-start',
    marginVertical: hp('2%'),
    marginHorizontal: wp('5%'),
    width:wp('80%'),
    alignSelf:'center'
  },
  sidecont: {
    height: hp('5%'),
    flexDirection: 'row',
    borderRadius: 7,
    fontSize: 25,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: hp('0.8%'),
  },
  inputStyle: {
    flex: 85,
    height: hp('5.4%'),
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    paddingHorizontal: wp('3%'),
    color: 'white',
    borderColor: '#fff',
    borderWidth: 0.5,
    backgroundColor: '#125c40',
    borderRadius: 5,
  },
  inputContianer:{
    width:wp('70%'),
    alignSelf:"center",
    marginBottom:10,
 
    
},
textinput: {
backgroundColor: '#7477ff',
color: 'white',
borderRadius: 10,
top:10
},
})