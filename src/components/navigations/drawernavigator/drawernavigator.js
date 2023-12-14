import React, {Component} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';




import Fluidbottm from '../fluidbottom/fluidbottom';
import Sidebar from '../../dashboard/sidebar/sidebar';
const Drawer = createDrawerNavigator();
class Drawernavigator extends Component {
  state = {};
  render() {
    return (
      <Drawer.Navigator
        drawerContent={props => <Sidebar {...props} />}
        screenOptions={{headerShown: false}}>
        <Drawer.Screen name="hometab" component={Fluidbottm} />
   
      </Drawer.Navigator>
    );
  }
}

export default Drawernavigator;


