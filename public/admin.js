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

var selectedFile;
function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#preview').attr('src', e.target.result);
            };
            selectedFile = input;
            var uploadTask = storageRef.child('/qnimages/' + input.name).put(input.files[0]);

            selectedFile = input.files[0];
            reader.readAsDataURL(selectedFile);
        }
    }

function upload() {
    // check if all fields are filled
    console.log(selectedFile.name);

};

// Listen for state changes, errors, and completion of the upload.
