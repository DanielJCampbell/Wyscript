define nlist as int|[int]

int f(int i, [nlist] xs):
    if i < 0 || i >= |xs|:
        return 0
    else if xs[i] ~= int:
        return xs[i]
    else:
        return 0

void main([[char]] args):
    x = f(2, [2,3,4])    
    println(str(x))
