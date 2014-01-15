var game = {};
var state = "start";
var score = 0;
var nextScore = 1000;
var tickTime = 500;

function getGame() {
	return game;
}

function setGame(g) {
	game = g;
}

function addScore(i) {
	score = score + i.num;
}

function gameOver() {
	init();
	score = 0;
	nextScore = 0;
	tickTime = 500;
	state = "start";
}

function handleInput(e) {
	if (e.keyCode === 80 && state === "paused") {
		state = "running";
		doTick();
		return;
	}
	if (e.keyCode === 13 && state === "start") {
		state = "running";
		doTick();
		return;
	}
	else if (state !== "running") {
		return;
	}
			
	if (e.keyCode === 32) {
		update();
	}
	else if (e.keyCode === 38) {
		rotateLeft();
	}
	else if (e.keyCode === 40) {
		rotateRight();
	}
	else if (e.keyCode === 37) {
		moveLeft();
	}
	else if (e.keyCode === 39) {
		moveRight();
	}
}

function rand() {
	return new Wyscript.Integer(Math.floor(Math.random() * 7));
}

function doTick() {
	if (state !== "running")
		return;
	if (score > nextScore) {
	    nextScore = nextScore + 1000;
	    tickTime = ~~(tickTime * 0.8);
	 }
	update();
	setTimeout(function() { doTick();}, tickTime);
}

function draw() {
	var canvas = document.getElementById("canvas");
	canvas.width = (600);
	
	var g = canvas.getContext("2d");
	g.fillStyle = "black";
	g.fillRect(0, 0, 600, 600);
	
	
	g.font = "bold 36px serif";
	g.strokeStyle = "#00CC00";
	g.fillStyle = "#00CC00";
	
	if (state === "paused") {
		g.strokeText("PRESS 'P' TO", 100, 200);
		g.strokeText("CONTINUE/RESTART", 100, 240);
		return;
	}
	if (state === "start") {
		g.strokeText("PRESS 'ENTER' TO", 100, 200);
		g.strokeText("BEGIN THE GAME", 100, 240);
		return;
	}
	g.strokeText("WYTRIS", 225, 50);
	
	g.rect(450, 125, 100, 100);
	g.stroke();
	g.strokeText("NEXT", 450, 100);
	g.strokeText("SCORE: " + score, 25, 100);
	
	
	
	g.strokeStyle = "#00CC00";
	
	g.moveTo(200.5, 590.5);
	var x = 200.5;
	var y = 190.5;
	var i, j;
	
	//First, draw the lines
	for (i = 0; i < 11; i++) {
		g.lineTo(x, y);
		x = x + 20;
		g.moveTo(x, 590.5);
	}
	x = 400.5;
	y = 190.5;
	for (i = 0; i < 21; i++) {
		g.moveTo(200.5, y);
		g.lineTo(x, y);
		y = y+20;
	}
	g.stroke();
	
	//Fill in the next box lines
	x = 470.5
	y = 225.5
	for (i = 1; i < 5; i++) {
		g.moveTo(x, 125.5);
		g.lineTo(x, y);
		x = x + 20;
	}
	
	x = 550.5
	y = 145.5
	for (i = 1; i < 5; i++) {
		g.moveTo(450.5, y);
		g.lineTo(x, y);
		y = y + 20;
	}
	
	drawGame(g);
}

function drawGame(g) {
	var grid = [];
	var i = 0;
	var j = 0;
	var block = game.getValue("current");
	var next = game.getValue("nextBlock");
	
	for (i = 0; i < 10; i++) {
		grid[i] = game.getValue("board").getValue(i).list;
	}
	
	//Fill in the grid
	for (i = 0; i < 10; i++) {
		for (j = 0; j < 20; j++) {
			if(grid[i][j])
				g.fillRect(201 + 20*i, 191 + 20*j, 18, 18);
		}
	}
	
	var pieces = calculatePieces(block);
	var nextPieces = calculatePieces(next);
	var pieceGrid = [];
	var nextPieceGrid = [];
	for (i = 0; i < 4; i++) {
		pieceGrid[i] = pieces.getValue(i).list;
		nextPieceGrid[i] = nextPieces.getValue(i).list;
	}
	
	var x = block.getValue("x").num;
	var y = block.getValue("y").num;
	
	//Draw the current block and the next block
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			if (pieceGrid[i][j])
				g.fillRect(201 + ((i + x)*20), 191 + ((j + y)*20), 18, 18);
			if (nextPieceGrid[i][j])
				g.fillRect(471 + i*20, 146 + j*20, 18, 18);
		}
	}
}
