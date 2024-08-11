import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import GoogleSignIn from './auth_google_provider';
import Logout from './logout';
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import SignUp from './auth_signup_password';
import SignIn from './auth_signin_password';

import Notebook from '../notebook/notebook';

function Login() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  function onAuthStateChanged(user) {
    console.log("User Auth state changed:", user);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>Login:</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Signup"
            disabled={initializing}
            onPress={() => {
              SignUp().then(() => console.log('Signed up with email and password!'));
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Sign in existing user"
            disabled={initializing}
            onPress={() => {
              SignIn().then(() => console.log('Signed in with email and password!'));
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => {
              GoogleSignIn().then(() => console.log('Signed in with Google!'));
            }}
            disabled={initializing}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Welcome {user.displayName ? user.displayName : user.email}</Text>
      <Button
        title="Logout"
        onPress={() => Logout().then(() => console.log('Signed out!'))}
      />
      <Notebook notebook_id='1' user_id={user.email} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align items at the top
    alignItems: 'center',
    paddingTop: 20, // Add some padding from the top
  },
  textStyle: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 10, // Adjust this value to add space between buttons
  },
  buttonStyle: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 10, // Adjust this value to add space between buttons
  },
  buttonStyle: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
*/
export default Login;





/*
import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import GoogleSignIn from './auth_google_provider';
import Logout from './logout';
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import SignUp from './auth_signup_password';
import SignIn from './auth_signin_password';

function Login() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  function onAuthStateChanged(user) {
    console.log("User Auth state changed:", user);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>Login:</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Signup"
            disabled={initializing}
            onPress={() => {
              SignUp().then(() => console.log('Signed up with email and password!'));
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Sign in existing user"
            disabled={initializing}
            onPress={() => {
              SignIn().then(() => console.log('Signed in with email and password!'));
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => {
              GoogleSignIn().then(() => console.log('Signed in with Google!'));
            }}
            disabled={initializing}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Welcome {user.displayName ? user.displayName : user.email}</Text>
      <Button
        title="Logout"
        onPress={() => Logout().then(() => console.log('Signed out!'))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 10, // Adjust this value to add space between buttons
  },
  buttonStyle: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
*/