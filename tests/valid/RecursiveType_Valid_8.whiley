// The current parser state
define state as {string input, int pos}

// A simple, recursive expression tree
define expr as {int num} | {int op, expr lhs, expr rhs} | {string err}

// Top-level parse method
expr parse(string input):
    r = parseAddSubExpr({input:input,pos:0})
    return r.e

{expr e, state st} parseAddSubExpr(state st):    
    return {e:{num:1},st:st}

void main([string] args):
    e = parse("Hello")
    out->println(str(e))
