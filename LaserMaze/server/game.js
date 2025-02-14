// array for mirror position
var arrayMirror = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

// array for names
var arrayNames = ["Einstein","Picasso","Freud"];

// for changing nickname
var saveBetween = ["empty"]

// for unblocking players in sequence
var unblock = 0;

// unblock playground
var unblockp;

var len;

// score
var score = 300;

// token
var token;

// join
var join;

// important mirrors turned
var important = 0;

// unimportant mirrors turned
var unimportant = 0;

// laser
var laser = 1;

// level
var level= 1;

// level increment
var levelIncrement =1;

// important mirrors to be turned level 1
var l1= 4;

// important mirrors to be turned level 2
var l2= 6;

// important mirrors to be turned level 3
var l3= 4;

// important mirrors to be turned level 4
var l4= 3;

function User(socket) {
	this.socket = socket;
	// assign a random number to User.
	this.id = "1" + Math.floor( Math.random() * 1000000000);
	
}

function Room() {
	this.users = [];
}

Room.prototype.addUser = function(user){
	len = this.users.length;
	this.handleOnUserMessage(user);
	
	
	// one player, block
	if (len == 0){console.log("One player here!");
	this.users.push(user);
	var room = this;
	
	// set avatar of first player
	user.id="Einstein";
	console.log(user.id);
	
	//send name to first player
	message = "Einstein";
	room.sendFirstNicks(message,user);
	
	message = "(Nicks) ";
	room.sendNicks(message);
	
	// handle user closing
	user.socket.onclose = function(){
		console.log(user.id + " left.");
		// send final message
		message = "(Leave)";
		room.removeAllUsers(message,user);
		len=0;

	}
	
	} // end of if
	
	// two players, block
	if (len == 1){console.log("Two players here!");
	this.users.push(user);
	var room = this;
	
	// set avatar of second user
	user.id="Dalai Lama";
	console.log(user.id);
	
	//send name to second player
	message = "Dalai Lama"
	room.sendFirstNicks(message,user);
	
	message = "(Nicks) ";
	room.sendNicks(message);
	
	// handle user closing
	user.socket.onclose = function(){
		console.log(user.id + " left.");
		// send final message
		message = "(Leave)";
		room.removeAllUsers(message,user);
		len=0;
	
	}
	} // end of if
	
	// three players, unblock
	if (len == 2){console.log("Three players here!");
	this.users.push(user);
	var room = this;
	
	// set avatar of third user
	user.id="Freud";
	console.log(user.id);
	
	//send name to third player
	message = "Freud";
	room.sendFirstNicks(message,user);
	
	message = "(Nicks) ";
	room.sendNicks(message);
	
    // unblock all players
	unblockp =1;
	var msg="Unblock";
	room.sendUnblock(msg,user);
	
	// start sequence 
	var msg="Sequence";
	room.sequence(msg,user);
	
	// handle user closing
	user.socket.onclose = function(){
		console.log(user.id + " left.");
		// send final message
		message = "(Leave)";
		room.removeAllUsers(message,user);
		len=0;
	}
	} // end of if
	// more than three players, already full, please return later, leave page
	else{}

	
};

// sendNicks to all players
Room.prototype.sendNicks = function(message){
	for (var i=0, len=this.users.length; i<len; i++){
		var message2 = "(Nicks) " + arrayNames[0] + ", " + arrayNames[1] + ", " + arrayNames[2] + ", ";
		this.users[i].socket.send(message2);
	}
};

// sendNick to append to public chat
Room.prototype.sendNickPublic = function(message,user){
	
	cutmessage = message;
	// cut message to get new nickname
	var newnick = cutmessage.slice(13, cutmessage.length);
	
	// loop to find user
	for (var i=0, len=this.users.length; i<len; i++){
			var message2 = "(publicNick) " + saveBetween[0] + " is now called " + newnick + "\n";
			this.users[i].socket.send(message2);			
	}
	
	
};

// change nicks in array
Room.prototype.changeNicks = function(message,user) {
	
	cutmessage = message;
	// cut message to get new nickname
	var newnick = cutmessage.slice(13, cutmessage.length);

	// loop to find user
	for (var i=this.users.length; i>=0; i--){
		if (this.users[i] === user){
			saveBetween[0] = user.id;
			this.users[i].id = newnick;
			arrayNames[i] = newnick;
		}
	}
	
};


