import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import getDatabase from '@react-native-firebase/database';
import GoogleSignIn from './auth_google_provider';
import Logout from './logout';
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import SignUp from './auth_signup_password';
import SignIn from './auth_signin_password';
import Notebook from '../notebook/notebook';

function Login() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // Setup what to do with the user information.
  function userDbCallback(user, ref) {
      console.log('user ' + user.email + ' does not exist!');
      // Do something here you want to do for first time users (Store data in database?)
      console.log('Creating user with id: ', ref.key);
      ref
        .set({
          email: user.email,
          name: user.displayName,
        })
        .then(() => console.log('User Added to DB'));
  }

  function onAuthStateChanged(user) {
    console.log("User Auth state changed:", user);
    setUser(user);
    if (user) {
        try {
    //     const reference = getDatabase(null, 'https://projectsummary-aebf9-default-rtdb.firebaseio.com/')
    //       .ref('/users/' + googleCredential.uid);
            // Tests to see if /users/<userId> exists.
            const db = getDatabase(null, 'https://projectsummary-aebf9-default-rtdb.firebaseio.com/')
                          .ref('/users');
            db.child(user.uid).once('value', function(snapshot) {
            if (snapshot.val() === null) {
                console.log('user ' + user.uid + ' does not exist! Adding to DB');
                userDbCallback(user, snapshot.ref);
            }
            else{
                console.log('user ' + user.email + ' exists!');
            }});
        }
        catch(error) {
            console.log('GoogleSignIn Database get user error:', error);
        }
    }
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