define bop as {int x, int y}
define expr as int|bop

string f(expr e):
    if e ~= int:
        return "GOT INT"
    else:
        return "GOT BOB"

void main([string] args):
    e = 1
    out->println(f(e))
    e = {x:1,y:2}
    out->println(f(e))
 
