// this is a comment!
define IntRealList as [int]|[real]

[int] f([int] xs):
    return xs

void main([string] args):
    x = [1,2,3] // INT LIST
    ys = x      // OK
    print str(ys)
    x[0] = 1.23 // NOT OK
    zs = f(x)
    print str(zs)

