define byte as int
define codeOp as { 1, 2, 3, 4 }
define code as {codeOp op, [int] payload}

[char] f(code x):
    y = x.op
    return str(y)

void main([[char]] args):
    println(f({op:1,payload:[1]}))
