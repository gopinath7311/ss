
import * as React from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { TabView, SceneMap ,TabBar} from 'react-native-tab-view';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import Rewardhistory from './rewardshistroy/rewardhistory';
import Transaction from './transactionhistory/transaction';
import Affiliate from './affiliatehistory/affiliate';


export default class Indexhistory extends React.Component {
    state = {
        index: 0,
        routes: [
          {key: 'first', title: 'Rewards History'},
          {key: 'second', title: 'Transaction History'},
          {key: 'third', title: 'Affiliate History'},
      
        ],
        active: false,
      };

      render() {
    const props=this.props.props.navigation
        return (
          <TabView
            style={styles.conts}
            navigationState={this.state}
            renderScene={SceneMap({
              first:()=>< Rewardhistory props={props}/>,
              second: Transaction,
              third: Affiliate,
            })}
            renderTabBar={props => (
              <TabBar
                {...props}
                activeColor={'#78e85b'}
                pressColor='lightblue'
                indicatorStyle={{
                  height: 3,
                  margin: 'auto',
                  backgroundColor: '#78e85b',
                  marginBottom: 3,
                  
                }}
                style={{ backgroundColor: '#000000', height: hp('9%')}}
                inactiveColor={'white'}
                labelStyle={{
                  fontSize: 13,
                  textAlign:"center",
                  fontFamily: 'Montserrat-ExtraBold',
                  fontWeight:"bold",
                  alignSelf: 'center',
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
        width: wp('100%'),
        height: hp('89%'),
        backgroundColor: 'white',
      },
  scene: {
    flex: 1,
  },
});