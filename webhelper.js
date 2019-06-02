window.onload = setup;

/* Globals */
const classes=["b","w","e","n"];
var turns=[];
var buttonElement = document.getElementById("next");
var title = document.getElementById("title");
var board = document.getElementById("board");
var rows = document.getElementById("rows");
var allStones = rows.getElementsByTagName("li");
var deadstones=document.getElementById("deadstones");
var scoreboard=document.getElementById("scoreboard");
var messages=document.getElementById("messages");
var turn=-1;
var row=-1;
var column=-1;
var allCaptures=[0,0];
var newCaptures=[];
var oldCaptures=[];
var backwards = false;

function setup() {
	title.innerHTML = "Go!";
	buttonElement.innerHTML = "Next";
	turns=firstGame(turns);
	buildBoard();
	/* auto-advance */
	/*
	for (i=1;i<17;i++){
		turn++;
		nextTurn("next");
	}
	*/
}

/* Main */
function main() {
	if(backwards==true){
		backwards=false;
		nextTurn();
	}
	else {
		turn++;
		nextTurn();
	}
}

function reverseMain(){
	if(backwards==false){
		backwards=true;
		removeLastTurn();
	}
	else{
		turn--;
		removeLastTurn();
	}
}

function removeLastTurn(){
	if(turn<0){
		alert("Game empty press next button");
	}
	else{
		nextTurn();
	}
}

function firstGame(turns){
	turns = [[4,3,"b",[]],[4,5,"w",[]],[4,4,"b",[]],[3,5,"w",[]],[5,5,"b",[]],[5,6,"w",[]],[6,6,"b",[]],[6,5,"w",[]],[5,4,"b",[]],[7,6,"w",[]],[6,7,"b",[]],[7,7,"w",[]],[6,4,"b",[]],[7,5,"w",[]],[4,6,"b",[]],[5,7,"w",[]],[4,7,"b",[]],[6,8,"w",[6,6],[6,7]],[2,5,"b",[]],[3,6,"w",[]],[2,6,"b",[]],[3,7,"w",[]],[3,4,"b",[]],[4,1,"w",[]],[2,7,"b",[]],[4,8,"w",[4,6],[4,7]],[2,1,"b",[]],[6,2,"w",[]],[5,2,"b",[]],[5,1,"w",[]],[7,2,"b",[]],[2,2,"w",[]],[1,2,"b",[]],[6,3,"w",[]],[7,3,"b",[]],[7,1,"w",[]],[7,4,"b",[]],[2,3,"w",[]],[3,1,"b",[]],[2,4,"w",[]],[3,2,"b",[]],[1,5,"w",[]],[1,6,"b",[]],[1,1,"w",[]],[1,4,"b",[]],[1,3,"w",[]],[0,5,"b",[1,5]],[0,2,"w",[1,2]],[0,4,"b",[]],[0,3,"w",[]],[5,3,"b",[]],[6,1,"w",[]],[8,1,"b",[]],[1,0,"w",[]],[7,0,"b",[]],[8,2,"w",[]],[8,3,"b",[8,2]],[6,0,"w",[]],[4,0,"b",[]],[2,0,"w",[]],[3,0,"b",[]],[0,7,"w",[]],[1,7,"b",[]],[8,5,"w",[]],[4,2,"b",[]],[8,0,"w",[7,0]],[8,2,"b",[]],[8,4,"w",[]],[7,0,"b",[8,0]],[2,8,"w",[]],[1,8,"b",[]],[8,0,"w",[7,0]],[0,1,"b",[]],[0,0,"w",[0,1]],[7,0,"b",[8,0]],[0,6,"w",[]],[0,8,"b",[0,6],[0,7]],[8,0,"w",[7,0]],[0,6,"b",[]],[3,8,"w",]];
	gameMessages=[[18,"First capture of the game"],[26,"b has been captured again"],[47,"b\'s first capture"],[48,"w retaliates by capturing another one of b\'s stone"],[57,"b makes another capture to try to make up for lost ground"],[72,"We got ourselves a back \'n\' forth going on here"],[74,"w makes a new capture"]];
	return turns;
}

function buildBoard(){
	while (rows.hasChildNodes()) {
		rows.removeChild(rows.firstChild);
	}
	for (let row=0;row<9;row++){
		var newRow = document.createElement("li");
		var rowNode = document.createElement("ul");
		rowNode.className = "row";
		for (let col=0;col<9;col++){
			var turnNode = document.createElement("li");
			turnNode.className="e";
			rowNode.appendChild(turnNode);
		}
		newRow.appendChild(rowNode);
		rows.appendChild(newRow);
	}
}