// send first nicks
Room.prototype.sendFirstNicks = function(message,user) {
	// loop to find user
	for (var i=this.users.length; i>=0; i--){
		if (this.users[i] === user){
			var message2 = "(FirstNick) " + message;
			this.users[i].socket.send(message2);
		}
	}
};


// remove all players and send good bye message
Room.prototype.removeAllUsers = function(message,user) {
	
	message ="(Leave)";
	for (var i=0, len=this.users.length; i<len; i++){
		this.users[i].socket.send(message);
	}
	
	this.users.splice(0,1);
	this.users.splice(0,1);
	this.users.splice(0,1);
	
};
// remove single player
Room.prototype.removeUser = function(user) {
	// loop to find user
	for (var i=this.users.length; i>=0; i--){
		if (this.users[i] === user){
			this.users.splice(i,1);
		}
	}
};

// unblock all three players
Room.prototype.sendUnblock = function(message,user){
	
		for (var i=0, len=this.users.length; i<len; i++){
		this.users[i].socket.send(message);
		
	}
	
};


// sequence of players
Room.prototype.sequence = function(message,user){
	
	// unblock 0, unblock first player, block other two players
	if (unblock==0){
		var message1 = "(Open)";
		this.users[0].socket.send(message1);
		var message2 = "(Closed)";
		this.users[1].socket.send(message2);
		this.users[2].socket.send(message2);
		unblock=1;
	}
	// unblock 1, unblock second player, block other two players
	else if (unblock==1){
		var message1 = "(Open)";
		this.users[1].socket.send(message1);
		var message2 = "(Closed)";
		this.users[0].socket.send(message2);
		this.users[2].socket.send(message2);
		unblock=2;
	}
	// unblock 2, unblock third player, block other two players
	else if (unblock==2){
		var message1 = "(Open)";
		this.users[2].socket.send(message1);
		var message2 = "(Closed)";
		this.users[0].socket.send(message2);
		this.users[1].socket.send(message2);
		unblock=0;
		
	}
	
};

// sendAll message
Room.prototype.sendAll = function(message){
	for (var i=0, len=this.users.length; i<len; i++){
		this.users[i].socket.send(message);
	}
};
// sendAll message but me, change mirror of all other players for equality
Room.prototype.sendAllbutme = function(message,user){
		for (var i=0, len=this.users.length; i<len; i++){
		if (this.users[i] === user){
		}
		else {this.users[i].socket.send(message);}
	}

};

// send private message to first player
Room.prototype.sendPrivateMessageFirstPlayer = function(message,user,str){
	
	cutmessage1= message
	cutmessage2 = message
	
		for (var i=0, len=this.users.length; i<len; i++){
		if (this.users[i].id == str){
			var message = cutmessage1.slice(arrayNames[0].length+1, cutmessage1.length);
			var message2 = "(private) From " + user.id + ": " + message + "\n"; 
			this.users[i].socket.send(message2);
			
		}
		else {}
	}
	//send To message to sender
	for (var i=0, len=this.users.length; i<len; i++){
		if (this.users[i].id == user.id){
			var message = cutmessage2.slice(arrayNames[0].length+1, cutmessage2.length);
			var message2 = "(private) To " + arrayNames[0] + ": " + message + "\n"; 
			this.users[i].socket.send(message2);
			
		}
		else {}
	} 

};

// send private message to second player
Room.prototype.sendPrivateMessageSecondPlayer = function(message,user,str){
	
	cutmessage1= message
	cutmessage2 = message
	
		for (var i=0, len=this.users.length; i<len; i++){
		if (this.users[i].id == str){
			var message = cutmessage1.slice(arrayNames[1].length+1, cutmessage1.length);
			var message2 = "(private) From " + user.id + ": " + message + "\n"; 
			this.users[i].socket.send(message2);
			
		}
		else {}
	}
	//send To message to sender
	for (var i=0, len=this.users.length; i<len; i++){
		if (this.users[i].id == user.id){
			var message = cutmessage2.slice(arrayNames[1].length+1, cutmessage2.length);
			var message2 = "(private) To " + arrayNames[1] + ": " + message + "\n"; 
			this.users[i].socket.send(message2);
			
		}
		else {}
	} 

};

