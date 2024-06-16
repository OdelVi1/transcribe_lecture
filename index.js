/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import App from './App';
import {name as appName} from './app.json';
//AppRegistry.registerComponent(appName, () => App);

//import VoiceTest from './src/voice/voice_test'
//AppRegistry.registerComponent(appName, () => VoiceTest);

//import App from './src/photo/photo_test'

import Login from './src/auth/login'
AppRegistry.registerComponent(appName, () => Login);

//import Notebook from './src/notebook'
//AppRegistry.registerComponent(appName, () => Notebook);
