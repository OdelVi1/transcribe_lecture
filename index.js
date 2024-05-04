/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
//import VoiceTest from './src/voice/voice_test'
//import App from './src/photo/photo_test'
import {name as appName} from './app.json';

//AppRegistry.registerComponent(appName, () => VoiceTest);
AppRegistry.registerComponent(appName, () => App);