string f({int} xs):
    return str(xs)

string g({int} ys):
    return f(ys ∩ {1,2})

void main([string] args):
    out->println(g({}))
    out->println(g({2,3,4,5,6}))
    out->println(g({2,6}))
