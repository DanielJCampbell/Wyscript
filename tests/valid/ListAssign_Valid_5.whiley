[int] f():
    return [1,2]

void main([string] args):
     a1 = f()
     a2 = f()
     a2[0] = 0
     
     out->println(str(a1[0]))
     out->println(str(a1[1]))
     out->println(str(a2[0]))
     out->println(str(a2[1]))