// send private message to third player
Room.prototype.sendPrivateMessageThirdPlayer = function(message,user,str){
	
	cutmessage1= message
	cutmessage2 = message
	
		for (var i=0, len=this.users.length; i<len; i++){
		if (this.users[i].id == str){
			var message = cutmessage1.slice(arrayNames[2].length+1, cutmessage1.length);
			var message2 = "(private) From " + user.id + ": " + message + "\n"; 
			this.users[i].socket.send(message2);
			
		}
		else {}
	}
	//send To message to sender
	for (var i=0, len=this.users.length; i<len; i++){
		if (this.users[i].id == user.id){
			var message = cutmessage2.slice(arrayNames[2].length+1, cutmessage2.length);
			var message2 = "(private) To " + arrayNames[2] + ": " + message + "\n"; 
			this.users[i].socket.send(message2);
			
		}
		else {}
	} 

};

// send public message to all
Room.prototype.sendPublicMessage = function(message,user){
		for (var i=0, len=this.users.length; i<len; i++){
			
		var message2 = "(public)" + user.id + ": " + message + "\n";
		this.users[i].socket.send(message2);
	}
	

};

// new game message
Room.prototype.newGame = function(message,user){
	
	
	for (var i=0, len=this.users.length; i<len; i++){
		var message = "(newGame)";
		this.users[i].socket.send(message);
	}
	
	// reset all relevant variables for new game
	arrayMirror=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	score = 300;
	important=0;
	unimportant=0;
	laser =1;
	level =1;
	levelIncrement =1;
	
};

// top score message
Room.prototype.topScoreMessage = function(message,user){
	
	
	for (var i=0, len=this.users.length; i<len; i++){
		var message = "(topScore)" + level + score +"\n";
		this.users[i].socket.send(message);
	}


};

// token message for score entry
Room.prototype.token = function(message,user){
	
	
	// generate random token
	// without this token, score entries will be tripled
		token = "(token)1" + Math.floor( Math.random() * 1000000000);
	
	for (var i=0, len=this.users.length; i<len; i++){
		this.users[i].socket.send(token);
		
	}


};



// normal score message
Room.prototype.normalScoreMessage = function(message,user){
	
	
	for (var i=0, len=this.users.length; i<len; i++){
		var message = "(normalScore)" + level + score +"\n";
		this.users[i].socket.send(message);
	}
	
	
};


// failure message
Room.prototype.failureMessage = function(message,user){
	
	
	for (var i=0, len=this.users.length; i<len; i++){
		var message = "(failure)" + "\n";
		this.users[i].socket.send(message);
	}
	
	
};

// game over message
Room.prototype.GameOver = function(message,user){
	
	
	for (var i=0, len=this.users.length; i<len; i++){
		var message = "(GameOver)" + "\n";
		this.users[i].socket.send(message);
	}
	
	
};



// print out arrayMirror
function print(){
	
	for (i=0; i < arrayMirror.length; i++){
	console.log(arrayMirror[i]);}
	
}


