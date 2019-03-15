

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
    // var adminRef = db.collection("admins").doc(user.uid);
    // adminRef.get().then(function(thisDoc) {
    //     if (thisDoc.exists) {
    //         // Is admin
    //         console.log("User is admin");
    //         var adminBtn = document.getElementById("adminBtn");
    //         adminBtn.style.display = 'block';
    //         adminBtn.addEventListener('click', function() {
    //             window.location = 'admin-page.html';
    //         });
    //     }
    //     else {
    //         console.log("User is not admin. ID: " + user.uid);
    //     }
    // });
    // Display name
    document.getElementById('name').innerText = user.displayName;
    // Display highscore
    var myhighscore = document.getElementById("myhighscore");
    userdocRef.get().then(function(doc) {
        myhighscore.innerText = doc.data().highscore;
    })
    var body = document.getElementById("body");
    setTimeout(function () {
        body.style.display = 'block';
    }, 2000);


    // redirect to play page
    var playBtn = document.getElementById("playBtn");
    playBtn.addEventListener("click", function() {
        window.location = 'play.html';
    });
    // logout function
    document.getElementById('logout').addEventListener('click', function() {
        firebase.auth().signOut();
    });
};
