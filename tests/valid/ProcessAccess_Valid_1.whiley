define etype as {int mode, int rest}
define Ptype as process etype

int Ptype::get():
    this->mode = 1
    this->rest = 123
    print str(*this)
    return this->mode

void main([string] args):
    p = spawn {mode:1,rest:2}
    println(str(*p))
    x = p->get()
    println(str(*p))
    println(str(x))
