{int} f({int} xs):
    return { -x | x ∈ xs } 

void main([string] args):
    println(str(f({1,2,3,4})))
