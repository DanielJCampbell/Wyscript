string f({int} xs):
    return str(xs)

string g({int} ys):
    return f(ys ∩ {1,2,3})

void main([string] args):
    out->println(g({1,2,3,4}))
    out->println(g({2}))
    out->println(g({}))
