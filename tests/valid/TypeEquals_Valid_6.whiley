define plist as [int]
define expr as [int]|int
define tup as {expr lhs, int p}

string f(tup t):
    if t.lhs ~= plist && |t.lhs| > 0 && t.lhs[0] == 0:
        return "MATCH" + str(t.lhs)
    else:
        return "NO MATCH"

void main([string] args):
    println(f({lhs:[0],p:0}))
    println(f({lhs:[0,1],p:0}))
    println(f({lhs:[1,1],p:0}))
