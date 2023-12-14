import React, { Component } from 'react';
import { StyleSheet,View,TextInput,Text,TouchableOpacity,Image } from 'react-native';
import { Icon } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const eyeclose=require('../../../assests/images/eyeclose.png')
const eyeopen=require('../../../assests/images/eyeclose.png')

class Passwordform extends Component {
    state = { 
      passwordVisible: false,
     } 
     seepassword = () => {
      this.setState({passwordVisible: !this.state.passwordVisible});
    };
    render() { 
      const {passwordVisible}=this.state
        return (
        <View style={styles.mainform}>
<Text
                style={{
                  color: '#fff',
                  fontSize: 13,
                  fontFamily: 'Montserrat-SemiBold',
                  textTransform: 'uppercase',
                  marginTop: hp('3%'),
                }}>
                Password
              </Text>
              <View style={styles.sidecont}>
                {/* <View style={styles.sideconts}>
                      <View style={styles.iconWrap}>
                        <Icon
                          name="lock"
                          type="SimpleLineIcons"
                          size={20}
                          color="#ecb830"
                        />
                      </View>
                    </View> */}
                <View
                  style={[
                    styles.inputStyle,
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      color: '#353535',
                    },
                  ]}>
                  <TextInput
                    returnKeyType="done"
                    style={[{paddingHorizontal: wp('0%'),color:"white"}]}
            
                    onChangeText={e => this.setState({password:e})}
                    maxLength={15}
                    value={this.state.password}
                    placeholder="Please Enter Password"
                    placeholderTextColor="lightgray"
                    secureTextEntry={passwordVisible? true : false}
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.visibilityBtn}
                    onPress={() => this.passwordVisible}>
                    {passwordVisible? (
                      <Icon
                        name="remove-red-eye"
                        type="Entypo"
                        size={20}
                        color="#fff"
                      />
                    ) : (
                      <Icon
                        name="block"
                        type="Entypo"
                        size={20}
                        color="#fff"
                      />
                      //   <Ionicons name={'eye-off'} size={26} color={'#fff'} />
                    )}
                  </TouchableOpacity>

                 
                </View>
              </View>
        </View>
        );
    }
}
 
export default Passwordform;
const styles=StyleSheet.create({
  textinput: {
    backgroundColor: '#7477ff',
    color: 'white',
    borderRadius: 10,
   
  },
  eye: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
    marginTop: 15,
  },
  mainform: {
    alignItems: 'flex-start',
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
})