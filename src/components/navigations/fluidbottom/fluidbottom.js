import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  BackHandler,
  Alert,
} from 'react-native';

import {Icon} from 'react-native-elements';

import * as Animatable from 'react-native-animatable';
import homescreen from '../../dashboard/home/homescreen';
import cryptotransfer from '../../dashboard/cryptotransfers/cryptotransfer';
import History from '../../dashboard/sidebar/history';
import Profile from '../../dashboard/profile/profile';
import liquidity from '../../dashboard/liquidity/liquidity';
import Portfolio from '../../dashboard/portfolio/portfolio';

const TabArr = [
  {
    route: 'Home',
    label: 'Home',
    type: 'Entypo',
    name: 'home',
    component: homescreen,
  },
  {
    route: 'Transfer',
    label: 'Transact',
    type: 'MaterialIcons',
    name: 'transform',
    component: cryptotransfer,
  },
  {
    route: 'Liquidity',
    label: 'Liquidity',
    type: 'Entypo',
    name: 'cloud-circle',
    component: liquidity,
  },
  {
    route: 'Portfolio',
    label: 'Portfolio',
    type: 'FontAwesome6',
    name: 'insert-chart',
    component: Portfolio,
  },
  {
    route: 'Profile',
    label: 'Profile',
    type: 'Ionicons',
    name: 'person',
    component: Profile,
  },
];

const Tab = createBottomTabNavigator();

const animate1 = {
  0: {scale: 0.5, translateY: 7},
  0.92: {translateY: -34},
  1: {scale: 1.2, translateY: -24},
};
const animate2 = {
  0: {scale: 1.2, translateY: -24},
  1: {scale: 1, translateY: 7},
};

const circle1 = {
  0: {scale: 0},
  0.3: {scale: 0.9},
  0.5: {scale: 0.2},
  0.8: {scale: 0.7},
  1: {scale: 1},
};
const circle2 = {0: {scale: 1}, 1: {scale: 0}};

const TabButton = props => {
  const {item, onPress, accessibilityState} = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    backdisable();
    if (focused) {
      viewRef.current.animate(animate1);
      circleRef.current.animate(circle1);
      textRef.current.transitionTo({scale: 1});
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({scale: 0.9});
    }
  }, [focused]);
  const backdisable = () => {
    backAction = () => {
      Alert.alert('stop', 'Are you sure you want to exit app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <Animatable.View ref={viewRef} duration={1000} style={styles.container}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            //borderWidth: focused?1:0,
            //borderColor: focused? "#78e85b":"grey",
            backgroundColor: '#133225',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Animatable.View ref={circleRef} style={styles.circle} />

          <Icon
            type={item.type}
            name={item.name}
            color={focused ? '#79ed92' : '#387b71'}
          />
        </View>
        <Animatable.Text
          ref={textRef}
          style={[styles.text, {color: focused ? '#79ed92' : '#387b71',fontFamily:focused?'Montserrat-Bold':null}]}>
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default function Fluidbottm() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
      }}>
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: props => <TabButton {...props} item={item} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: 65,
    position: 'absolute',
    bottom: 5,
    right: 10,
    left: 10,
    borderRadius: 16,
    backgroundColor: '#133225',
    borderColor: '#133225',
  },

  circle: {
    //...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#090932',
    borderRadius: 25,
  },
  text: {
    fontSize: 10,
    textAlign: 'center',

    top: -10,
  },
});
