import store from '../index';
import AsyncStorage from '@react-native-async-storage/async-storage';

export var DARKMODE_THEME = 'DARKMODE_THEME';

function update_theme() {
  setTimeout(async () => {
    try {
      const authy = await AsyncStorage.getItem('darkmode');
      //   console.log('====================================');
      //   console.log('theme mode', authy);
      //   console.log('====================================');
      store.dispatch({type: DARKMODE_THEME, payload: authy});
    } catch (error) {}
  }, 100);
}

export default update_theme;
