define nlist as nat|[int]

nlist f(int x):
    if x <= 0:
        return 0
    else:
        return f(x-1)

void main([[char]] args):
    x = f(2)    
    println(str(x))
