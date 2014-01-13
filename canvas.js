var grid = [];

function getX() {
 	return new $_.Integer(document.getElementById("width").value);
}

function getY() {
	return new $_.Integer( document.getElementById("height").value);
}

function getIterations() {
	return new $_.Integer( document.getElementById("iterations").value);
}

function getMinNeighbours() {
	return new $_.Integer( document.getElementById("min").value);
}

function doClick(e) {
	var posX = 0;
	var posY = 0;
	if (e.pageX || e.pageY) {
		posX = e.pageX;
		posY = e.pageY;
	}
	else if (e.clientX || e.clientY) {
		posX = e.clientX;
		posY = e.clientY;
	}
	
	var rect = document.getElementById("canvas").getBoundingClientRect();
	
	//Needed tweaking, no other way I could get it to work
	posX = posX - rect.left - 3;
	posY = posY - rect.top - 86;
	
	posX = ~~(posX/6);
	posY = ~~(posY/6);
	//x = ((posX - rect.left)\6);
	//y = ((posY - rect.top)\6);
	
	getGrid();
	grid[posY][posX] = (grid[posY][posX] === 1) ? 0 : 1;
}

function getMaxNeighbours() {
	return new $_.Integer( document.getElementById("max").value);
}

function getGrid() {
	if (grid[0] === undefined)
		setGrid(generate_grid(getX(), getY()));
  var i;
  var j;
  var list;
  var row;
  var result = new $_.List([], new $_.Type.List(new $_.Type.List(new $_.Type.Int())));
  
  for (i = 0; i < grid.length; i++) {
  		row = [];
  		for (j = 0; j < grid[i].length; j++) {
  			row[j] = grid[i][j];
  		}
  		list = new $_.List(row, new $_.Type.List(new $_.Type.Int()));
  		result.list[i] = list;
  	}
  	return result;
}

function setGrid (g) {
	
	var i = 0;
	var j = 0;
	for (i = 0; i < g.length().num; i++) {
		for (j = 0; j < g.list[i].length().num; j++) {
			if (grid[i] === undefined) 
				grid[i] = [];
				
			grid[i][j] = g.list[i].list[j].num
		}
	}
}

function rand(max) {
	return new $_.Integer(Math.floor(Math.random() * max.num));
}

function start() {
	$_.iter = 0;
	if ($_.isRunning === true)
	  return;
	$_.isRunning = true;
	animateWrapper();
}

function animateWrapper() {
	var iter = getIterations().num;
	if ($_.iter >= iter) {
		$_.iter = 0;
		$_.isRunning = false;
		return;
	}
	setTimeout(function() {animate();}, document.getElementById("speed").value);
	$_.iter++;
}

function animate() {
	var x = getX();
	var y = getY();
	var min = getMinNeighbours();
	var max = getMaxNeighbours();
	
	gameOfLife(x, y, min, max);
	animateWrapper();
}

function updateCanvas() {
	var canvas = document.getElementById("canvas");
	var g = canvas.getContext("2d");
	g.fillStyle = "black";
	
	canvas.width = (getX().num*6);
	canvas.height = (getY().num*6);
	
	g.moveTo(6.5, 0.5);
	var x = 6.5;
	var y = (canvas.height)-0.5;
	var i, j;
	
	//First, draw the lines
	for (i = 1; i < (canvas.width/6); i++) {
		g.lineTo(x, y);
		x = x + 6;
		g.moveTo(x, 0.5);
	}
	x = (canvas.width)+0.5;
	y = 6.5;
	for (i = 1; i < (canvas.height/6); i++) {
		g.moveTo(0.5, y);
		g.lineTo(x, y);
		y = y+6;
	}
	g.stroke();
	//Next, fill in the squares.
	
	for (i = 0; i < grid.length; i++) {
		for (j = 0; j < grid[i].length; j++) {
			if (grid[i][j] === 1)
				g.rect(0.5 + 6*i, 0.5 + 6*j, 6, 6);
			}
	}
	g.stroke();
	g.fill();
}
