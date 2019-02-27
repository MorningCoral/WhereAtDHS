
 var config = {
   apiKey: "AIzaSyABZJzOexhNRGJZjpnlE9qIw84XFKhdpr8",
   authDomain: "where-at-dhs.firebaseapp.com",
   databaseURL: "https://where-at-dhs.firebaseio.com",
   projectId: "where-at-dhs",
   storageBucket: "where-at-dhs.appspot.com",
   messagingSenderId: "292287566533"
 };
 firebase.initializeApp(config);

 var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      if (authResult.user) {
          handleSignedInUser(authResult.user);
      }
      // Do not redirect
      return false;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

var db = firebase.firestore();
db.collection("users").add({
    name: "Display Name",
    email: "Email",
})
var handleSignedInUser = function(user) {
  document.getElementById('sign-in').style.display = 'none';
  document.getElementById('user-signed-in').style.display = 'block';
  document.getElementById('name').textContent = user.displayName;
  document.getElementById('email').textContent = user.email;

  db.collection("users").doc(user.uid).set({
      name: user.displayName,
      email: user.email,
  })

// Displays the UI for a signed out user.
var handleSignedOutUser = function() {
  document.getElementById('sign-in').style.display = 'block';
  document.getElementById('user-signed-in').style.display = 'none';
  ui.start('#firebaseui-auth-container', uiConfig);
};

firebase.auth().onAuthStateChanged(function(user) {
  user ? handleSignedInUser(user) : handleSignedOutUser();
});

var initApp = function() {
  document.getElementById('sign-out').addEventListener('click', function() {
    firebase.auth().signOut();
  });
}

window.addEventListener('load', initApp);

var mainTxt = document.getElementById("mainTxt");
var submitBtn = document.getElementById("submitBtn");





/*
 googleSignIn=()=>{
   provider = new firebase.auth.GoogleAuthProvider();
   firebase.auth().signInWithPopup(provider).then(function(result){
     console.log(result)
     console.log("Success. Google Account Linked")
   }).catch(function(err){
     console.log(err)
     console.log("Fail")
   });
 }
*/
