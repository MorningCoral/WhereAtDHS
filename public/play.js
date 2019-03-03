const TOTALQNS = 3;
var arr = [];
for (var i = 1; i <= TOTALQNS; i++) {
    arr.push(i);
}

function shuffle(arra1,n) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}
console.log(shuffle(arr).slice(0,2));

var retrieveQn = function(ID) {
    db.collection("questions").where("ID", "==", ID)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                document.getElementById('currQn').innerText = doc.data().question;
                var optIndexes = [];
                for (var i = 0; i < 4; i++) {
                    optIndexes.push(i);

                }
                optIndexes = shuffle(optIndexes);
                console.log(optIndexes);
                for (var i = 0; i < 4; i++) {
                    r = optIndexes[i];
                    choice = document.getElementsByClassName("choice");
                    choice[i].innerHTML = doc.data().options[r];
                }

            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

}

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
    retrieveQn(1);
}


retrieveQn(1);
storageRef.child('qnimages/qn1.jpg').getDownloadURL().then(function(url) {
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
