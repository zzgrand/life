// stage: 0 - 2 (inclusive)
// if stage == 0
// then we are asking if the user wants to observe or decide
// if stage == 1
// then we are asking which observation they want to make
// if stage == 2
// then we are asking which decision they want to make

let stage = 0;

// time: subtracts whenever an observation is made

const TOTAL_TIME = 30;

let time = TOTAL_TIME;

const timer = setInterval(function() {
    time -= 1;

    if (time <= 0) {
        time = 0;
        stage = 2;

        updateStageText();

        clearInterval(timer);
    }

    updateTime();
}, 1000);

// observations, implications, decisions correspond to each other by index

const allObservations = [
    "She is a woman and you are a man.",
    "Confrontation of self onto percieved sex.",
    "She is white and you are black.",
    "She is a native, and you are a foreigner.",
    "Observation of self...",
];

const allImplications = [
    "You consider your historical position as a man...",
    "Perhaps they do identify as a woman...",
    "Reparations...",
    "Is she from here? What does that imply?",
    "If my only sense of self is being a man, what does that mean for ...",
];

const allDecisions = [
    "Move to the side.",
    "Run into the person.",
    "Take space, continue walking.",
    "Move to the side.",
    "Run into the person.",
];

const allResults = [
    "You fall and die.",
    "You become a social moore",
    "Something happens",
    "You fall and die.",
    "You become a social moore",
];

const playerDecisions = [];
const playerResults = [];

const TOTAL_OPTIONS = allObservations.length;

updateStageText();

// handle user input (main loop)
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", function(evt) {
    // prevent default button submit action of refreshing page
    evt.preventDefault();

    // grab user input
    const inputDiv = document.getElementById("userInput");
    const input = Number(inputDiv.value);

    if (stage == 0) { // input is response either making an observation or a decision
        // validate choice (has to be 1 or 2)
        if (input != 1 && input != 2) {
            displayInvalidInputError();
        } else {
            stage = input;

            if (stage == 2) {
                // set time to 0 manually
                time = 0;
            }

            updateStageText();
        }
    } else if (stage == 1) { // input is response to which observation they wanted to make
        // validate choice (has to be in the range of current available observatios)
        if (input < 1 || input > allObservations.length) {
            displayInvalidInputError()
        } else {
            // input is in correct range of observation list
            // get + remove the corresponding observation, implication, decision and result ...
            // ... at that position in the list of observations (- 1 for 0-based indexing)
            const observation = allObservations.splice(input - 1, 1);
            const implication = allImplications.splice(input - 1, 1);
            const decision = allDecisions.splice(input - 1, 1);
            const result = allResults.splice(input - 1, 1);

            // display an alert with the implication and resulting decision
            alert(implication);
            alert("You consider: " + decision)

            // if the decision is not already available to the player
            // then add it
            if (!playerDecisions.includes(decision)) {
                playerDecisions.push(decision);
            }

            if (!playerResults.includes(result)) {
                playerResults.push(result);
            }

            // subtract from time
            time -= ((TOTAL_TIME / TOTAL_OPTIONS) * 2);

            // if time is out, force them to make a decision
            // otherwise, allow them to choose to observe or decide

            if (time <= 0) {
                stage = 2;
            } else {
                stage = 0;
            }

            updateStageText();
        }
    } else if (stage == 2) { // input is response to which decision they want to make
        if (playerDecisions.length == 0) {
            // if the player did not make any observations (has found no decisions)
            // then do something, like give a special result message
            gameOver("Something weird happens.");
        } else if (input < 1 || input > playerDecisions.length) {
             // validate choice (has to be in the range of the decisions they discovered)
            displayInvalidInputError()
        } else {
            // grab the result at the index (- 1 again, for 0-based indexing)
            const result = playerResults[input - 1];
            gameOver(result);
        }
    }
});

function gameOver(message) {
    alert(message);
    document.body.innerHTML = "<h1>You are othered. Safety not guaranteed.</h1>"
}

function changeDialogue(message) {
    const dialogueDiv = document.getElementById("dialogue");
    dialogueDiv.innerHTML = message;
}

function changePrompt(message) {
    const promptDiv = document.getElementById("prompt");
    promptDiv.innerHTML = message;
}

function updateTime() {
    const timeDiv = document.getElementById("time");

    if (time <= 0) {
        time = 0;
        timeDiv.style = "color:red;";
        timeDiv.innerHTML = "You have run out of time.";
    } else {
        timeDiv.innerHTML = "You have " + Math.round(time) + " seconds left.";
    }
}

function updateStageText() {
    // first clear the input box
    const inputDiv = document.getElementById("userInput");
    inputDiv.value = "";

    updateTime();
    
    if (stage == 0) {
        changeDialogue("Setting/context.");
        changePrompt("(1) Observation<br>(2) Decision");
    } else if (stage == 1) {
        // loop through all the observations and list them out in a string
        const message = listToString(allObservations);
        changeDialogue(message);
        changePrompt("Choose an observation.");
    } else if (stage == 2) {
        const message = listToString(playerDecisions);
        changeDialogue(message);
        changePrompt("Make your decision.");
    } else {
        alert("An error has occured. Please refresh.");
    }
}

function displayInvalidInputError() {
    alert("Approach imminent, invalid option");
}

function listToString(list) {
    let message = "";
        
    // from 0 up to the current length of all observations
    for (let i = 0; i < list.length; i += 1) {
        const observation = list[i];
        // item's number in list, observation text, new line break
        message += (i + 1) + '. ' + observation + '<br>';
    }

    return message;
}