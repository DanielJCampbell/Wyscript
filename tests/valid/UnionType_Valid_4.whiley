define ur4nat as int
define tur4nat as int
define wur4nat as ur4nat|tur4nat

string f(wur4nat x):
    return str(x)

void main([string] args):
    out->println(f(1))  

