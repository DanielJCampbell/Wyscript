define intlist as int|[int]

string f([intlist] l):    
    return str(l)

void main([string] args):
    if |args| == 0:
        x = [1,2,3]
    else:
        x = [[1],[2,3],[5]]
    x[0] = 1
    println(f(x))
