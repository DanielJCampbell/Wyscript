define src as int|[src]

string f(src e):
    if e ~= [*]:
        return "[*]"
    else:
        return "int"

void main([string] args):
    out->println(f([1]))
    out->println(f([[1]]))
    out->println(f([[[1]]]))
    out->println(f(1))
