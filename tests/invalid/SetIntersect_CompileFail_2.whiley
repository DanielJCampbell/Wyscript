int f({real} xs):
    return |xs|

void main([string] args):
    ys = {{1,2},{1}}
    xs = {1,2,3,4}
    x = f(xs ∩ ys)
    print str(x)
