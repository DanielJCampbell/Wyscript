define rlist as real | [int]

int f(rlist l):
    if l ~= real:
        return 0
    else:
        return |l|

void main([string] args):
    out->println(str(f(123)))
    out->println(str(f(1.23)))
    out->println(str(f([1,2,3]))) 

