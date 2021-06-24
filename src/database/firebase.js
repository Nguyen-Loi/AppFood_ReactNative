import firebase from 'firebase';
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyCN_dQB0-EkzeLAL0YrWhyPvbNT8fH1wbw",
    authDomain: "appfood2-88536.firebaseapp.com",
    projectId: "appfood2-88536",
    storageBucket: "appfood2-88536.appspot.com",
    messagingSenderId: "517638475663",
    appId: "1:517638475663:web:6b1a2a6b0b670adb2e05fa"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  
  const db = firebase.firestore()

  export default{
      firebase,
      db
  }