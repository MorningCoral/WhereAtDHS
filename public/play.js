const TOTALQNSTORED = 3;
const NUMQNS = 2;
const TIMER = 10;
var qnArr = [];
for (var i = 1; i <= TOTALQNSTORED; i++) {
    qnArr.push(i);
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



var currqndoc;
var currQnNum;
var ansIndex;
var score = 0;
var startTime, endTime;
var displayDiv = document.querySelector('#timerndisplay');
var choiceclass = document.getElementsByClassName("choice");
var qnaDiv = document.getElementById('Q&A');
var ptsDiv = document.getElementById("points")
var scoreDiv = document.getElementById("score")
var nextBtn = document.getElementById("nextQnBtn");




firebase.auth().onAuthStateChanged(function(user) {
  if(!user) {
    window.location = 'index.html'; //If User is not logged in, redirect to login page
  }
  else {
    handleSignedInUser(user);
  }

});

function handleSignedInUser(user) {
    // scoring system
    qnArr = shuffle(qnArr).slice(0,NUMQNS);
    currQnNum = 1; // start with question 1
    scoreDiv.innerHTML = 'Score: ' + score.toString();
    startNewQn();


}

function startNewQn() {
    console.log(currQnNum);
    if (currQnNum <= NUMQNS) {
        qnID = qnArr[currQnNum-1];
        console.log(qnID);
        retrieveQn(qnID);
        setTimeout(startTimer,2000,TIMER,displayDiv);
        console.log("new qn");
    }
    else {
        window.location = 'endgame.html';
    }
}

function retrieveQn(ID) {
    var imagelink ='';
    db.collection("questions").where("ID", "==", ID)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                currqndoc = doc;
                imagelink = doc.data().imageLink;
                imagelink = 'qnimages/' + imagelink;
                storageRef.child(imagelink).getDownloadURL().then(function(url) {
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
                })

                setTimeout(retrieveOptions, 2000, doc)

            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

function retrieveOptions(doc) {
    qnaDiv.innerText = doc.data().question;
    var optIndexArr  = [];
    for (var i = 0; i < 4; i++) {
        optIndexArr.push(i);

    }
    optIndexArr = shuffle(optIndexArr);
    console.log(optIndexArr);
    for (var i = 0; i < 4; i++) {
        r = optIndexArr [i];
        choiceclass[i].innerHTML = doc.data().options[r];
        if (r==0) {
            ansIndex = i;
        }
    }
}


var startTime, endTime;
function startTimer(duration, displayDiv) {
    console.log("start");
    startTime = Date.now();
    var gameOn = true;
    var timer = duration, seconds;

    for (var i = 0; i < choiceclass.length; i++) {
        choiceclass[i].addEventListener("click", function(){
            console.log("clicked");
            endTime = Date.now();
            clearInterval(timer);
            gameOn = false;
            points = 1000 + Math.round((startTime-endTime)/10);
            score += points;
            ptsDiv.innerHTML = points.toString() + ' Points';
            scoreDiv.innerHTML = 'Score: ' + score.toString();
            revealAns(this);
        });
    };

    setInterval(function () {
        seconds = parseInt(timer % 60, 10);
        seconds = seconds < 10 ? "0" + seconds : seconds;
        if (gameOn == true) {
            displayDiv.innerHTML = seconds;
        }
        if (--timer < 0 && gameOn == true) {
          clearInterval(timer);
          ptsDiv.innerHTML = '0 Points :(';
          revealAns(null);
        }
    }, 1000);
};

function revealAns(selected) {
    ptsDiv.style.display = 'block'
    answer = currqndoc.data().answer;
    if (selected == null) {
        displayDiv.innerHTML = "Time's Up!";
    }
    if (selected.innerHTML == answer) {
        displayDiv.innerHTML = 'Correct!';
    }
    else {
        displayDiv.innerHTML = 'Wrong!';
        selected.classList.add("wrongStyle");
    }
    choiceclass[ansIndex].classList.add("correctStyle");
    qnaDiv.innerHTML = currqndoc.data().explanation;
    nextBtn.style.display = 'block';
}

nextBtn.addEventListener("click", function(){
    currQnNum += 1;
    nextBtn.style.display = 'none';
    for (var i = 0; i < choiceclass.length; i++) {
        choiceclass[i].classList.remove("wrongStyle");
        choiceclass[i].classList.remove("correctStyle");
    }
    ptsDiv.style.display = 'none';
    startNewQn();
});

window.onload = function () {

};
