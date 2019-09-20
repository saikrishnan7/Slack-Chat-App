import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyBaKJW-0yyJ15Jcjk59qCJCW-FK5L2oHwU",
    authDomain: "react-slack-chat-49465.firebaseapp.com",
    databaseURL: "https://react-slack-chat-49465.firebaseio.com",
    projectId: "react-slack-chat-49465",
    storageBucket: "react-slack-chat-49465.appspot.com",
    messagingSenderId: "916001767033",
    appId: "1:916001767033:web:4b80abe9374704bdcb5ea8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;