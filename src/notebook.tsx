import React, { Component } from 'react';
import { Image, View, Text, Button, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Transcribe from './voice/transcribe';
import * as ImagePicker from 'react-native-image-picker';

/* toggle includeExtra */
const includeExtra = false;

const transcribe = new Transcribe();

function Notebook() {
       const [text, setText] = React.useState('');

    function onTextStateChanged(newText) {
        console.log('updating text with:', newText)
        setText(newText);
      }

    React.useEffect(() => {
          const subscriber = transcribe.onTextUpdate(onTextStateChanged);
          return subscriber; // unsubscribe on unmount
      }, []);
    const [image, setImage] = React.useState<any>(null);

    handleStart = () => {
        console.log("Handle start is called");
        transcribe.switchTranscriptionState();
    };

    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Button title="Take Image" onPress={() => {ImagePicker.launchCamera(Capture_Options, setImage);}} />
          <Button title="Select Image" onPress={() => {ImagePicker.launchImageLibrary(Image_Library_Options, setImage);}} />
          <Button title="Transcribe" onPress={() => {this.handleStart();}} />
        </View>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.text}>Transcribed Text:</Text>
            <Text style={styles.text}>{transcribe.getTranscriptionTextDisplay()}</Text>
            {image?.assets &&
                image?.assets.map(({uri}: {uri: string}) => (
                  <View key={uri} style={styles.imageContainer}>
                    <Image
                      resizeMode="cover"
                      resizeMethod="scale"
                      style={styles.image}
                      source={{uri: uri}}
                    />
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