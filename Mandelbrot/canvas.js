var grid = [];

function getX() {
 	return new Wyscript.Tuple([new Wyscript.Real(document.getElementById("minX").value), new Wyscript.Real(document.getElementById("maxX").value)],
 										 new Wyscript.Type.Tuple([new Wyscript.Type.Real(), new Wyscript.Type.Real()]));
}

function getY() {
	return new Wyscript.Tuple([new Wyscript.Real(document.getElementById("minY").value), new Wyscript.Real(document.getElementById("maxY").value)],
 										 new Wyscript.Type.Tuple([new Wyscript.Type.Real(), new Wyscript.Type.Real()]));
}

function getIterations() {
	return new Wyscript.Integer( document.getElementById("iterations").value);
}

function setCanvas(x, y, colour) {
	var jsX = x.num;
	var jsY = y.num;
	if (grid[jsX] === undefined)
		grid[jsX] = [];
	grid[jsX][jsY] = colour;
}

function render() {
	var canvas = document.getElementById("canvas");
	canvas.width = 600
	canvas.height = 600
	var g = canvas.getContext("2d");
	
	var x = getX();
	var y = getY();
	var r;
	var g;
	var b;
	var colour;
	var iter = getIterations();
	
	mandelbrot(iter, x, y);
	var id = g.createImageData(1,1);
	var d = id.data;
	for (x = 0; x < 600; x++) {
		for (y = 0; y < 600; y++) {
			colour = grid[x][y];
			r = colour.values[0];
			g = colour.values[1];
			b = colour.values[2];
			d[0] = r;
			d[1] = g;
			d[2] = b;
			d[3] = 255;
			g.putImageData(id, x, y);
		}
	}
}
