void f([int] x, int i):
    if(i < 0 || i >= |x|):
        i = 0
    y = x[i]
    z = x[i]
    assert y == z

void main([string] args):
    arr = [1,2,3]
    f(arr, 1)
    out->println(str(arr))
    f(arr, 2)
    out->println(str(arr))
    f(arr, 3)
    out->println(str(arr))
    f(arr, -1)
    out->println(str(arr))
    f(arr, 4)
