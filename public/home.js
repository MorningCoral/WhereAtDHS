
var db = firebase.firestore();
firebase.auth().onAuthStateChanged(function(user) {
    if(!user) {
        //If User is not logged in or user sign out
        window.location = 'index.html';
    }
    else {
        handleSignedInUser(user);
    }

});


var handleSignedInUser = function(user) {
    var userdocRef = db.collection("users").doc(user.uid);
    userdocRef.get().then(function(thisDoc) {
        if (!thisDoc.exists) {
            //new user
            userdocRef.set({
                name: user.displayName,
                email: user.email,
                highscore: "0",
            })
        }
    });
    // Display name
    document.getElementById('name').textContent = user.displayName;
    // Display highscore
    var myhighscore = document.getElementById("myhighscore");
    userdocRef.get().then(function(doc) {
        myhighscore.innerText = doc.data().highscore;
    })
    // redirect to play page
    var playBtn = document.getElementById("playBtn");
    playBtn.addEventListener("click", redirectPlay);
    function redirectPlay() {
        window.location = 'play.html';
    }
    // logout function
    document.getElementById('logout').addEventListener('click', function() {
        firebase.auth().signOut();
    });
};