/* Next Turn works forwards and backwards */
function nextTurn(){
	if (turn+1 <= turns.length) {
		// check for old captures and remove red circles from board
		if (backwards==false && turn>1 && turns[turn-1][3][0]>-1) oldCaptures=removeColoredCaptures(oldCaptures);
		// place new stone with color of current turn or empty if going backwards
		placeStone(turn);
		// check for new captures going forwards and remove them, leaving red circles
		if (backwards==false  && turns[turn][3][0]>-1) oldCaptures=removeCaptures(turn);
		// check for old captures going backwards and add red circles
		else if (backwards==true && turns[turn-2][3][0]>-1) oldCaptures=addRedCaptures(turn-2);
		// check for new captures going backwards and add black or white circles
		else if (backwards==true && turns[turn-1][3][0]>-1) oldCaptures=addUncaptured(turn-1);
		// closing the else's
		else oldCaptures=[];
		message = (backwards==false) ? showMessage(turn) : showMessage(turn-1);
	}
	else alert("End of game.");
}

/* Get Stone Count works the same forwards and backwards */
function getStoneCount(row,column){
	// each LI is a stone.  What should the count be?
	let stoneCount=(row)*9+column+1;
	// alter LI count by ignoring the extra row LIs
	let stoneCountAdjustment=(Math.floor((stoneCount-1)/9));
	stoneCount=stoneCount+stoneCountAdjustment;
	return stoneCount;
}

function placeStone(turn){
	row = turns[turn][0];
	column = turns[turn][1];
	color = (backwards==false) ? turns[turn][2] : "e";
	let stoneCount=getStoneCount(row,column);
	let newStone = allStones[stoneCount];
	// determine color based on function parameter indicating next / previous
	newStone.className = color;
	console.log("Turn: "+(turn+1)+" row: "+row+" column: "+column+" color: "+color);
}

/* Remove Captures works forwards only */
function removeCaptures(turn){
	newCaptures=createCapturesArray(turn);
	addCapturesToScore(newCaptures,color);
	colorCaptures(captures,"captured");
	oldCaptures=newCaptures.slice();
	newCaptures=[];
	return oldCaptures;
}

/* Create Captures Array works forwards and backwards */
function createCapturesArray(turn){
	captures=[];
	// populate captures array and color them red
	for (let stone = 3; stone < turns[turn].length; stone++){
		captures.push(turns[turn][stone]);
	}
	return captures;
}

/* Color Captures works backwards & forwards */
function colorCaptures(captures, color){
	for (let stone = 0; stone < captures.length; stone++){
		let row=captures[stone][0];
		let column=captures[stone][1];
		let stoneCount=row*9+column+1;
		stoneCount=getStoneCount(row,column);
		let newStone = allStones[stoneCount];
		newStone.className=color;
	}
}

/* removeColoredCaptures works forwards only */
function removeColoredCaptures(captures){
	colorCaptures(captures, "e");
	oldCaptures=[];
	return oldCaptures;
}

/* Add Red Captures works backwards only */
function addRedCaptures(turn){
	oldCaptures=createCapturesArray(turn);
	colorCaptures(captures, "captured");
	return oldCaptures;
}

/* Add UnCaptured works backwards */
function addUncaptured(turn){
	captures=createCapturesArray(turn);
	color=turns[turn-1][2];
	colorCaptures(captures,color);
	let capScore=captures.length
	addCapturesToScore(captures,turns[turn][2]);
	oldCaptures=[];
	return oldCaptures;
}



/* Add Captures to Score works forwards and backwards */
function addCapturesToScore(captures,color){
	let classElement=0;
	while(classes[classElement]!=color){
		classElement++;
	}
	if(backwards==false){
		allCaptures[classElement]+=captures.length;
	}
	else{
		allCaptures[classElement]-=captures.length;
	}
	refreshBox(scoreboard,allCaptures.join("|"), "text");
	graveyard=deadstoneFiller(allCaptures);
	refreshBox(deadstones,graveyard, "node");
}


/* Deadstone filler works forwards */
function deadstoneFiller(allCaptures){
	var graveyard = document.createElement("ul");
	for (let stoneColor=0;stoneColor<2;stoneColor++){
		for (let stoneCount=0;stoneCount<allCaptures[stoneColor];stoneCount++){
			var newStone = document.createElement("li");
			newStone.className = classes[1-stoneColor];
			graveyard.appendChild(newStone);
		}
	}
	return graveyard;
}

/* refreshBox works forwards and backwards */
function refreshBox(element,newValue,type){
	var newContent = document.createElement("div");
	newContent.className = "content";
	if (type=="text"){
		var textnode = document.createTextNode(newValue);
		newContent.appendChild(textnode);
	}
	else if (type=="node"){
		newContent.appendChild(graveyard);
	}
	else alert("Wrong type specified in refreshBox call parameter 3");
	var elementKids=element.childNodes[3];
	element.replaceChild(newContent,elementKids);
}

/* showMessage works forwards and backwards */
function showMessage(turn){
	// cycle through all messages
	let messageMatch=0;
	message="";
	while (messageMatch < gameMessages.length){
		// see if there is a message for this turn
		if (gameMessages[messageMatch][0]==turn+1) {
			message=gameMessages[messageMatch][1];
		}
		messageMatch++;
	}
	refreshBox(messages,message,"text");
	return message;
}

