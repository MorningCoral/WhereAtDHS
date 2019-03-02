firebase.auth().onAuthStateChanged(function(user) {
    if(!user) {
        //If User is not logged in or user sign out
        window.location = 'index.html';
    }
    else {
        var adminRef = db.collection("admins").doc(user.uid);
        adminRef.get().then(function(thisDoc) {
            if (!thisDoc.exists) {
                window.location = 'home.html';
            }
            else {
                handleAdmins(user);
            }
        });

    }

});

var handleAdmins = function(user) {
    // Display name
    document.getElementById('name').textContent = user.displayName;
}
