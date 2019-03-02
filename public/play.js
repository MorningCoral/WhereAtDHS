

firebase.auth().onAuthStateChanged(function(user) {
  if(!user) {
    window.location = 'index.html'; //If User is not logged in, redirect to login page
  }
  else {
    handleSignedInUser(user);
  }

});

var handleSignedInUser = function(user) {
    // scoring system
}