// check incoming messages
Room.prototype.handleOnUserMessage = function(user) {
	var room = this;
	user.socket.on("message", function(message) {
		
		// get private message for first player
		var str = message.slice(0, arrayNames[0].length+1)
		if ((str==arrayNames[0] + ":")&&(user.id==arrayNames[0])){
			// you want to send message to yourself?
			console.log("Send message to yoursef?")
			}
		else if ((str==arrayNames[0] + ":")&&(user.id!=arrayNames[0])){
			// send private message to recipient
			var str = message.slice(0, arrayNames[0].length)
			room.sendPrivateMessageFirstPlayer(message,user,str);
			
		}
		
		// get private message for second player
		var str = message.slice(0, arrayNames[1].length+1)
		if ((str==arrayNames[1] + ":")&&(user.id==arrayNames[1])){
			// you want to send message to yourself?
			console.log("Send message to yoursef?")
			}
		else if ((str==arrayNames[1] + ":")&&(user.id!=arrayNames[1])){
			// send private message to recipient
			var str = message.slice(0, arrayNames[1].length)
			room.sendPrivateMessageSecondPlayer(message,user,str);
			
		}
		
		// get private message for third player
		var str = message.slice(0, arrayNames[2].length+1)
		if ((str==arrayNames[2] + ":")&&(user.id==arrayNames[2])){
			// you want to send message to yourself?
			console.log("Send message to yoursef?")
			}
		else if ((str==arrayNames[2] + ":")&&(user.id!=arrayNames[2])){
			// send private message to recipient
			var str = message.slice(0, arrayNames[2].length)
			room.sendPrivateMessageThirdPlayer(message,user,str);
			
		}
			
		// get public message for all
		var str1 = message.slice(0, arrayNames[0].length+1)
		var str2 = message.slice(0, arrayNames[1].length+1)
		var str3 = message.slice(0, arrayNames[2].length+1)
		var str4 = message.slice(0, 12)
		if ((str1!==arrayNames[0] + ":")&&(str2!==arrayNames[1] + ":")&&(str3!==arrayNames[2] + ":")&&(str4!=="(changeNick)")&&(message!=="mirror1_0")&&(message!=="mirror1_1")
			&&(message!=="mirror2_0")&&(message!=="mirror2_1")&&(message!=="mirror3_0")&&(message!=="mirror3_1")&&(message!=="mirror4_0")&&(message!=="mirror4_1")&&(message!=="mirror5_0")&&(message!=="mirror5_1")&&(message!=="mirror6_0")&&(message!=="mirror6_1")&&(message!=="mirror7_0")&&(message!=="mirror7_1")&&(message!=="mirror8_0")&&(message!=="mirror8_1")&&(message!=="mirror9_0")&&(message!=="mirror9_1")&&(message!=="mirror10_0")&&(message!=="mirror10_1")&&(message!=="mirror11_0")&&(message!=="mirror11_1")&&(message!=="mirror12_0")&&(message!=="mirror12_1")&&(message!=="mirror13_0")&&(message!=="mirror13_1")&&(message!=="mirror14_0")&&(message!=="mirror14_1")&&(message!=="mirror15_0")&&(message!=="mirror15_1")&&(message!=="(laser)")&&(message!=="(newGame)")){
			room.sendPublicMessage(message,user);
			}
		
		
		// change nickname
		var str = message.slice(0,12)
		if (str=="(changeNick)"){
			room.changeNicks(message,user)
			room.sendNicks(message)
			room.sendNickPublic(message,user)
			
		} 
		
		// laser for all levels
		
		
		if (message=="(laser)"){
			// level 1
			if (level==1){a=0; b=1; c=0; d=1; e=1; f=1; g=0; h=0; j=l1;} else{}
			// level 2
			if (level==2){a=1; b=0; c=1; d=1; e=1; f=1; g=0; h=1; j=l2;} else {}
			// level 3
			if (level==3){a=1; b=0; c=1; d=0; e=1; f=0; g=1; h=0; j=l3;} else {}
			// level 4
			if (level==4){a=0; b=0; c=1; d=1; e=1; f=0; g=0; h=0; j=l4;} else {}
			
			
			// if only important mirrors are turned and are in right angle and first laser activation, extra bonus
			if ((level==levelIncrement)&&(laser==1)&&(arrayMirror[0]==a)&&(arrayMirror[1]==b)&&(arrayMirror[2]==c)&&(arrayMirror[3]==d)&&(arrayMirror[4]==e)&&(arrayMirror[5]==f)&&(arrayMirror[6]==g)&&(arrayMirror[7]==h)&&(important==j)&&(unimportant==0)){
				//score
				score = score + 50;     
				// send token
				if (level==1){room.token(); console.log(token);}
				// top score message
				message = "topScore";
				room.topScoreMessage(message,user);
				//reset
				important = 0;
				unimportant=0;
				laser= 1;
				levelIncrement = levelIncrement +1;
				level = level +1;
				arrayMirror = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				
			// set sequence
			if (level==5){}
			else{
			var message="Go";
			room.sequence(message,user);}
			

				
				
			}
			// if all important mirrors are turned and laser activation, unimportant== 0, important !==0
			else if ((level==levelIncrement)&&(laser<=2)&&(arrayMirror[0]==a)&&(arrayMirror[1]==b)&&(arrayMirror[2]==c)&&(arrayMirror[3]==d)&&(arrayMirror[4]==e)&&(arrayMirror[5]==f)&&(arrayMirror[6]==g)&&(arrayMirror[7]==h)&&(unimportant==0)&&(important!==0)){
				//score
				score = score + 20;
				// send token
				if (level==1){room.token(); console.log(token);}
				// success message
				message = "normalScore";
				room.normalScoreMessage(message,user);
				
				important = 0;
				unimportant=0;
				laser= 1;
				levelIncrement = levelIncrement +1;
				level = level +1;
				arrayMirror = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			
			// set sequence
			if (level==5){}
			else{
			var message="Go";
			room.sequence(message,user);}
			
			
			}
			// if all important mirrors are turned and laser activation, unimportant !==0, important !==0
			else if ((level==levelIncrement)&&(laser<=2)&&(arrayMirror[0]==a)&&(arrayMirror[1]==b)&&(arrayMirror[2]==c)&&(arrayMirror[3]==d)&&(arrayMirror[4]==e)&&(arrayMirror[5]==f)&&(arrayMirror[6]==g)&&(arrayMirror[7]==h)&&(unimportant!==0)&&(important!==0)){
				score = score + 20;
				// send token
				if (level==1){room.token(); console.log(token);}
				// success message
				message = "normalScore";
				room.normalScoreMessage(message,user);
				
				important = 0;
				unimportant=0;
				laser= 1;
				levelIncrement = levelIncrement +1;
				level = level +1;
				arrayMirror = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			
			// set sequence
			if (level==5){}
			else{
			var message="Go";
			room.sequence(message,user);}
			
			
			}
			// if not all important mirrors are turned and laser activation
			else if (laser<=2) {
			   score = score - 40;
			   // failure message
			   message = "failure";
			   room.failureMessage(message,user);

			   laser = laser +1;
			   
			// set sequence
			var message="Go";
			room.sequence(message,user);
			   
			   
			}
			// Game Over
			else {
				// Game Over message
				message = "GameOver";
				room.GameOver(message);
				
			}
				

			}
			
			
		// new Game	
		if (message=="(newGame)"){	
		var msg="(newGame)";
		room.newGame(msg,user);
		var message="Go";
		room.sequence(message,user);
		
		}
			
		// all the mirrors	
		// mirror 1_0
		if (message=="mirror1_0"){
			var msg="mirror1_0";
			room.sendAllbutme(msg,user);
			arrayMirror[0]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
		// mirror 1_1
		if (message=="mirror1_1"){
			var msg="mirror1_1";
			room.sendAllbutme(msg,user);
			arrayMirror[0]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
			
		// mirror 2_0
		if (message=="mirror2_0"){
			var msg="mirror2_0";
			room.sendAllbutme(msg,user);
			arrayMirror[1]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
		// mirror 2_1
		if (message=="mirror2_1"){
			var msg="mirror2_1";
			room.sendAllbutme(msg,user);
			arrayMirror[1]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
			
		// mirror 3_0
		if (message=="mirror3_0"){
			var msg="mirror3_0";
			room.sendAllbutme(msg,user);
			arrayMirror[2]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
		// mirror 3_1
		if (message=="mirror3_1"){
			var msg="mirror3_1";
			room.sendAllbutme(msg,user);
			arrayMirror[2]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
		
		// mirror 4_0
		if (message=="mirror4_0"){
			var msg="mirror4_0";
			room.sendAllbutme(msg,user);
			arrayMirror[3]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
		// mirror 4_1
		if (message=="mirror4_1"){
			var msg="mirror4_1";
			room.sendAllbutme(msg,user);
			arrayMirror[3]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
			
		// mirror 5_0
		if (message=="mirror5_0"){
			var msg="mirror5_0";
			room.sendAllbutme(msg,user);
			arrayMirror[4]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
		// mirror 5_1
		if (message=="mirror5_1"){
			var msg="mirror5_1";
			room.sendAllbutme(msg,user);
			arrayMirror[4]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
			
		// mirror 6_0
		if (message=="mirror6_0"){
			var msg="mirror6_0";
			room.sendAllbutme(msg,user);
			arrayMirror[5]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
		// mirror 6_1
		if (message=="mirror6_1"){
			var msg="mirror6_1";
			room.sendAllbutme(msg,user);
			arrayMirror[5]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
			
		// mirror 7_0
		if (message=="mirror7_0"){
			var msg="mirror7_0";
			room.sendAllbutme(msg,user);
			arrayMirror[6]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
		// mirror 7_1
		if (message=="mirror7_1"){
			var msg="mirror7_1";
			room.sendAllbutme(msg,user);
			arrayMirror[6]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}

		// mirror 8_0
		if (message=="mirror8_0"){
			var msg="mirror8_0";
			room.sendAllbutme(msg,user);
			arrayMirror[7]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
		// mirror 8_1
		if (message=="mirror8_1"){
			var msg="mirror8_1";		
			room.sendAllbutme(msg,user);
			arrayMirror[7]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			
			// score
			var i;
			if (level==1){i=l1;}
			if (level==2){i=l2;}
			if (level==3){i=l3;}
			if (level==4){i=l4;}
			
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else if (important>i){score = score - 20; important = important + 1;}
			else {important = important + 1;}
			console.log(score);
			}
		// mirror 9_0
		if (message=="mirror9_0"){
			var msg="mirror9_0";
			room.sendAllbutme(msg,user);
			arrayMirror[8]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}
		// mirror 9_1
		if (message=="mirror9_1"){
			var msg="mirror9_1";		
			room.sendAllbutme(msg,user);
			arrayMirror[8]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}
		// mirror 10_0
		if (message=="mirror10_0"){
			var msg="mirror10_0";
			room.sendAllbutme(msg,user);
			arrayMirror[9]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}
		// mirror 10_1
		if (message=="mirror10_1"){
			var msg="mirror10_1";		
			room.sendAllbutme(msg,user);
			arrayMirror[9]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}
		// mirror 11_0
		if (message=="mirror11_0"){
			var msg="mirror11_0";
			room.sendAllbutme(msg,user);
			arrayMirror[10]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}
		// mirror 11_1
		if (message=="mirror11_1"){
			var msg="mirror11_1";		
			room.sendAllbutme(msg,user);
			arrayMirror[10]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
		    if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}	
		// mirror 12_0
		if (message=="mirror12_0"){
			var msg="mirror12_0";
			room.sendAllbutme(msg,user);
			arrayMirror[11]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}
		// mirror 12_1
		if (message=="mirror12_1"){
			var msg="mirror12_1";		
			room.sendAllbutme(msg,user);
			arrayMirror[11]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}
		// mirror 13_0
		if (message=="mirror13_0"){
			var msg="mirror13_0";
			room.sendAllbutme(msg,user);
			arrayMirror[12]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}
		// mirror 13_1
		if (message=="mirror13_1"){
			var msg="mirror13_1";		
			room.sendAllbutme(msg,user);
			arrayMirror[12]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}
		// mirror 14_0
		if (message=="mirror14_0"){
			var msg="mirror14_0";
			room.sendAllbutme(msg,user);
			arrayMirror[13]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}
		// mirror 14_1
		if (message=="mirror14_1"){
			var msg="mirror14_1";		
			room.sendAllbutme(msg,user);
			arrayMirror[13]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}	
		// mirror 15_0
		if (message=="mirror15_0"){
			var msg="mirror15_0";
			room.sendAllbutme(msg,user);
			arrayMirror[14]=0;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}
		// mirror 15_1
		if (message=="mirror15_1"){
			var msg="mirror15_1";		
			room.sendAllbutme(msg,user);
			arrayMirror[14]=1;
			// set sequence
			var message="Go";
			room.sequence(message,user);
			if (score <= 0){var message="GameOver"; room.GameOver(message);}
			else {score = score - 30; unimportant = unimportant + 1;}
			console.log(score);
			}				
					
		
	});
	
	
};



module.exports.User = User;
module.exports.Room = Room;
