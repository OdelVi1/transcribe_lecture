import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  statusCodes,
  isErrorWithCode,
  GoogleSignin,
} from "@react-native-google-signin/google-signin";

const GoogleSignIn = async () => {
  try {
    console.log('GoogleSignIn start');
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    console.log('GoogleSignIn has play services');
    console.log('GoogleSignIn configure');
    GoogleSignin.configure({
      webClientId: '322846357190-uco22fs7ippg1jr9unejso7229b2d1ic.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
    try{
        await GoogleSignin.revokeAccess();
        }
    catch(error){
        console.log("Not previously signed in");
        }
    const { idToken } = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);

  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.NO_SAVED_CREDENTIAL_FOUND:
          // Android and Apple only. No saved credential found, try calling `createAccount`
          console.log('GoogleSignIn: Android and Apple only. No saved credential found, try calling `createAccount`');
          await GoogleOneTapSignIn.createAccount({
            webClientId: `322846357190-uco22fs7ippg1jr9unejso7229b2d1ic.apps.googleusercontent.com`,
            nonce: "your_nonce",
          });
          break;
        case statusCodes.SIGN_IN_CANCELLED:
          // sign in was cancelled
          console.log('GoogleSignIn: sign in was cancelled');
          break;
        case statusCodes.ONE_TAP_START_FAILED:
          // Android and Web only, you probably have hit rate limiting.
          // On Android, you can still call `presentExplicitSignIn` in this case.
          // On the web, user needs to click the `WebGoogleSigninButton` to sign in.
          console.log('GoogleSignIn: ONE_TAP_START_FAILED');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // Android-only: play services not available or outdated
          // Web: when calling an unimplemented api (requestAuthorization)
          console.log('GoogleSignIn: PLAY_SERVICES_NOT_AVAILABLE');
          break;
        default:
        // something else happened
        console.log('GoogleSignIn: default error:', error);
      }
    } else {
      // an error that's not related to google sign in occurred
      console.log("GoogleSignIn: an error that's not related to google sign in occurred:", error);
    }
  }
};

export default GoogleSignIn;