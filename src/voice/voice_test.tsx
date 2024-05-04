import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  LogBox
} from 'react-native';

//Image code
import * as ImagePicker from 'react-native-image-picker';
/* toggle includeExtra */
const includeExtra = true;

//Log ignore warning
LogBox.ignoreLogs(['new NativeEventEmitter']); //Ignore log notification by message


//Voice Code
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';

type Props = {};
type State = {
  recognized: string;
  pitch: string;
  error: string;
  end: string;
  started: string;
  results: string;
  partialResults: string[];
};

export class VoiceTest extends Component<Props, State> {

  state = {
    recognized: '',
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: '',
    partialResults: [],
    previousText: '',
    stopped: true
  };

  constructor(props: Props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart = (e: any) => {
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
    });
  };

  onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log('onSpeechRecognized: ', e);
    this.setState({
      recognized: '√',
    });
  };

  onSpeechEnd = (e: any) => {
    console.log('onSpeechEnd: ', e);
    this.setState({
      end: '√'
    });
  };

  onSpeechError = (e: SpeechErrorEvent) => {
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
    if (!this.state.stopped)
        {
            try {
              Voice.start('he-IL');
            } catch (e) {
              console.error(e);
            }
        }

  };

  onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechResults: ', e);
    this.setState({
      partialResults: [],
      previousText: this.state.previousText + ', ' + e.value[0],
    });
    if (!this.state.stopped)
    {
        this._startRecognizing();
    }
  };

  onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechPartialResults: ', e);
    this.setState({
      partialResults: e.value,
    });
  };

  onSpeechVolumeChanged = (e: any) => {
    console.log('onSpeechVolumeChanged: ', e);
    this.setState({
      pitch: e.value,
    });
  };

  _startRecognizing = async () => {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: '',
      partialResults: [],
      end: '',
      stopped: false
    });

    try {
      await Voice.start('he-IL');
    } catch (e) {
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    this.setState({
      stopped: true
      });
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    this.setState({
          stopped: true
          });
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
      console.log(await Voice.getSpeechRecognitionServices());
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: '',
      partialResults: [],
      end: '',
      previousText: '',
      stopped: true
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native Voice!</Text>
        <Text style={styles.instructions}>
          Press the button and start speaking.
        </Text>
        <TouchableHighlight onPress={this._startRecognizing}>
          <Image style={styles.button} source={require('../../images/button.png')} />
        </TouchableHighlight>
        <TouchableHighlight onPress={this._stopRecognizing}>
          <Text style={styles.action}>{"\n"}{"\n"}Stop {"\n"} Recognizing{"\n"}{"\n"}</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._cancelRecognizing}>
          <Text style={styles.action}>Cancel Recognizing</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._destroyRecognizer}>
          <Text style={styles.action}>Reset</Text>
        </TouchableHighlight>
        <Text style={styles.stat}>{`Started: ${this.state.started}`}</Text>
        <Text style={styles.stat}>{`Recognized: ${this.state.recognized}`}</Text>
        <Text style={styles.stat}>{`Pitch: ${this.state.pitch}`}</Text>
        <Text style={styles.stat}>{`Error: ${this.state.error}`}</Text>
        <Text style={styles.stat}>{`End: ${this.state.end}`}</Text>
        <Text style={styles.stat}>Current:</Text>
            {this.state.partialResults.map((result, index) => {
                 return (
                   <Text key={`partial-result-${index}`} style={styles.stat}>
                     {result}
                   </Text>
                 );
            })}
       {/*<Text style={styles.stat}>{`${this.state.results}`}</Text>

               {this.state.results.map((result, index) => {
                 return (
                   <Text key={`result-${index}`} style={styles.stat}>
                     {result}
                   </Text>
                 );
               })}*/}
       <Text style={styles.stat}>Previous:</Text>
       <Text style={styles.stat}>{`${this.state.previousText}`}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
});

//export VoiceTest;
