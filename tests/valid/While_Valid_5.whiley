[int] extract([int] ls):
    i = 0
    r = [1]
    // now do the reverse!
    while i < |ls|:
        r = r + [1]
        i = i + 1
    return r

void main([string] args):
    rs = extract([1,2,3,4,5,6,7])
    out->println(str(rs))
    rs = extract([])
    out->println(str(rs))
