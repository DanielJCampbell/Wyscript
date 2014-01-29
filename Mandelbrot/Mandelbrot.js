function diff(tuple) {
    var x;
    var y;
    var $WyscriptTupleVal = tuple;
    x = $WyscriptTupleVal.values[0];
    y = $WyscriptTupleVal.values[1];
    return (y.sub(x));
}
function first(tuple) {
    var a;
    var b;
    var $WyscriptTupleVal = tuple;
    a = $WyscriptTupleVal.values[0];
    b = $WyscriptTupleVal.values[1];
    return a;
}
function mandelbrot(max, xScale, yScale) {
    var xDiff = diff(xScale.clone());
    var yDiff = diff(yScale.clone());
    var zx = (xDiff.div(new Wyscript.Float(600.0)));
    var zy = (yDiff.div(new Wyscript.Float(600.0)));
    var $WyTmp0 = {}
    $WyTmp0.list = (Wyscript.range(new Wyscript.Integer(0), new Wyscript.Integer(600)));
    $WyTmp0.count = 0;
    for($WyTmp0.count = 0; $WyTmp0.count < $WyTmp0.list.length; $WyTmp0.count++) {
        var i = $WyTmp0.list[$WyTmp0.count];
        var $WyTmp1 = {}
        $WyTmp1.list = (Wyscript.range(new Wyscript.Integer(0), new Wyscript.Integer(600)));
        $WyTmp1.count = 0;
        for($WyTmp1.count = 0; $WyTmp1.count < $WyTmp1.list.length; $WyTmp1.count++) {
            var j = $WyTmp1.list[$WyTmp1.count];
            var x0 = ((Wyscript.cast(new Wyscript.Type.Real(), i).mul(zx)).add(first(xScale.clone())));
            var y0 = ((Wyscript.cast(new Wyscript.Type.Real(), j).mul(zy)).add(first(yScale.clone())));
            var x = new Wyscript.Float(0.0);
            var y = new Wyscript.Float(0.0);
            var n = new Wyscript.Integer(0);
            while(((Wyscript.lt(((x.mul(x)).add((y.mul(y)))), new Wyscript.Integer(4),  false)) && (Wyscript.lt(n, max,  false)))) {
                var tmp = (((x.mul(x)).sub((y.mul(y)))).add(x0));
                y = (((new Wyscript.Float(2.0).mul(x)).mul(y)).add(y0));
                x = tmp;
                n = (n.add(new Wyscript.Integer(1)));
            }
            setCanvas(i,j,n);
        }
    }
}
