import * as React from 'react';
import {Text, StyleSheet, ViewStyle, TextStyle, ScrollView, Image} from 'react-native';

export function NotebookObject({children}: React.PropsWithChildren<{}>) {
  console.log("return the object: ", children);
  if (children == null || children.content == null) {
    return null;
  }

  if (children.type === 'text'){
    console.log("return text object");
    return (
     <Text style={styles.text}>{children.content}</Text>
    );
  };
  console.log("return image object");
  return (
        <Image
          resizeMode="cover"
          resizeMethod="scale"
          style={styles.image}
          source={{uri: children.content}}
        />);

}

interface Styles {
  container: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: '#dcecfb',
    marginVertical: 8,
    padding: 8,
    borderRadius: 8,
    maxHeight: 200,
  },
  text: {
    color: 'black',
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

interface NotebookObjectInterface {
  type: 'text' | 'image';
  content: string;
}