void f([int] x):
    y = x[0]
    z = x[0]
    assert y == z

void main([string] args):
    arr = [1,2,3]
    f(arr)
    out->println(str(arr[0]))
