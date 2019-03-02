

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

storageRef.child('qnimages/bomb.png').getDownloadURL().then(function(url) {
  // `url` is the download URL for 'images/stars.jpg'

  // This can be downloaded directly:
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function(event) {
    var blob = xhr.response;
  };
  xhr.open('GET', url);
  xhr.send();

  // Or inserted into an <img> element:
  var img = document.getElementById('qnimg');
  img.src = url;
}).catch(function(error) {
    console.log(error)
  // Handle any errors
});

storageRef.child('qnchoices/Q1-Choices.txt').getDownloadURL().then(function(url) {
  // `url` is the download URL for 'images/stars.jpg'

  // This can be downloaded directly:
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function(event) {
    var blob = xhr.response;
  };
  xhr.open('GET', url);
  xhr.send();

  // Or inserted into an <img> element:
  document.getElementById('op1') = url;
}).catch(function(error) {
    console.log(error);
  // Handle any errors
});
