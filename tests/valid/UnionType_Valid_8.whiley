define msg1 as {int op, [int] data}
define msg2 as {int op, [{int dum}] data}

define msgType as msg1 | msg2

string f(msgType m):
    return str(m)

void main([string] args):
    x = {op:1,data:[1,2,3]}
    out->println(f(x))
    list = x.data
    out->println(str(list))
    
