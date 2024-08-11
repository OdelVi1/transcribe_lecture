import React, { Component } from 'react';
import { Image, View, Text, Button, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Transcribe from '../voice/transcribe';
import * as ImagePicker from 'react-native-image-picker';
import { NotebookObject, NotebookObjectInterface } from './components/notebook_object';

/* toggle includeExtra */
const includeExtra = false;

function Notebook(props) {
    const [text, setText] = React.useState('');
    const [image, setImage] = React.useState<any>(null);
    const [notebook_objects, setNotebookObjects] = React.useState<NotebookObjectInterface[]>([]);
    const transcribe = new Transcribe(props.user_id, props.notebook_id);

    function onTextStateChanged(newText) {
        setText(newText);
    }

    function onSpeechResult(newText) {
        console.log('updating text with:', newText)
        setNotebookObjects([
            ...notebook_objects,
            { type: 'text', content: newText  } // and one new item at the end
          ]);
    }

    function onImageResult(newImage) {
            console.log('updating image with:', newImage)
            if ("didCancel" in newImage && newImage.didCancel) {
              return;
            }
            setNotebookObjects([
                ...notebook_objects,
                ...newImage.assets.map(({uri}: {uri: string}) => (
                    { type: 'image', content: uri })) // add new items at the end of the array
              ]);
            console.log(notebook_objects);
        }

    React.useEffect(() => {

        const subscriber = transcribe.onTextUpdate(onSpeechResult);
        return subscriber; // unsubscribe on unmount
      }, []);

    handleStart = () => {
        transcribe.switchTranscriptionState();
    };

    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Button title="Take Image" onPress={() => {ImagePicker.launchCamera(Capture_Options, onImageResult);}} />
          <Button title="Select Image" onPress={() => {ImagePicker.launchImageLibrary(Image_Library_Options, onImageResult);}} />
          <Button title="Transcribe" onPress={() => {this.handleStart();}} />
        </View>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.text}>Transcribed Text:</Text>
{/*             <Text style={styles.text}>{transcribe.getTranscriptionTextDisplay()}</Text> */}

            <Text style={styles.text}>Objects:</Text>
            {notebook_objects.map(notebook_object => (
              <View key={notebook_object.content}>
                <Text>map object print:</Text>
                <NotebookObject>{notebook_object}</NotebookObject>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  imageContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

const Capture_Options: ImagePicker.CameraOptions = {
    saveToPhotos: true,
    mediaType: 'photo',
    includeBase64: false,
    includeExtra,
};

const Image_Library_Options: ImagePicker.ImageLibraryOptions = {
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
};

export default Notebook;