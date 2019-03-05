const TOTALQNSTORED = 14; // change to 15
const NUMQNS = 7; // change to 10
const TIMESEC = 15;
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
var qnNumDiv = document.getElementById("qnNum");
var displayDiv = document.querySelector('#timerndisplay');
var choiceclass = document.getElementsByClassName("choice");
var choicesDiv = document.getElementById("choices");
var qnaDiv = document.getElementById('Q&A');
var ptsDiv = document.getElementById("points");
var scoreDiv = document.getElementById("score");
var nextBtn = document.getElementById("nextQnBtn");
var img = document.getElementById('qnimg');
var imageDiv = document.getElementById("image");
var plagameBlock = document.getElementById("playgame");
var endgameBlock = document.getElementById("endgame");
var gameEnd = false;

firebase.auth().onAuthStateChanged(function(user) {
    if(!user) {
        console.log("not logged in");
        window.location = 'index.html'; //If User is not logged in, redirect to login page
    }
    else {
        handleSignedInUser(user);
    }

});

function handleSignedInUser(user) {
    // scoring system
    qnArr = shuffle(qnArr).slice(0,NUMQNS);
    console.log(qnArr);
    currQnNum = 1; // start with question 1
    scoreDiv.innerText = 'Score: ' + score.toString();
    startNewQn();

    if(gameEnd) {
        endgamefunctions(user);
    }
}

function startNewQn() {
    console.log("Question" + currQnNum.toString());
    if (currQnNum <= NUMQNS) {
        qnID = qnArr[currQnNum-1];
        retrieveQn(qnID);
        console.log("new qn");
        console.log("start score: " + score);
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

                img.src = url;
            })

            setTimeout(displayOptions, 3500,doc);
            setTimeout(startTimer,3000,TIMESEC,displayDiv);

        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}
function displayOptions(doc) {
    retrieveOptions(doc);
    choicesDiv.style.display = 'block';
    qnaDiv.innerText = doc.data().question;
    qnaDiv.style.display = 'block';
    qnNumDiv.innerText = "Question " + currQnNum.toString();
    qnNumDiv.style.display = 'block';
    image.style.display = 'block';
}
function retrieveOptions(doc) {
    var optIndexArr  = [];
    // create array of indexes for options
    for (var i = 0; i < 4; i++) {
        optIndexArr.push(i);
    }
    optIndexArr = shuffle(optIndexArr); // shuffle indexes
    // display shuffled options
    for (var i = 0; i < 4; i++) {
        var r = optIndexArr[i];
        choiceclass[i].innerText = doc.data().options[r];
        if (doc.data().options[r] == doc.data().answer) {
            ansIndex = i;
        }
    }
}


var startTime, endTime;

function startTimer(duration, displayDiv) {
    console.log("start");
    var gameOn = true;
    var timer = duration, seconds;

    for (var i = 0; i < choiceclass.length; i++) {
        choiceclass[i].addEventListener("click", function() {
            if(gameOn) {
                gameOn = false;
                console.log("clicked");
                endTime = Date.now();
                clearInterval(timer);

                console.log(this);
                revealAns(this,startTime,endTime);
            }

        });
    };

    setInterval(function () {
        seconds = parseInt(timer % 60, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;
        if(seconds == TIMESEC) {
            startTime = Date.now();
        }

        if (gameOn == true) {
            displayDiv.innerText = seconds;
            displayDiv.style.display = 'block';
        }
        if (--timer < 0 && gameOn == true) {
            clearInterval(timer);
            revealAns(null, null,null);
        }
    }, 1000);
};


function revealAns(selected,startTime,endTime) {

    answer = currqndoc.data().answer;
    if (selected == null) {
        displayDiv.innerText = "Time's Up!";
        ptsDiv.innerText = '0 Points :(';

    }
    else if (selected.innerText == answer) {
        displayDiv.innerText = 'Correct!';
        points = 100 + Math.round((startTime-endTime)/(10*15));
        score = score + points;
        console.log("end score:" + score.toString());
        ptsDiv.innerText = points.toString() + ' Points';
        ptsDiv.style.display = 'block';
        scoreDiv.innerText = 'Score: ' + score.toString();

    }
    else {
        displayDiv.innerText = 'Wrong!';
        ptsDiv.innerText = '0 Points :(';
        ptsDiv.style.display = 'block';
        selected.classList.add("wrongStyle");
    }
    choiceclass[ansIndex].classList.add("correctStyle");
    qnaDiv.innerText = currqndoc.data().explanation;
    if (currQnNum == NUMQNS) {
        nextBtn.innerText = 'Finish';
        comparehighscore();
    }
    nextBtn.style.display = 'block';
}

nextBtn.addEventListener("click", function(){
    currQnNum += 1;
    if (currQnNum > NUMQNS) {
        plagameBlock.style.display = 'none';
        endgamefunctions();
    }
    nextBtn.style.display = 'none';
    for (var i = 0; i < choiceclass.length; i++) {
        choiceclass[i].classList.remove("wrongStyle");
        choiceclass[i].classList.remove("correctStyle");
    }
    ptsDiv.style.display = 'none';
    choicesDiv.style.display = 'none';
    qnaDiv.style.display = 'none';
    qnNumDiv.style.display = 'none';
    imageDiv.style.display = 'none';
    displayDiv.style.display = 'none';
    startNewQn();
});


var finalscore = document.getElementById('finalscore');
var newhighscore = document.getElementById('highscore');
var replayBtn = document.getElementById('tryagain');
var gohomeBtn = document.getElementById('gohome');

function comparehighscore() {
    var user = firebase.auth().currentUser;
    var userdocRef = db.collection("users").doc(user.uid);
    userdocRef.get().then(function(doc) {
        if (score > doc.data().highscore) {
            userdocRef.set({
                highscore: score,
            })
        }
    })
};

function endgamefunctions() {
    var user = firebase.auth().currentUser;
    var userdocRef = db.collection("users").doc(user.uid);
    console.log("game end")

    userdocRef.get().then(function(doc) {
        setTimeout(retrieveHighscore,3000,doc)
        finalscore.innerText = score;
    });
    replayBtn.addEventListener("click", function(){
        window.location = 'play.html';
    });
    gohomeBtn.addEventListener("click", function(){
        window.location = 'home.html';
    })


    function retrieveHighscore(doc) {
        newhighscore.innerText = doc.data().highscore;
        endgameBlock.style.display = 'block';
    }

}
window.onload = function () {

};
