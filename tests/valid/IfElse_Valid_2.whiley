int f(int x):
    if(x < 10):
        return 1
    else if(x > 10):
        return 2
    return 0

void main([string] args):
    out->println(str(f(1)))
    out->println(str(f(10)))
    out->println(str(f(11)))
    out->println(str(f(1212)))
    out->println(str(f(-1212)))
