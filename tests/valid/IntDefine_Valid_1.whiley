// this is a comment!
define ir1nat as int
define pir1nat as ir1nat

string f(int x):
    if x > 2:
        y = x
        return str(y)
    return ""

void main([string] args):
    out->println(f(1))
    out->println(f(2))
    out->println(f(3))
