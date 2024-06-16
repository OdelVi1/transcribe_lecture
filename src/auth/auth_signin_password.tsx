import auth from '@react-native-firebase/auth';

const SignIn = async () => {
   return auth()
  .signInWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
  .then(() => {
    console.log('User account signed in!');
  })
  .catch(error => {
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      console.log('That user name or password are incorrect!');
    }
    console.error(error);
  });
};

export default SignIn;