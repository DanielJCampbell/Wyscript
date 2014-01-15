function init() {
    var g = new Wyscript.Record(['current','nextBlock','board'], [makeBlock(),makeBlock(),makeBoard()], new Wyscript.Type.Record(['board', 'current', 'nextBlock'], [new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())), new Wyscript.Type.Record(['kind', 'rotation', 'x', 'y'], [new Wyscript.Type.Int(), new Wyscript.Type.Int(), new Wyscript.Type.Int(), new Wyscript.Type.Int()]), new Wyscript.Type.Record(['kind', 'rotation', 'x', 'y'], [new Wyscript.Type.Int(), new Wyscript.Type.Int(), new Wyscript.Type.Int(), new Wyscript.Type.Int()])])).clone();
    setGame(g);
}
function makeBlock() {
    var rotation = new Wyscript.Integer(0);
    var x = new Wyscript.Integer(4);
    var y = new Wyscript.Integer(0);
    var kind = rand();
    if(((Wyscript.equals(kind, new Wyscript.Integer(2), true)) || (Wyscript.equals(kind, new Wyscript.Integer(4), true)))) {
        x = new Wyscript.Integer(3);
    }
    return new Wyscript.Record(['kind','rotation','x','y'], [kind,rotation,x,y], new Wyscript.Type.Record(['kind', 'rotation', 'x', 'y'], [new Wyscript.Type.Int(), new Wyscript.Type.Int(), new Wyscript.Type.Int(), new Wyscript.Type.Int()]));
}
function makeBoard() {
    var board = new Wyscript.List([], new Wyscript.Type.List(new Wyscript.Type.Void())).clone();
    var col = new Wyscript.List([], new Wyscript.Type.List(new Wyscript.Type.Void())).clone();
    if (Wyscript.funcs.i === undefined) {
        Wyscript.funcs.i = {};
        Wyscript.funcs.i.depth = 0;
    }
    else Wyscript.funcs.i.depth++;
    Wyscript.defProperty(Wyscript.funcs.i, 'tmp' + Wyscript.funcs.i.depth, {});
    Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list = (Wyscript.range(new Wyscript.Integer(0), new Wyscript.Integer(10)));
    Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0;
    for(Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count < Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list.length; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count++) {
        var i = Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list[Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count];
        col = new Wyscript.List([], new Wyscript.Type.List(new Wyscript.Type.Void())).clone();
        if (Wyscript.funcs.j === undefined) {
            Wyscript.funcs.j = {};
            Wyscript.funcs.j.depth = 0;
        }
        else Wyscript.funcs.j.depth++;
        Wyscript.defProperty(Wyscript.funcs.j, 'tmp' + Wyscript.funcs.j.depth, {});
        Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].list = (Wyscript.range(new Wyscript.Integer(0), new Wyscript.Integer(20)));
        Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count = 0;
        for(Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count = 0; Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count < Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].list.length; Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count++) {
            var j = Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].list[Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count];
            col = col.append(new Wyscript.List([false], new Wyscript.Type.List(new Wyscript.Type.Bool()))).clone();
        }
        Wyscript.funcs.j.depth--;
        if (Wyscript.funcs.j.depth < 0)
            delete Wyscript.funcs.j;
        board = board.append(new Wyscript.List([col], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool()))));
    }
    Wyscript.funcs.i.depth--;
    if (Wyscript.funcs.i.depth < 0)
        delete Wyscript.funcs.i;
    return board;
}
function update() {
    var g = getGame();
    var board = g.getValue('board');
    var block = g.getValue('current');
    block.setValue('y', (block.getValue('y').add(new Wyscript.Integer(1))));
    var valid = true;
    if(hasCollided(board,block,true)) {
        valid = false;
        g = getGame();
        g.setValue('current', g.getValue('nextBlock'));
        g.setValue('nextBlock', makeBlock());
        if(hasCollided(g.getValue('board'),g.getValue('current'),false)) {
            gameOver();
            return;
        }
    }
    if(valid) {
        g.setValue('current', block);
    }
    setGame(g);
}
function moveLeft() {
    var g = getGame();
    var b = g.getValue('current');
    b.setValue('x', (b.getValue('x').sub(new Wyscript.Integer(1))));
    if(((Wyscript.lt(b.getValue('x'), new Wyscript.Integer(0),  false)) || hasCollided(g.getValue('board'),b,false))) {
        b.setValue('x', (b.getValue('x').add(new Wyscript.Integer(1))));
    }
    g.setValue('current', b);
    setGame(g);
}
function moveRight() {
    var g = getGame();
    var b = g.getValue('current');
    b.setValue('x', (b.getValue('x').add(new Wyscript.Integer(1))));
    if(((Wyscript.gt(b.getValue('x'), new Wyscript.Integer(9),  false)) || hasCollided(g.getValue('board'),b,false))) {
        b.setValue('x', (b.getValue('x').sub(new Wyscript.Integer(1))));
    }
    g.setValue('current', b);
    setGame(g);
}
function rotateLeft() {
    var g = getGame();
    var b = g.getValue('current');
    var oldPieces = calculatePieces(b).clone();
    var oldX = b.getValue('x');
    var oldY = b.getValue('y');
    b.setValue('rotation', (b.getValue('rotation').sub(new Wyscript.Integer(90))));
    if((Wyscript.lt(b.getValue('rotation'), new Wyscript.Integer(0),  false))) {
        b.setValue('rotation', (new Wyscript.Integer(360).add(b.getValue('rotation'))));
    }
    b = changePos(b,oldPieces.clone(),calculatePieces(b).clone());
    if((Wyscript.equals(b.getValue('kind'), new Wyscript.Integer(1), true))) {
        if(((Wyscript.equals(b.getValue('rotation'), new Wyscript.Integer(0), true)) || (Wyscript.equals(b.getValue('rotation'), new Wyscript.Integer(180), true)))) {
            b.setValue('x', (b.getValue('x').add(new Wyscript.Integer(1))));
            b.setValue('y', (b.getValue('y').sub(new Wyscript.Integer(2))));
        }
        else {
            b.setValue('x', (b.getValue('x').sub(new Wyscript.Integer(1))));
            b.setValue('y', (b.getValue('y').add(new Wyscript.Integer(2))));
        }
    }
    if((((Wyscript.lt(b.getValue('x'), new Wyscript.Integer(0),  false)) || (Wyscript.gt(b.getValue('x'), new Wyscript.Integer(9),  false))) || hasCollided(g.getValue('board'),b,false))) {
        b.setValue('x', oldX);
        b.setValue('y', oldY);
        b.setValue('rotation', (b.getValue('rotation').add(new Wyscript.Integer(90))));
        if((Wyscript.gt(b.getValue('rotation'), new Wyscript.Integer(360),  true))) {
            b.setValue('rotation', (b.getValue('rotation').sub(new Wyscript.Integer(360))));
        }
    }
    g.setValue('current', b);
    setGame(g);
}
function rotateRight() {
    var g = getGame();
    var b = g.getValue('current');
    var oldPieces = calculatePieces(b).clone();
    var oldX = b.getValue('x');
    var oldY = b.getValue('y');
    b.setValue('rotation', (b.getValue('rotation').add(new Wyscript.Integer(90))));
    if((Wyscript.gt(b.getValue('rotation'), new Wyscript.Integer(360),  true))) {
        b.setValue('rotation', (b.getValue('rotation').sub(new Wyscript.Integer(360))));
    }
    b = changePos(b,oldPieces.clone(),calculatePieces(b).clone());
    if((Wyscript.equals(b.getValue('kind'), new Wyscript.Integer(1), true))) {
        if(((Wyscript.equals(b.getValue('rotation'), new Wyscript.Integer(0), true)) || (Wyscript.equals(b.getValue('rotation'), new Wyscript.Integer(180), true)))) {
            b.setValue('x', (b.getValue('x').sub(new Wyscript.Integer(1))));
            b.setValue('y', (b.getValue('y').add(new Wyscript.Integer(2))));
        }
        else {
            b.setValue('x', (b.getValue('x').add(new Wyscript.Integer(1))));
            b.setValue('y', (b.getValue('y').sub(new Wyscript.Integer(2))));
        }
    }
    if((((Wyscript.lt(b.getValue('x'), new Wyscript.Integer(0),  false)) || (Wyscript.gt(b.getValue('x'), new Wyscript.Integer(9),  false))) || hasCollided(g.getValue('board'),b,false))) {
        b.setValue('x', oldX);
        b.setValue('y', oldY);
        b.setValue('rotation', (b.getValue('rotation').sub(new Wyscript.Integer(90))));
        if((Wyscript.lt(b.getValue('rotation'), new Wyscript.Integer(0),  false))) {
            b.setValue('rotation', (new Wyscript.Integer(360).add(b.getValue('rotation'))));
        }
    }
    g.setValue('current', b);
    setGame(g);
}
function calculatePieces(b) {
    var pieces = new Wyscript.List([], new Wyscript.Type.List(new Wyscript.Type.Void())).clone();
    Wyscript.labels.var0 = b.getValue('kind');
    label0: while(true) {
        if(Wyscript.equals(Wyscript.labels.var0, new Wyscript.Integer(0), true)) {
            pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
            pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
            pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
            pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
            break label0;
        }

        else if(Wyscript.equals(Wyscript.labels.var0, new Wyscript.Integer(1), true)) {
            if(((Wyscript.equals(b.getValue('rotation'), new Wyscript.Integer(0), true)) || (Wyscript.equals(b.getValue('rotation'), new Wyscript.Integer(180), true)))) {
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,true,true], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
            }
            else {
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
            }
            break label0;
        }

        else if(Wyscript.equals(Wyscript.labels.var0, new Wyscript.Integer(2), true)) {
            Wyscript.labels.var1 = b.getValue('rotation');
            label1: while(true) {
                if(Wyscript.equals(Wyscript.labels.var1, new Wyscript.Integer(0), true)) {
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,true,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,true,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    break label1;
                }

                else if(Wyscript.equals(Wyscript.labels.var1, new Wyscript.Integer(90), true)) {
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    break label1;
                }

                else if(Wyscript.equals(Wyscript.labels.var1, new Wyscript.Integer(180), true)) {
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,true,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    break label1;
                }

                else if(Wyscript.equals(Wyscript.labels.var1, new Wyscript.Integer(270), true)) {
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    break label1;
                }

                else {
                    break label1;
                }

            }
            delete Wyscript.labels.var1
            break label0;
        }

        else if(Wyscript.equals(Wyscript.labels.var0, new Wyscript.Integer(3), true)) {
            Wyscript.labels.var1 = b.getValue('rotation');
            label1: while(true) {
                if(Wyscript.equals(Wyscript.labels.var1, new Wyscript.Integer(0), true)) {
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,true,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,true,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    break label1;
                }

                else if(Wyscript.equals(Wyscript.labels.var1, new Wyscript.Integer(90), true)) {
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    break label1;
                }

                else if(Wyscript.equals(Wyscript.labels.var1, new Wyscript.Integer(180), true)) {
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,true,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    break label1;
                }

                else if(Wyscript.equals(Wyscript.labels.var1, new Wyscript.Integer(270), true)) {
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    break label1;
                }

                else {
                    break label1;
                }

            }
            delete Wyscript.labels.var1
            break label0;
        }

        else if(Wyscript.equals(Wyscript.labels.var0, new Wyscript.Integer(4), true)) {
            Wyscript.labels.var1 = b.getValue('rotation');
            label1: while(true) {
                if(Wyscript.equals(Wyscript.labels.var1, new Wyscript.Integer(0), true)) {
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    break label1;
                }

                else if(Wyscript.equals(Wyscript.labels.var1, new Wyscript.Integer(90), true)) {
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,true,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    break label1;
                }

                else if(Wyscript.equals(Wyscript.labels.var1, new Wyscript.Integer(180), true)) {
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    break label1;
                }

                else if(Wyscript.equals(Wyscript.labels.var1, new Wyscript.Integer(270), true)) {
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,true,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                    break label1;
                }

                else {
                    break label1;
                }

            }
            delete Wyscript.labels.var1
            break label0;
        }

        else if(Wyscript.equals(Wyscript.labels.var0, new Wyscript.Integer(5), true)) {
            if(((Wyscript.equals(b.getValue('rotation'), new Wyscript.Integer(0), true)) || (Wyscript.equals(b.getValue('rotation'), new Wyscript.Integer(180), true)))) {
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
            }
            else {
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,true,true,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
            }
            break label0;
        }

        else if(Wyscript.equals(Wyscript.labels.var0, new Wyscript.Integer(6), true)) {
            if(((Wyscript.equals(b.getValue('rotation'), new Wyscript.Integer(0), true)) || (Wyscript.equals(b.getValue('rotation'), new Wyscript.Integer(180), true)))) {
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
            }
            else {
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([true,true,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,true,true,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
                pieces = pieces.append(new Wyscript.List([new Wyscript.List([false,false,false,false], new Wyscript.Type.List(new Wyscript.Type.Bool()))], new Wyscript.Type.List(new Wyscript.Type.List(new Wyscript.Type.Bool())))).clone();
            }
            break label0;
        }

        else {
            break label0;
        }

    }
    delete Wyscript.labels.var0
    return pieces;
}
function changePos(b, old, newBlock) {
    var oldX = new Wyscript.Integer(4);
    var oldY = new Wyscript.Integer(4);
    var newX = new Wyscript.Integer(4);
    var newY = new Wyscript.Integer(4);
    if (Wyscript.funcs.i === undefined) {
        Wyscript.funcs.i = {};
        Wyscript.funcs.i.depth = 0;
    }
    else Wyscript.funcs.i.depth++;
    Wyscript.defProperty(Wyscript.funcs.i, 'tmp' + Wyscript.funcs.i.depth, {});
    Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list = (Wyscript.range(new Wyscript.Integer(0), new Wyscript.Integer(3)));
    Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0;
    for(Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count < Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list.length; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count++) {
        var i = Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list[Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count];
        if (Wyscript.funcs.j === undefined) {
            Wyscript.funcs.j = {};
            Wyscript.funcs.j.depth = 0;
        }
        else Wyscript.funcs.j.depth++;
        Wyscript.defProperty(Wyscript.funcs.j, 'tmp' + Wyscript.funcs.j.depth, {});
        Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].list = (Wyscript.range(new Wyscript.Integer(0), new Wyscript.Integer(3)));
        Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count = 0;
        for(Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count = 0; Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count < Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].list.length; Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count++) {
            var j = Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].list[Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count];
            if(old.getValue(i).getValue(j)) {
                if((Wyscript.lt(i, oldX,  false))) {
                    oldX = i;
                }
                if((Wyscript.lt(j, oldY,  false))) {
                    oldY = j;
                }
            }
            if(newBlock.getValue(i).getValue(j)) {
                if((Wyscript.lt(i, newX,  false))) {
                    newX = i;
                }
                if((Wyscript.lt(j, newY,  false))) {
                    newY = j;
                }
            }
        }
        Wyscript.funcs.j.depth--;
        if (Wyscript.funcs.j.depth < 0)
            delete Wyscript.funcs.j;
    }
    Wyscript.funcs.i.depth--;
    if (Wyscript.funcs.i.depth < 0)
        delete Wyscript.funcs.i;
    var xDiff = (newX.sub(oldX));
    var yDiff = (newY.sub(oldY));
    b.setValue('x', (b.getValue('x').add(xDiff)));
    b.setValue('y', (b.getValue('y').add(yDiff)));
    return b;
}
function hasCollided(board, block, isUpdate) {
    var pieces = calculatePieces(block).clone();
    var valid = true;
    if (Wyscript.funcs.i === undefined) {
        Wyscript.funcs.i = {};
        Wyscript.funcs.i.depth = 0;
    }
    else Wyscript.funcs.i.depth++;
    Wyscript.defProperty(Wyscript.funcs.i, 'tmp' + Wyscript.funcs.i.depth, {});
    Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list = (Wyscript.range(block.getValue('x'), (block.getValue('x').add(new Wyscript.Integer(4)))));
    Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0;
    for(Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count < Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list.length; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count++) {
        var i = Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list[Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count];
        if (Wyscript.funcs.j === undefined) {
            Wyscript.funcs.j = {};
            Wyscript.funcs.j.depth = 0;
        }
        else Wyscript.funcs.j.depth++;
        Wyscript.defProperty(Wyscript.funcs.j, 'tmp' + Wyscript.funcs.j.depth, {});
        Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].list = (Wyscript.range(block.getValue('y'), (block.getValue('y').add(new Wyscript.Integer(4)))));
        Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count = 0;
        for(Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count = 0; Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count < Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].list.length; Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count++) {
            var j = Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].list[Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count];
            if(pieces.getValue((i.sub(block.getValue('x')))).getValue((j.sub(block.getValue('y'))))) {
                if((((Wyscript.gt(i, new Wyscript.Integer(9),  false)) || (Wyscript.gt(j, new Wyscript.Integer(19),  false))) || board.getValue(i).getValue(j))) {
                    if((!isUpdate)) {
                        return true;
                    }
                    valid = false;
                }
            }
        }
        Wyscript.funcs.j.depth--;
        if (Wyscript.funcs.j.depth < 0)
            delete Wyscript.funcs.j;
    }
    Wyscript.funcs.i.depth--;
    if (Wyscript.funcs.i.depth < 0)
        delete Wyscript.funcs.i;
    if(valid) {
        return false;
    }
    block.setValue('y', (block.getValue('y').sub(new Wyscript.Integer(1))));
    if (Wyscript.funcs.i === undefined) {
        Wyscript.funcs.i = {};
        Wyscript.funcs.i.depth = 0;
    }
    else Wyscript.funcs.i.depth++;
    Wyscript.defProperty(Wyscript.funcs.i, 'tmp' + Wyscript.funcs.i.depth, {});
    Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list = (Wyscript.range(block.getValue('x'), (block.getValue('x').add(new Wyscript.Integer(4)))));
    Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0;
    for(Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count < Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list.length; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count++) {
        var i = Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list[Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count];
        if (Wyscript.funcs.j === undefined) {
            Wyscript.funcs.j = {};
            Wyscript.funcs.j.depth = 0;
        }
        else Wyscript.funcs.j.depth++;
        Wyscript.defProperty(Wyscript.funcs.j, 'tmp' + Wyscript.funcs.j.depth, {});
        Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].list = (Wyscript.range(block.getValue('y'), (block.getValue('y').add(new Wyscript.Integer(4)))));
        Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count = 0;
        for(Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count = 0; Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count < Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].list.length; Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count++) {
            var j = Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].list[Wyscript.funcs.j['tmp' + Wyscript.funcs.j.depth].count];
            if(pieces.getValue((i.sub(block.getValue('x')))).getValue((j.sub(block.getValue('y'))))) {
                board.getValue(i).setValue(j, true);
            }
        }
        Wyscript.funcs.j.depth--;
        if (Wyscript.funcs.j.depth < 0)
            delete Wyscript.funcs.j;
    }
    Wyscript.funcs.i.depth--;
    if (Wyscript.funcs.i.depth < 0)
        delete Wyscript.funcs.i;
    board = clearLines(board);
    var g = getGame();
    g.setValue('board', board);
    setGame(g);
    return true;
}
function clearLines(board) {
    var lowestCleared = new Wyscript.Integer(-1);
    var numCleared = new Wyscript.Integer(0);
    var line = true;
    var j = new Wyscript.Integer(19);
    while((Wyscript.gt(j, new Wyscript.Integer(-1),  false))) {
        line = true;
        if (Wyscript.funcs.i === undefined) {
            Wyscript.funcs.i = {};
            Wyscript.funcs.i.depth = 0;
        }
        else Wyscript.funcs.i.depth++;
        Wyscript.defProperty(Wyscript.funcs.i, 'tmp' + Wyscript.funcs.i.depth, {});
        Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list = (Wyscript.range(new Wyscript.Integer(0), new Wyscript.Integer(10)));
        Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0;
        for(Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count < Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list.length; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count++) {
            var i = Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list[Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count];
            if((!board.getValue(i).getValue(j))) {
                line = false;
            }
        }
        Wyscript.funcs.i.depth--;
        if (Wyscript.funcs.i.depth < 0)
            delete Wyscript.funcs.i;
        if(line) {
            numCleared = (numCleared.add(new Wyscript.Integer(1)));
            if((Wyscript.equals(lowestCleared, new Wyscript.Integer(-1), true))) {
                lowestCleared = j;
            }
            if (Wyscript.funcs.i === undefined) {
                Wyscript.funcs.i = {};
                Wyscript.funcs.i.depth = 0;
            }
            else Wyscript.funcs.i.depth++;
            Wyscript.defProperty(Wyscript.funcs.i, 'tmp' + Wyscript.funcs.i.depth, {});
            Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list = (Wyscript.range(new Wyscript.Integer(0), new Wyscript.Integer(10)));
            Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0;
            for(Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count < Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list.length; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count++) {
                var i = Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list[Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count];
                board.getValue(i).setValue(j, false);
            }
            Wyscript.funcs.i.depth--;
            if (Wyscript.funcs.i.depth < 0)
                delete Wyscript.funcs.i;
        }
        j = (j.sub(new Wyscript.Integer(1)));
    }
    if((Wyscript.equals(lowestCleared, new Wyscript.Integer(-1), false))) {
        j = (lowestCleared.sub(numCleared));
        while((Wyscript.gt(j, new Wyscript.Integer(-1),  false))) {
            if (Wyscript.funcs.i === undefined) {
                Wyscript.funcs.i = {};
                Wyscript.funcs.i.depth = 0;
            }
            else Wyscript.funcs.i.depth++;
            Wyscript.defProperty(Wyscript.funcs.i, 'tmp' + Wyscript.funcs.i.depth, {});
            Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list = (Wyscript.range(new Wyscript.Integer(0), new Wyscript.Integer(10)));
            Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0;
            for(Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count < Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list.length; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count++) {
                var i = Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list[Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count];
                if(board.getValue(i).getValue(j)) {
                    board.getValue(i).setValue(j, false);
                    board.getValue(i).setValue((j.add(numCleared)), true);
                }
            }
            Wyscript.funcs.i.depth--;
            if (Wyscript.funcs.i.depth < 0)
                delete Wyscript.funcs.i;
            j = (j.sub(new Wyscript.Integer(1)));
        }
        var num = new Wyscript.Integer(0);
        if (Wyscript.funcs.i === undefined) {
            Wyscript.funcs.i = {};
            Wyscript.funcs.i.depth = 0;
        }
        else Wyscript.funcs.i.depth++;
        Wyscript.defProperty(Wyscript.funcs.i, 'tmp' + Wyscript.funcs.i.depth, {});
        Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list = (Wyscript.range(new Wyscript.Integer(0), numCleared));
        Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0;
        for(Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count = 0; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count < Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list.length; Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count++) {
            var i = Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].list[Wyscript.funcs.i['tmp' + Wyscript.funcs.i.depth].count];
            num = (num.add((new Wyscript.Integer(100).mul(i.add(new Wyscript.Integer(1))))));
        }
        Wyscript.funcs.i.depth--;
        if (Wyscript.funcs.i.depth < 0)
            delete Wyscript.funcs.i;
        addScore(num);
    }
    return board;
}
