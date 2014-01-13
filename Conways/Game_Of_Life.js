function gameOfLife(gridX, gridY, min, max) {
    var grid = getGrid().clone();
    var newgrid = generate_grid(gridX,gridY).clone();
    if ($_.funcs.x === undefined) {
        $_.funcs.x = {};
        $_.funcs.x.depth = 0;
    }
    else $_.funcs.x.depth++;
    $_.defProperty($_.funcs.x, 'tmp' + $_.funcs.x.depth, {});
    $_.funcs.x['tmp' + $_.funcs.x.depth].list = ($_.range(new $_.Integer(0), gridX));
    $_.funcs.x['tmp' + $_.funcs.x.depth].count = 0;
    for($_.funcs.x['tmp' + $_.funcs.x.depth].count = 0; $_.funcs.x['tmp' + $_.funcs.x.depth].count < $_.funcs.x['tmp' + $_.funcs.x.depth].list.length; $_.funcs.x['tmp' + $_.funcs.x.depth].count++) {
        var x = $_.funcs.x['tmp' + $_.funcs.x.depth].list[$_.funcs.x['tmp' + $_.funcs.x.depth].count];
        if ($_.funcs.y === undefined) {
            $_.funcs.y = {};
            $_.funcs.y.depth = 0;
        }
        else $_.funcs.y.depth++;
        $_.defProperty($_.funcs.y, 'tmp' + $_.funcs.y.depth, {});
        $_.funcs.y['tmp' + $_.funcs.y.depth].list = ($_.range(new $_.Integer(0), gridY));
        $_.funcs.y['tmp' + $_.funcs.y.depth].count = 0;
        for($_.funcs.y['tmp' + $_.funcs.y.depth].count = 0; $_.funcs.y['tmp' + $_.funcs.y.depth].count < $_.funcs.y['tmp' + $_.funcs.y.depth].list.length; $_.funcs.y['tmp' + $_.funcs.y.depth].count++) {
            var y = $_.funcs.y['tmp' + $_.funcs.y.depth].list[$_.funcs.y['tmp' + $_.funcs.y.depth].count];
            var count = new $_.Integer(0);
            if(($_.gt((x.sub(new $_.Integer(1))), new $_.Integer(0),  true))) {
                if(($_.equals(grid.getValue(y).getValue((x.sub(new $_.Integer(1)))), new $_.Integer(1), true))) {
                    count = (count.add(new $_.Integer(1)));
                }
                if(($_.lt((y.add(new $_.Integer(1))), gridY,  false))) {
                    if(($_.equals(grid.getValue((y.add(new $_.Integer(1)))).getValue((x.sub(new $_.Integer(1)))), new $_.Integer(1), true))) {
                        count = (count.add(new $_.Integer(1)));
                    }
                }
                if(($_.gt((y.sub(new $_.Integer(1))), new $_.Integer(0),  true))) {
                    if(($_.equals(grid.getValue((y.sub(new $_.Integer(1)))).getValue((x.sub(new $_.Integer(1)))), new $_.Integer(1), true))) {
                        count = (count.add(new $_.Integer(1)));
                    }
                }
            }
            if(($_.gt((y.sub(new $_.Integer(1))), new $_.Integer(0),  true))) {
                if(($_.equals(grid.getValue((y.sub(new $_.Integer(1)))).getValue(x), new $_.Integer(1), true))) {
                    count = (count.add(new $_.Integer(1)));
                }
            }
            if(($_.lt((y.add(new $_.Integer(1))), gridY,  false))) {
                if(($_.equals(grid.getValue((y.add(new $_.Integer(1)))).getValue(x), new $_.Integer(1), true))) {
                    count = (count.add(new $_.Integer(1)));
                }
            }
            if(($_.lt((x.add(new $_.Integer(1))), gridX,  false))) {
                if(($_.equals(grid.getValue(y).getValue((x.add(new $_.Integer(1)))), new $_.Integer(1), true))) {
                    count = (count.add(new $_.Integer(1)));
                }
                if(($_.lt((y.add(new $_.Integer(1))), gridY,  false))) {
                    if(($_.equals(grid.getValue((y.add(new $_.Integer(1)))).getValue((x.add(new $_.Integer(1)))), new $_.Integer(1), true))) {
                        count = (count.add(new $_.Integer(1)));
                    }
                }
                if(($_.gt((y.sub(new $_.Integer(1))), new $_.Integer(0),  true))) {
                    if(($_.equals(grid.getValue((y.sub(new $_.Integer(1)))).getValue((x.add(new $_.Integer(1)))), new $_.Integer(1), true))) {
                        count = (count.add(new $_.Integer(1)));
                    }
                }
            }
            if(($_.lt(count, min,  false))) {
                newgrid.getValue(y).setValue(x, new $_.Integer(0));
            }
            else {
                if(($_.gt(count, max,  false))) {
                    newgrid.getValue(y).setValue(x, new $_.Integer(0));
                }
                else {
                    if(($_.equals(count, max, true))) {
                        newgrid.getValue(y).setValue(x, new $_.Integer(1));
                    }
                    if(((($_.lt(count, max,  true)) && ($_.gt(count, min,  true))) && ($_.equals(grid.getValue(y).getValue(x), new $_.Integer(1), true)))) {
                        newgrid.getValue(y).setValue(x, new $_.Integer(1));
                    }
                }
            }
        }
        $_.funcs.y.depth--;
        if ($_.funcs.y.depth < 0)
            delete $_.funcs.y;
    }
    $_.funcs.x.depth--;
    if ($_.funcs.x.depth < 0)
        delete $_.funcs.x;
    setGrid(newgrid.clone());
}
function generate_grid(x, y) {
    if(($_.lt(y, new $_.Integer(0),  true))) {
        return new $_.List([], new $_.Type.List(new $_.Type.Void()));
    }
    var i = new $_.Integer(0);
    var row = new $_.List([], new $_.Type.List(new $_.Type.Void())).clone();
    while(($_.lt(i, x,  false))) {
        row = row.append(new $_.List([new $_.Integer(0)], new $_.Type.List(new $_.Type.Int()))).clone();
        i = (i.add(new $_.Integer(1)));
    }
    return new $_.List([row], new $_.Type.List(new $_.Type.List(new $_.Type.Int()))).append(generate_grid(x,(y.sub(new $_.Integer(1)))));
}
function randomize() {
    var gridX = getX();
    var gridY = getY();
    var num = ((gridX.mul(gridY)).div(new $_.Integer(3)));
    var list = generate_grid(gridX,gridY).clone();
    if ($_.funcs.i === undefined) {
        $_.funcs.i = {};
        $_.funcs.i.depth = 0;
    }
    else $_.funcs.i.depth++;
    $_.defProperty($_.funcs.i, 'tmp' + $_.funcs.i.depth, {});
    $_.funcs.i['tmp' + $_.funcs.i.depth].list = ($_.range(new $_.Integer(0), num));
    $_.funcs.i['tmp' + $_.funcs.i.depth].count = 0;
    for($_.funcs.i['tmp' + $_.funcs.i.depth].count = 0; $_.funcs.i['tmp' + $_.funcs.i.depth].count < $_.funcs.i['tmp' + $_.funcs.i.depth].list.length; $_.funcs.i['tmp' + $_.funcs.i.depth].count++) {
        var i = $_.funcs.i['tmp' + $_.funcs.i.depth].list[$_.funcs.i['tmp' + $_.funcs.i.depth].count];
        var tmpX = rand(gridX);
        var tmpY = rand(gridY);
        var j = list.getValue(tmpY).getValue(tmpX);
        if(($_.equals(j, new $_.Integer(0), true))) {
            list.getValue(tmpY).setValue(tmpX, new $_.Integer(1));
        }
    }
    $_.funcs.i.depth--;
    if ($_.funcs.i.depth < 0)
        delete $_.funcs.i;
    setGrid(list.clone());
}
