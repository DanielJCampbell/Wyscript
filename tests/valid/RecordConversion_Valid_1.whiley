define realtup as {real op}

string f(realtup t):
    x = t.op
    return str(t)

void main([string] args):
    t = {op:1}
    out->println(f(t))
