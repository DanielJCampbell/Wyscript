define fr6nat as int

{fr6nat} g({fr6nat} xs):
    return { y | y in xs, y > 1 }

[char] f({int} x):
    return str(x)

void main([[char]] args):
    ys = {-12309812,1,2,2987,2349872,234987234987,234987234987234}
    println(f(g(ys)))
