var grid = [];

function getX() {
 	return new Wyscript.Tuple([new Wyscript.Float(parseFloat(document.getElementById("minX").value)), new Wyscript.Float(parseFloat(document.getElementById("maxX").value))], new Wyscript.Type.Tuple([new Wyscript.Type.Real(), new Wyscript.Type.Real()]));
}

function getY() {
	return new Wyscript.Tuple([new Wyscript.Float(parseFloat(document.getElementById("minY").value)), new Wyscript.Float(parseFloat(document.getElementById("maxY").value))], new Wyscript.Type.Tuple([new Wyscript.Type.Real(), new Wyscript.Type.Real()]));
}

function getIterations() {
	return new Wyscript.Integer(~~(document.getElementById("iterations").value));
}
function palette(n) {
	var iters = n.num
	var maxCol = 200
	var max = getIterations().num;
	var multiplier = (max/maxCol);
	if (iters === max || iters/multiplier >= maxCol)
		return [0,0,0];
	var colour = [];
	colour[0] = 0
	colour[1] = ~~(50+(iters/multiplier))
	colour[2] = 50
	return colour;
}
 
function setCanvas(x, y, n) {
	var jsX = x.num;
	var jsY = y.num;
	var colour = palette(n);
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
	var gr;
	var b;
	var colour;
	var iter = getIterations();
	
	mandelbrot(iter, x, y);
	var id = g.createImageData(1,1);
	var d = id.data;
	for (x = 0; x < 600; x++) {
		for (y = 0; y < 600; y++) {
			colour = grid[x][y];
			r = colour[0];
			gr = colour[1];
			b = colour[2];
			d[0] = r;
			d[1] = gr;
			d[2] = b;
			d[3] = 255;
			g.putImageData(id, x, y);
		}
	}
}
