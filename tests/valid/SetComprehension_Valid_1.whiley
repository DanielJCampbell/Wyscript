void main([string] args):
     xs = { 1,2,3,4,5,6,7,8,9,10 }
     ys = { x | x ∈ xs, ((x/2)*2) == x }
     out->println(str(xs))
     out->println(str(ys))
