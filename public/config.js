
 var config = {
   apiKey: "AIzaSyABZJzOexhNRGJZjpnlE9qIw84XFKhdpr8",
   authDomain: "where-at-dhs.firebaseapp.com",
   databaseURL: "https://where-at-dhs.firebaseio.com",
   projectId: "where-at-dhs",
   storageBucket: "where-at-dhs.appspot.com",
   messagingSenderId: "292287566533"
 };
 firebase.initializeApp(config);
var db = firebase.firestore();
var storageRef = firebase.storage().ref();
