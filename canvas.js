$_.iter = 0; 
 
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

function getMaxNeighbours() {
	return new $_.Integer( document.getElementById("max").value);
}

function getStartGrid(gridX, gridY) {
	var i;
	var j;	//Loop variables
	
	var tmpX, tmpY;
	var num = ~~(gridX.num*gridY.num/3);  //Number of initially filled squares
	
	var list = generate_grid(gridX, gridY);
	
	for (i = 0; i < num; i++) {
		tmpX = rand(gridX.num);
		tmpY = rand(gridY.num);
		j = list.list[tmpX].list[tmpY].num
		
		if (j === 0) {
			list.list[tmpX].list[tmpY] = new $_.Integer(1);
		}
		else {
			i--;
		}
	}
	return list;
	
}

function rand(max) {
	return Math.floor(Math.random() * max);
}

function animateWrapper(newGrid) {
	var iter = getIterations().num;
	if ($_.iter >= iter)
		return;
	setTimeout(function() {animate(newGrid);}, 1000);
	$_.iter++;
}

function animate(newGrid) {
	var x = getX();
	var y = getY();
	var min = getMinNeighbours();
	var max = getMaxNeighbours();
	var grid = (newGrid === undefined) ? getStartGrid(x, y) : newGrid;
	
	grid = gameOfLife(grid, x, y, min, max);
	animateWrapper(grid);
}

function draw(grid) {
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
		g.lineTo(x, y)
		y = y+6;
	}
	g.stroke();
	//Next, fill in the squares.
	
	for (i = 0; i < grid.length().num; i++) {
		for (j = 0; j < grid.list[i].length().num; j++) {
			if (grid.list[i].list[j].num == 1)
				g.rect(0.5 + 6*i, 0.5 + 6*j, 6, 6);
			}
	}
	g.stroke();
	g.fill();
}