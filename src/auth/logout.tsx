import auth from '@react-native-firebase/auth';

const Logout = async () => {
  try {
    auth().signOut().then(() => console.log('User signed out!'));
    }
  catch(error){
    console.log("Logout: an error occurred:", error);
  }
};

export default Logout;