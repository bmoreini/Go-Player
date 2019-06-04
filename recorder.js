/* New Globals */
var newGame = [];
var thisColor="b";
var thisTurnArray=[];
var builder = false;
var tM=("This turn: ");
var turn=-1;

/* Save Form Processing */
var recTurn = document.getElementById("thisTurn");
var whoNext = document.getElementById("thisTurnLabel");
var recButton = document.getElementById("recorder");
var recForm = document.getElementById("recording");
var message = document.getElementById("thisMessage");
var newCaps = document.getElementById("thisCaptures");
var capStones = document.getElementById("thisCapturedStones");

/* recordTurns - by Mr. M */
function recordTurns(){
	builder=true;
	recForm.classList.remove("hide");
	fresh="n";
	/*
	let fresh=prompt("New game (n) or add to this one (a)?")
	*/
	if (fresh=="n"){
		turns=[];
		gameMessages=[];
		turn=-1;
		color="w";
	}
	else {
		turns=turns.slice(0,turn);
		gameMessages=trimMessages();
		color = (turn%2==0) ? "b" : "w";
	}
	refreshSubmitForm();
	recButton.setAttribute("id", "save");
	recButton.setAttribute( "onClick", "saveGame()");
}

/* Trim messages to cover up to the current turn only, since forking game */
function trimMessages(){
	let tempMessages=[];
	for (let message=0;message<gameMessages.length;message++){
		if (gameMessages[message][0]<=turn) tempMessages.push(gameMessages[message]);
	}
	return tempMessages;
}

/* show color and turn for each new turn submission */
function refreshSubmitForm(){
	turn++;
	color = (turn%2==0) ? "b" : "w";
	whoNext.innerHTML=turn+" : "+color+" : row,col? <span class=\"req\">*</span>";
}

/* save a new turn with the form using tM as an alert */
function saveTurn(){

	if (recTurn.value) {
		let tempTurn=savePosition(recTurn.value);
		//tM=tM.concat(turn + " stone: "+tempTurn.join(","));
	}
	else {
		alert("Enter turn first as row,column");
	}
	turns.push(tempTurn);
	if (message.value) {
		let tempMessage=saveMessage(message.value);
		//tM=tM.concat(" message "+ tempMessage.join(","));
	}
	if (newCaps.value) {
		let tempCaptures=parseCaptures(newCaps.value);
		//tM=tM.concat(JSON.stringify(tempCaptures));
	}
	else turns[turn].push([]);
	//alert(turn+" : "+JSON.stringify(turns));
	nextTurn();
	refreshSubmitForm();
}

/* saveaPosition - by Mr. M*/
function savePosition(turnText){
	let tempStone = turnText.split(",");
	tempTurn=[parseInt(tempStone[0]),parseInt(tempStone[1]),color];
	return tempTurn;
}

/* saveMessage: adds to gameMessages array */
function saveMessage(messageText){
	let tempMessage=[];
	tempMessage.push(turn,messageText);
	gameMessages.push(tempMessage);
	return tempMessage;
}

/* saveCaptures: creates captures array*/
function parseCaptures(capsCount){
	let index=0;
	let capStonesArray=capStones.value.split(",");
	let captureSet=[];
	for (stone=0;stone<capsCount;stone++) {
		captureSet=[parseInt(capStonesArray[index]),parseInt(capStonesArray[index+1])];
		turns[turn].push(captureSet);
		index+=2;
	}
	return turns[turn].slice(3,3+capsCount);
}


/* saveGame - see https://gyandeeps.com/json-file-write/
	and https://stackoverflow.com/questions/21012580/is-it-possible
	-to-write-data-to-file-using-only-javascript/21012689 */
function saveGame() {
	var FileSaver = require('file-saver');
	var fileContent = JSON.stringify(turns, null, 4);
	var fileName=prompt("Name the game - no spaces");
	FileSaver.saveAs(fileName+".json", fileContent, (err) => {
		if (err) {
			console.error(err);
			return;
		};
		console.log("File "+fileName+".json has been created");
	});
	var fileContent = JSON.stringify(gameMessages, null, 4);
	FileSaver.saveAs(fileName+"messages.json", fileContent, (err) => {
		if (err) {
			console.error(err);
			return;
		};
		console.log("File "+fileName+"messages.json has also been created");
	});
}
