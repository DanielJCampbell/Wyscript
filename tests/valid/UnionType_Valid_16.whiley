define IntList as {int op, [real] rest}|{int op, int mode}

string f(IntList y):
    return str(y)

void main([string] args):
    x = {op:1, rest:[1.23]}
    if |args| == 10:
        x = {op:1.23, mode: 0}
    x.op = 123 // SHOULD BE OK
    println(f(x))
    
