var config = {
  apiKey: "AIzaSyABZJzOexhNRGJZjpnlE9qIw84XFKhdpr8",
  authDomain: "where-at-dhs.firebaseapp.com",
  databaseURL: "https://where-at-dhs.firebaseio.com",
  projectId: "where-at-dhs",
  storageBucket: "where-at-dhs.appspot.com",
  messagingSenderId: "292287566533"
};
firebase.initializeApp(config);

var handleSignedInUser = function(user) {
  var player = document.getElementById("name");
  player.textContent = user.displayName;
}
firebase.auth().onAuthStateChanged(function(user) {
  if(!user) {
    window.location = 'index.html'; //If User is not logged in, redirect to login page
  }
  else {
    handleSignedInUser(user);
  }

});
