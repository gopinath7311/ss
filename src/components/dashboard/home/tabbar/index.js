
import * as React from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { TabView, SceneMap ,TabBar} from 'react-native-tab-view';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import Buy from './buy';
import Sell from './sell';



export default class Crypotswap extends React.Component {
    state = {
        index: 0,
        routes: [
          {key: 'first', title: 'Buy'},
          {key: 'second', title: 'Sell'},
  
        ],
        active: false,
      };

      render() {

        return (
          <TabView
            style={styles.conts}
            navigationState={this.state}
            renderScene={SceneMap({
              first:()=><Buy props={this.props}/>,
              second:()=><Sell props={this.props}/>,
        
            })}
            renderTabBar={props => (
              <TabBar
                {...props}
                activeColor={'#78e85b'}
                pressColor='lightblue'
                indicatorStyle={{
                  height: 1.5,
                  margin: 'auto',
                  backgroundColor: '#78e85b',
                  marginBottom: 3,
                  
                }}
                style={{ backgroundColor: 'none', height: hp('6.5%'),}}
                inactiveColor={'white'}
                labelStyle={{
                  fontSize: 13,
                  textAlign:"center",
                  fontFamily: 'Montserrat-ExtraBold',
                  fontWeight:"bold",
                  alignSelf: 'center',
                  //marginTop: hp('1%'),
                  textTransform:'none'
                }}
                
                
              />
            )}
            onIndexChange={index => this.setState({index})}
            initialLayout={{width: Dimensions.get('window').width}}
          />
        );
      }
}

const styles = StyleSheet.create({
    conts: {
        width: wp('75%%'),
        height: hp('53%'),
        top:20
       
      },
  scene: {
    flex: 1,
  },
});