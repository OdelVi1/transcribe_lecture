import React, { Component } from 'react';
import { NativeEventEmitter, DeviceEventEmitter, LogBox, StyleSheet, Text, View, ScrollView } from 'react-native';

const eventEmitter = new NativeEventEmitter(DeviceEventEmitter);

//Log ignore warning
//LogBox.ignoreLogs(['new NativeEventEmitter']); //Ignore log notification by message

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
  previousText: string;
  partialResults: string[];
  stopped: boolean;
};


class Transcribe extends Component<Props, State> {
    private listeners: ((text: string) => void)[] = [];

    constructor(props: Props) {
        super(props);
        this.recognitionSwitchState = false;
        this.state = {
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
        Voice.onSpeechStart = this.onSpeechStart;
        Voice.onSpeechRecognized = this.onSpeechRecognized;
        Voice.onSpeechEnd = this.onSpeechEnd;
        Voice.onSpeechError = this.onSpeechError;
        Voice.onSpeechResults = this.onSpeechResults;
        Voice.onSpeechPartialResults = this.onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;

        this.eventEmitter = new NativeEventEmitter();
        text = '';
        _languageCode = 'he-IL'; //this.native.APP_LANGUAGE[this.app._name]

//         if (!this.languageCode) {
//               this._languageCode = this.native.APP_LANGUAGE['[DEFAULT]'];
//             }
    }

    private emitTextUpdated(text: string) {
        eventEmitter.emit('textUpdated', text);
        this.listeners.forEach(listener => listener(text));
    }

    componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
      }

    setLanguageCode(languageCode) {
        _languageCode = languageCode;
    }

    switchTranscriptionState() {
    // Start or Stop transcription
        if (this.recognitionSwitchState) {
            console.log("Switch Stop Transcription");
            this.recognitionSwitchState = false;
            this._stopRecognizing();
        }
        else {
            console.log("Switch Start Transcription");
            this.recognitionSwitchState = true;
            this._startRecognizing();
        }
    }

    getTranscriptionText() {
        return this.state.previousText;
    }

    getTranscriptionTextDisplay() {
        return (

            <View style={styles.container}>
                <Text style={styles.stat}>{`${this.state.previousText}`}</Text>
                {this.state.partialResults.map((result, index) => {
                     return (
                       <Text key={`partial-result-${index}`} style={styles.stat}>
                         {result}
                       </Text>
                     );
                })}
            </View>
        );
    }

    getCurrentTranscription(callback: (setText: string) => void) {
            callback(this.state.partialResults[0]);
        }

    //External Events
    onTextUpdate(callback: (newText: string) => void) {
        this.eventEmitter.addListener('textUpdated', callback);
      }

    offTextUpdate(callback: (newText: string) => void) {
        try {
            this.eventEmitter.removeListener('textUpdated', callback);
        }
        catch(error) {
            console.log("removeListener error. Called removeListener after object unmounted?")
        }
      }

    //Internal Events
    onSpeechStart = (e: any) => {
        console.log('onSpeechStart: ', e);
        this.state.started ='√';
    };

    onSpeechRecognized = (e: SpeechRecognizedEvent) => {
        console.log('onSpeechRecognized: ', e);
        this.state.recognized = '√';
    };

    onSpeechEnd = (e: any) => {
        console.log('onSpeechEnd: ', e);
        this.state.end = '√';
    };

    onSpeechError = (e: SpeechErrorEvent) => {
        console.log('onSpeechError: ', e);
        this.state.error = JSON.stringify(e.error);
        if (!this.state.stopped && this.recognitionSwitchState)
        {
            try {
              Voice.start(_languageCode);
            } catch (e) {
              console.error(e);
            }
        }
    };

    onSpeechResults = (e: SpeechResultsEvent) => {
        console.log('onSpeechResults: ', e);
        console.log('onSpeechResults partial results: ', this.state.partialResults[0]);
        this.state.partialResults = [];
        this.state.previousText = this.state.previousText + '.\n' + e.value[0];
        text = this.state.previousText;

//         this.eventEmitter.emit('textUpdated', this.state.previousText);
        console.log("onSpeechResults: stopped: ", this.state.stopped);
        console.log("onSpeechResults: this.recognitionSwitchState: ", this.recognitionSwitchState);
        if (!this.state.stopped && this.recognitionSwitchState)
        {
            console.log("onSpeechResults: call Voice.start");
            //this._startRecognizing();
            Voice.start(_languageCode);
        }
    };

    onSpeechPartialResults = (e: SpeechResultsEvent) => {
        console.log('onSpeechPartialResults: ', e);
        this.state.partialResults = e.value;
        this.eventEmitter.emit('textUpdated', e.value[0]);
    };

    onSpeechVolumeChanged = (e: any) => {
        //console.log('onSpeechVolumeChanged: ', e);
        this.state.pitch = e.value;
    };

    //Transcription actions
    _startRecognizing = async () => {
        console.log("Start Called again");
        this.state = {
          recognized: '',
          pitch: '',
          error: '',
          started: '',
          results: '',
          previousText: text,
          partialResults: [],
          end: '',
          stopped: false
        };
        try {
          await Voice.start(_languageCode);
        } catch (e) {
          console.error(e);
        }
    };

    _stopRecognizing = async () => {
        this.state.stopped = true;

        try {
          await Voice.stop();
        } catch (e) {
          console.error(e);
        }
    };

    _cancelRecognizing = async () => {
        this.state.stopped = true;

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
        this.state = {
          recognized: '',
          pitch: '',
          error: '',
          started: '',
          partialResults: [],
          end: '',
          previousText: text,
          stopped: true
        };
    };
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

export default Transcribe;
