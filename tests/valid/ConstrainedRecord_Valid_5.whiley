define state as {[char] input, int pos}

state parseWhiteSpace(state st):
    if(st.pos < |st.input| && st.input[st.pos] == ' '):
        return parseWhiteSpace({input:st.input,pos:st.pos+1})
    else:
        return st

state parseTerm(state st):
    st = parseWhiteSpace(st)
    return st

void main([[char]] args):
    st = {input:"  Hello",pos:0}
    st = parseTerm(st)
    println(str(st))
