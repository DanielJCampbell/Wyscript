define tenup as int
define msg1 as {tenup op, [int] data}
define msg2 as {int index}

define msgType as msg1 | msg2

string f(msgType m):
    return str(m)

void main([string] args):
    m1 = {op:11,data:[]}
    m2 = {index:1}
    out->println(f(m1))
    out->println(f(m2))
