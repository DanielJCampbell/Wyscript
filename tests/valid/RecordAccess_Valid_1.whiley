define etype as {int mode, ? rest}
define Ptype as process etype

int Ptype::get():
    this->mode = 1
    return this->mode

void main([string] args):
    println("OK")
