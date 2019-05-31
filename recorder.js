
/* Globals */
var newGame = [];
var newTurn = -1;
var thisColor="w";
var whoNext=document.getElementById("thisTurnLabel");
var thisTurnArray=[];
var gameMessages=[];
var builder=false;
var recbutton = document.getElementById("recorder");
var recForm = document.getElementById("recording");

/* recordTurns - by Mr. M */
function recordTurns(){
  builder=true;
  //let fresh=prompt("New game (n) or add to this one (a)?")
  fresh="n";
  if (fresh=="n"){
    turns=[];
    turn=-1;
    buildBoard();
    thisColor="b";
  }
  else {
    thisColor=(newTurn%2==0) ? "b" : "w";
  }
  recbutton.setAttribute("id", "save");
  recbutton.setAttribute( "onClick", "saveGame()");
	recForm.classList.remove("hide");
  whoNext.innerHTML=thisColor+": row,col? <span class=\"req\">*</span>";
}	
8
/* saveATurn - by Mr. M*/
function saveATurn(){
  turn++;
  turns.push([]);
  let newTurnStone = document.getElementById("thisTurn").value;  
  saveAPosition(newTurnStone);
  let thisCaptures = parseInt(document.getElementById("thisCaptures").value); 
  captures=saveCaptures(thisCaptures);
  turns[turn].push(captures.slice(0,thisCaptures));
  //let newMessage = document.getElementById("thisMessage").value;
  //saveMessage(newMessage);
  console.log(turns);
  // whoNext.innerHTML=thisColor+": row,col? <span class=\"req\">*</span>";
  // nextTurn("next");
}

/* saveaPosition - by Mr. M*/
function saveAPosition(newTurnStone){
  let thisTurnStone = newTurnStone.split(",");
  turns[turn].push(parseInt(thisTurnStone[0]));
  turns[turn].push(parseInt(thisTurnStone[1]));
  let thisColor= (turn%2==0) ? "b" : "w";
  turns[turn].push(thisColor);
}

/* saveCaptures - by Mr. M*/
function saveCaptures(thisCaptures){
  captures=[];
  if (thisCaptures>0){
    let allCapturedStones = document.getElementById("thisCapturedStones").value;
    let thisCapturedStones=allCapturedStones.split(",");
    for (stone=0;stone<thisCaptures;stone++) {
      let captureSet=[thisCapturedStones[0],thisCapturedStones[1]];
      thisTurnArray.push(captureSet);
      thisCapturedStones.splice(0,2);
    }
  }
  return captures;
}


/* Create Captures: Passed Testing */
function createCaptures(builder){
	captures=[];
	for (let stone = 3; stone < turns[turn].length; stone++){
		captures.push(turns[turn][stone]);
	}
  return captures;
} 

/* Add Captures to Score */
function addCapturesToScoreboard(){
	player=(color=="b") ? 0 : 1;
	allCaptures[player]+=captures.length;
	refreshBox(scoreboard,allCaptures.join("|"), "text");
	graveyard=deadstoneFiller(allCaptures);
	refreshBox(deadstones,graveyard, "node");
}


/* saveMessage - by Mr. M*/
function saveMessage(newMessage){
  let pushMessage=[turn,newMessage];
  gameMessages.push(pushMessage);
  alert(gameMessages);
}

/* saveGame - by Mr. M*/
function saveGame() {
  alert("Game downloading....");
  recbutton.setAttribute("id", "save");
  var recbutton = document.getElementById("save");
  recbutton.setAttribute("id", "recorder");
  recbutton.setAttribute( "onClick", "recordTurns()");
}
