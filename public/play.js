const TOTALQNSTORED = 3;
const NUMQNS = 2;
const TIMER = 10;
var arr = [];
for (var i = 1; i <= TOTALQNSTORED; i++) {
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

var currqndoc;
var display = document.querySelector('#timer');
var choiceclass = document.getElementsByClassName("choice");
var ansIndex;
var retrieveQn = function(ID) {
    db.collection("questions").where("ID", "==", ID)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                currqndoc = doc;
                document.getElementById('currQn').innerText = doc.data().question;
                var optIndexes = [];
                for (var i = 0; i < 4; i++) {
                    optIndexes.push(i);

                }
                optIndexes = shuffle(optIndexes);
                console.log(optIndexes);
                for (var i = 0; i < 4; i++) {
                    r = optIndexes[i];
                    choiceclass[i].innerHTML = doc.data().options[r];
                    if (r==0) {
                        ansIndex = i;
                    }
                }

            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
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

    startTimer(TIMER, display);
    console.log("new");

}


var startTime, endTime;
function startTimer(duration, display) {
    console.log("start");
    startTime = Date.now();
    var gameon = true;
    var timer = duration, seconds;

    for (var i = 0; i < choiceclass.length; i++) {
        choiceclass[i].addEventListener("click", function(){
            console.log("clicked");
            endTime = Date.now();
            clearInterval(timer);
            gameon = false;
            score = 1000 + (startTime-endTime)/2;
            revealAns(this);
        });
    };

    setInterval(function () {
        seconds = parseInt(timer % 60, 10);
        seconds = seconds < 10 ? "0" + seconds : seconds;
        if (gameon == true) {
            display.innerHTML = seconds;
        }
        if (--timer < 0 && gameon == true) {
          clearInterval(timer);
          display.innerHTML = "Time's Up!";
        }
    }, 1000);
};

function revealAns(selected) {
    answer = currqndoc.data().answer;
    console.log(selected.innerHTML);
    console.log(answer);
    console.log(ansIndex);
    if (selected.innerHTML == answer) {
        display.innerHTML = 'Correct!';
    }
    else {
        display.innerHTML = 'Wrong!';
        selected.classList.add("wrongStyle");
    }
    choiceclass[ansIndex].classList.add("correctStyle");
}

window.onload = function () {

};
