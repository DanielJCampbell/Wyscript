define ilist as real | [int]

string f(real e):
    if e ~= int:
        return "int"
    else:
        return "realreal"

void main([string] args):
    out->println(f(1))
