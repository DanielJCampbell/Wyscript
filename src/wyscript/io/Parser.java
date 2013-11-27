// This file is part of the WhileLang Compiler (wlc).
//
// The WhileLang Compiler is free software; you can redistribute
// it and/or modify it under the terms of the GNU General Public
// License as published by the Free Software Foundation; either
// version 3 of the License, or (at your option) any later version.
//
// The WhileLang Compiler is distributed in the hope that it
// will be useful, but WITHOUT ANY WARRANTY; without even the
// implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
// PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public
// License along with the WhileLang Compiler. If not, see
// <http://www.gnu.org/licenses/>
//
// Copyright 2013, David James Pearce.

package wyscript.io;

import java.io.File;
import java.util.*;

import wyscript.io.Lexer.*;
import wyscript.lang.Expr;
import wyscript.lang.Stmt;
import wyscript.lang.Type;
import wyscript.lang.WyscriptFile;
import wyscript.lang.WyscriptFile.*;
import wyscript.util.Attribute;
import wyscript.util.Pair;
import wyscript.util.SyntaxError;

/**
 * Responsible for parsing a sequence of tokens into an Abstract Syntax Tree.
 * 
 * @author David J. Pearce
 * 
 */
public class Parser {

	private String filename;
	private ArrayList<Token> tokens;
	private HashSet<String> userDefinedTypes;
	private int index;

	public Parser(String filename, List<Token> tokens) {
		this.filename = filename;
		this.tokens = new ArrayList<Token>(tokens);
		this.userDefinedTypes = new HashSet<String>();
	}

	/**
	 * Read a <code>WyscriptFile</code> from the token stream. If the stream is
	 * invalid in some way (e.g. contains a syntax error, etc) then a
	 * <code>SyntaxError</code> is thrown.
	 * 
	 * @return
	 */
	public WyscriptFile read() {
		ArrayList<Decl> decls = new ArrayList<Decl>();
		skipWhiteSpace();

		while (index < tokens.size()) {
			Token t = tokens.get(index);
			switch (t.kind) {
			case Type:
				decls.add(parseTypeDeclaration());
			case Constant:
				decls.add(parseConstantDeclaration());
			default:
				decls.add(parseFunctionDeclaration());
			}
			skipWhiteSpace();
		}

		// Now, figure out module name from filename
		String name = filename.substring(
				filename.lastIndexOf(File.separatorChar) + 1,
				filename.length() - 6);

		return new WyscriptFile(name, decls);
	}

	private FunDecl parseFunctionDeclaration() {
		int start = index;
		
		Type ret = parseType();
		Token name = match(Token.Kind.Identifier);
		match(Token.Kind.LeftBrace);

		// Now build up the parameter types
		List<Parameter> paramTypes = new ArrayList<Parameter>();
		boolean firstTime = true;
		while (index < tokens.size()
				&& lookahead(Token.Kind.RightBrace) == null) {
			if (!firstTime) {
				match(Token.Kind.Comma);
			}
			firstTime = false;
			int pstart = index;
			Type t = parseType();
			Token n = match(Token.Kind.Identifier);
			paramTypes.add(new Parameter(t, n.text, sourceAttr(pstart,
					index - 1)));
		}

		match(Token.Kind.RightBrace, Token.Kind.Colon);		
		matchEndLine();
		List<Stmt> stmts = parseBlock(ROOT_INDENT);
		return new FunDecl(name.text, ret, paramTypes, stmts, sourceAttr(start,
				index - 1));
	}

	private Decl parseTypeDeclaration() {
		int start = index;
		Token[] tokens = match(Token.Kind.Type, Token.Kind.Identifier,
				Token.Kind.Is);
		Type t = parseType();
		int end = index;
		userDefinedTypes.add(tokens[1].text);
		return new TypeDecl(t, tokens[1].text, sourceAttr(start, end - 1));
	}

	private Decl parseConstantDeclaration() {
		int start = index;

		Token[] tokens = match(Token.Kind.Constant, Token.Kind.Identifier,
				Token.Kind.Is);

		Expr e = parseExpression();
		int end = index;
		matchEndLine();

		return new ConstDecl(e, tokens[1].text, sourceAttr(start, end - 1));
	}

	/**
	 * Parse a block of zero or more statements which share the same indentation
	 * level. Their indentation level must be strictly greater than that of
	 * their parent, otherwise the end of block is signaled. The <i>indentation
	 * level</i> for the block is set by the first statement encountered
	 * (assuming their is one). An error occurs if a subsequent statement is
	 * reached with an indentation level <i>greater</i> than the block's
	 * indentation level.
	 * 
	 * @param parentIndent
	 *            The indentation level of the parent, for which all statements
	 *            in this block must have a greater indent. May not be
	 *            <code>null</code>.
	 * @return
	 */
	private List<Stmt> parseBlock(Indent parentIndent) {

		// First, determine the initial indentation of this block based on the
		// first statement (or null if there is no statement).
		Indent indent = getIndent();
		
		// Second, check that this is indeed the initial indentation for this
		// block (i.e. that it is strictly greater than parent indent).
		if (indent == null || indent.lessThanEq(parentIndent)) {
			// Initial indent either doesn't exist or is not strictly greater
			// than parent indent and,therefore, signals an empty block.
			//
			return Collections.EMPTY_LIST;
		} else {
			// Initial indent is valid, so we proceed parsing statements with
			// the appropriate level of indent.
			//
			ArrayList<Stmt> stmts = new ArrayList<Stmt>();
			Indent nextIndent;
			while ((nextIndent = getIndent()) != null
					&& indent.lessThanEq(nextIndent)) {
				// At this point, nextIndent contains the indent of the current
				// statement. However, this still may not be equivalent to this
				// block's indentation level.

				// First, check the indentation matches that for this block.
				if (!indent.equivalent(nextIndent)) {
					// No, it's not equivalent so signal an error.
					syntaxError("unexpected end-of-block", indent);
				}

				// Second, parse the actual statement at this point!
				stmts.add(parseStatement(indent));
			}

			return stmts;
		}
	}

	/**
	 * Determine the indentation as given by the Indent token at this point (if
	 * any). If none, then <code>null</code> is returned.
	 * 
	 * @return
	 */
	private Indent getIndent() {
		if (index < tokens.size() && tokens.get(index) instanceof Indent) {
			return (Indent) tokens.get(index);
		} else {
			return null;
		}
	}

	/**
	 * Parse a given statement. There are essentially two forms of statement:
	 * <code>simple</code> and <code>compound</code>. Simple statements (e.g.
	 * assignment, <code>print</code>, etc) are always occupy a single line and
	 * are terminated by a <code>NewLine</code> token. Compound statements (e.g.
	 * <code>if</code>, <code>while</code>, etc) themselves contain blocks of
	 * statements and are not (generally) terminated by a <code>NewLine</code>. 
	 * 
	 * @param indent
	 *            The indent level for the current statement. This is needed in
	 *            order to constraint the indent level for any sub-blocks (e.g.
	 *            for <code>while</code> or <code>if</code> statements).
	 * 
	 * @return
	 */
	private Stmt parseStatement(Indent indent) {
		checkNotEof();
		Token token = tokens.get(index);
		Stmt stmt;
		
		switch(token.kind) {
		case Return:
			return parseReturnStatement();
		case Print:
			return parsePrintStatement();
		case If:
			return parseIfStatement(indent);
		case While:
			return parseWhile(indent);
		case For:
			return parseFor(indent);
		case Identifier:
			if (lookahead(Token.Kind.Identifier, Token.Kind.LeftBrace) != null) {
				return parseInvokeStatement(); 
			}
		}
		
		if (isStartOfType(index)) {
			stmt = parseVariableDeclaration();
		} else {
			// invocation or assignment
			int start = index;
			Expr t = parseExpression();
			if (t instanceof Expr.Invoke) {
				stmt = (Expr.Invoke) t;
			} else {
				index = start;
				stmt = parseAssign();
			}
		}
		
		return stmt;
	}

	/**
	 * Determine whether or not a given position marks the beginning of a type
	 * declaration or not. This is important to help determine whether or not
	 * this is the beginning of a variable declaration.
	 * 
	 * @param index
	 *            Position in the token stream to begin looking from.
	 * @return
	 */
	private boolean isStartOfType(int index) {
		if (index >= tokens.size()) {
			return false;
		}
		Token lookahead = tokens.get(index);
		switch(lookahead.kind) {
		case Void:
		case Null:
		case Bool:
		case Int:
		case Real:
		case Char:
		case String:
			return true;
		case Identifier:
			return userDefinedTypes.contains(lookahead.text);
		case LeftCurly:
		case LeftSquare:				
			return isStartOfType(index + 1);
		}		

		return false;
	}

	/**
	 * Parse an invoke statement, which has the form:
	 * 
	 * <pre>
	 * Identifier '(' ( Expression )* ')' NewLine
	 * </p>
	 * 
	 * @return
	 */
	private Expr.Invoke parseInvokeStatement() {
		int start = index;
		// An invoke statement begins with the name of the function to be
		// invoked.
		Identifier name = matchIdentifier();
		// This is followed by zero or more comma-separated arguments enclosed
		// in braces.
		match("(");
		boolean firstTime = true;
		ArrayList<Expr> args = new ArrayList<Expr>();
		while (index < tokens.size()
				&& !(tokens.get(index) instanceof RightBrace)) {
			if (!firstTime) {
				match(",");
			} else {
				firstTime = false;
			}
			Expr e = parseExpression();
			args.add(e);

		}
		match(")");
		// Finally, a new line indicates the end-of-statement
		int end = index;
		matchEndLine();	
		// Done
		return new Expr.Invoke(name.text, args, sourceAttr(start, end - 1));
	}

	/**
	 * Parse a variable declaration statement, which has the form:
	 * 
	 * <pre>
	 * Type Identifier ['=' Expression] NewLine
	 * </pre>
	 * 
	 * The optional <code>Expression</code> assignment is referred to as an
	 * <i>initialiser</i>.
	 * 
	 * @return
	 */
	private Stmt.VariableDeclaration parseVariableDeclaration() {
		int start = index;
		// Every variable declaration consists of a declared type and variable
		// name.
		Type type = parseType();
		Identifier id = matchIdentifier();
		// A variable declaration may optionally be assigned an initialiser
		// expression.
		Expr initialiser = null;
		if (optionalMatch("=")) {
			initialiser = parseExpression();
		}
		// Finally, a new line indicates the end-of-statement
		int end = index;
		matchEndLine();		
		// Done.
		return new Stmt.VariableDeclaration(type, id.text, initialiser,
				sourceAttr(start, end - 1));
	}

	/**
	 * Parse a return statement, which has the form:
	 * 
	 * <pre>
	 * "return" [Expression] NewLine
	 * </pre>
	 * 
	 * The optional expression is referred to as the <i>return value</i>.
	 * 
	 * @return
	 */
	private Stmt.Return parseReturnStatement() {
		int start = index;
		// Every return statement begins with the return keyword!
		matchKeyword("return");
		Expr e = null;
		// A return statement may optionally have a return expression.
		
		// FIXME: resolve look ahead problem		
		if (index < tokens.size() && !(tokens.get(index) instanceof SemiColon)) {
			e = parseExpression();
		}
		// Finally, a new line indicates the end-of-statement
		int end = index;
		matchEndLine();		
		// Done.
		return new Stmt.Return(e, sourceAttr(start, end - 1));
	}

	/**
	 * Parse a print statement, which has the form:
	 * 
	 * <pre>
	 * "print" Expression
	 * </pre>
	 * 
	 * @return
	 */
	private Stmt.Print parsePrintStatement() {
		int start = index;
		// A print statement begins with the keyword "print"
		matchKeyword("print");
		// Followed by the expression who's value will be printed.
		Expr e = parseExpression();
		// Finally, a new line indicates the end-of-statement
		int end = index;
		matchEndLine();
		// Done
		return new Stmt.Print(e, sourceAttr(start, end - 1));
	}

	/**
	 * Parse an if statement, which is has the form:
	 * 
	 * <pre>
	 * if Expression ':' NewLine Block ["else" ':' NewLine Block]
	 * </pre>
	 * 
	 * As usual, the <code>else</block> is optional.
	 * 
	 * @param indent
	 * @return
	 */
	private Stmt parseIfStatement(Indent indent) {
		int start = index;
		// An if statement begins with the keyword "if"
		matchKeyword("if");
		// Followed by an expression representing the condition.
		Expr c = parseExpression();
		// The a colon to signal the start of a block.
		match(":");
		matchEndLine();
		
		int end = index;
		// First, parse the true branch, which is required
		List<Stmt> tblk = parseBlock(indent);
		
		// Second, attempt to parse the false branch, which is optional.
		List<Stmt> fblk = Collections.emptyList();		
		if (optionalMatch("else")) {
			if (index < tokens.size() && tokens.get(index).text.equals("if")) {
				Stmt if2 = parseIfStatement(indent);
				fblk = new ArrayList<Stmt>();
				fblk.add(if2);
			} else {
				match(":");
				fblk = parseBlock(indent);
			}
		}
		// Done!
		return new Stmt.IfElse(c, tblk, fblk, sourceAttr(start, end - 1));
	}

	/**
	 * Parse a while statement, which has the form:
	 * <pre>
	 * "while" Expression ':' NewLine Block
	 * </pre>
	 * @param indent
	 * @return
	 */
	private Stmt parseWhile(Indent indent) {
		int start = index;
		matchKeyword("while");
		match("(");
		Expr condition = parseExpression();
		match(")");
		int end = index;
		List<Stmt> blk = parseBlock(indent);

		return new Stmt.While(condition, blk, sourceAttr(start, end - 1));
	}

	private Stmt parseFor(Indent indent) {
		int start = index;
		matchKeyword("for");
		match("(");
		Stmt.VariableDeclaration declaration = parseVariableDeclaration();
		match(";");
		Expr condition = parseExpression();
		match(";");
		Stmt increment = parseStatement(indent);
		int end = index;
		match(")");
		List<Stmt> blk = parseBlock(indent);

		return new Stmt.For(declaration, condition, increment, blk, sourceAttr(
				start, end - 1));
	}

	/**
	 * Parse an assignment statement of the form "lval = expression".
	 * 
	 * @return
	 */
	private Stmt parseAssign() {
		// standard assignment
		int start = index;
		Expr lhs = parseExpression();
		if (!(lhs instanceof Expr.LVal)) {
			syntaxError("expecting lval, found " + lhs + ".", lhs);
		}
		match("=");
		Expr rhs = parseExpression();
		int end = index;
		return new Stmt.Assign((Expr.LVal) lhs, rhs, sourceAttr(start, end - 1));
	}

	private Expr parseExpression() {
		checkNotEof();
		int start = index;
		Expr c1 = parseConditionExpression();

		if (optionalMatch(SYMBOL.LogicalAnd)) {
			Expr c2 = parseExpression();
			return new Expr.Binary(Expr.BOp.AND, c1, c2, sourceAttr(start,
					index - 1));
		} else if (optionalMatch(SYMBOL.LogicalOr)) {
			Expr c2 = parseExpression();
			return new Expr.Binary(Expr.BOp.OR, c1, c2, sourceAttr(start,
					index - 1));
		}
		return c1;
	}

	private Expr parseConditionExpression() {
		int start = index;

		Expr lhs = parseAppendExpression();

		if (optionalMatch(SYMBOL.LessEquals)) {
			Expr rhs = parseAppendExpression();
			return new Expr.Binary(Expr.BOp.LTEQ, lhs, rhs, sourceAttr(start,
					index - 1));
		} else if (optionalMatch(SYMBOL.LeftAngle)) {
			Expr rhs = parseAppendExpression();
			return new Expr.Binary(Expr.BOp.LT, lhs, rhs, sourceAttr(start,
					index - 1));
		} else if (optionalMatch(SYMBOL.GreaterEquals)) {
			Expr rhs = parseAppendExpression();
			return new Expr.Binary(Expr.BOp.GTEQ, lhs, rhs, sourceAttr(start,
					index - 1));
		} else if (optionalMatch(SYMBOL.RightAngle)) {
			Expr rhs = parseAppendExpression();
			return new Expr.Binary(Expr.BOp.GT, lhs, rhs, sourceAttr(start,
					index - 1));
		} else if (optionalMatch(SYMBOL.EqualsEquals)) {
			Expr rhs = parseAppendExpression();
			return new Expr.Binary(Expr.BOp.EQ, lhs, rhs, sourceAttr(start,
					index - 1));
		} else if (optionalMatch(SYMBOL.NotEquals)) {
			Expr rhs = parseAppendExpression();
			return new Expr.Binary(Expr.BOp.NEQ, lhs, rhs, sourceAttr(start,
					index - 1));
		} else {
			return lhs;
		}
	}

	private Expr parseAppendExpression() {
		int start = index;
		Expr lhs = parseAddSubExpression();

		if (optionalMatch(SYMBOL.PlusPlus)) {			
			Expr rhs = parseAppendExpression();
			return new Expr.Binary(Expr.BOp.APPEND, lhs, rhs, sourceAttr(start,
					index - 1));
		}

		return lhs;
	}

	private Expr parseAddSubExpression() {
		int start = index;
		Expr lhs = parseMulDivExpression();

		if (optionalMatch(SYMBOL.Plus)) {			
			Expr rhs = parseAddSubExpression();
			return new Expr.Binary(Expr.BOp.ADD, lhs, rhs, sourceAttr(start,
					index - 1));
		} else if (optionalMatch(SYMBOL.Minus)) {
			Expr rhs = parseAddSubExpression();
			return new Expr.Binary(Expr.BOp.SUB, lhs, rhs, sourceAttr(start,
					index - 1));
		}

		return lhs;
	}

	private Expr parseMulDivExpression() {
		int start = index;
		Expr lhs = parseIndexTerm();

		if (optionalMatch(SYMBOL.Star)) {
			Expr rhs = parseMulDivExpression();
			return new Expr.Binary(Expr.BOp.MUL, lhs, rhs, sourceAttr(start,
					index - 1));
		} else if (optionalMatch(SYMBOL.RightSlash)) {
			Expr rhs = parseMulDivExpression();
			return new Expr.Binary(Expr.BOp.DIV, lhs, rhs, sourceAttr(start,
					index - 1));
		} else if(optionalMatch(SYMBOL.Percent)) {
			Expr rhs = parseMulDivExpression();
			return new Expr.Binary(Expr.BOp.REM, lhs, rhs, sourceAttr(start,
					index - 1));
		}

		return lhs;
	}

	private Expr parseIndexTerm() {
		checkNotEof();
		int start = index;
		Expr lhs = parseTerm();
		Token lookahead;
		
		if (index < tokens.size()) {
			lookahead = tokens.get(index);
		} else {
			lookahead = null;
		}
		
		while (lookahead instanceof LeftSquare || lookahead instanceof Dot
				|| lookahead instanceof LeftBrace) {
			start = index;
			if (lookahead instanceof LeftSquare) {
				match("[");
				Expr rhs = parseAddSubExpression();
				match("]");
				lhs = new Expr.IndexOf(lhs, rhs, sourceAttr(start, index - 1));
			} else {
				match(".");
				String name = matchIdentifier().text;
				lhs = new Expr.RecordAccess(lhs, name, sourceAttr(start,
						index - 1));
			}
			
			if (index < tokens.size()) {
				lookahead = tokens.get(index);
			} else {
				lookahead = null;
			}
		}

		return lhs;
	}

	private Expr parseTerm() {
		checkNotEof();

		int start = index;
		Token token = tokens.get(index);

		if (optionalMatch(SYMBOL.LeftBrace)) {			
			if (isStartOfType(index)) {
				// indicates a cast
				Type t = parseType();
				match(SYMBOL.RightBrace);
				Expr e = parseExpression();
				return new Expr.Cast(t, e, sourceAttr(start, index - 1));
			} else {
				Expr e = parseExpression();				
				match(SYMBOL.RightBrace);
				return e;
			}
		} else if ((index + 1) < tokens.size() && token instanceof Identifier
				&& tokens.get(index + 1) instanceof LeftBrace) {
			// must be a method invocation
			return parseInvokeExpr();
		} else if (token.text.equals("null")) {
			matchKeyword("null");
			return new Expr.Constant(null, sourceAttr(start, index - 1));
		} else if (token.text.equals("true")) {
			matchKeyword("true");
			return new Expr.Constant(true, sourceAttr(start, index - 1));
		} else if (token.text.equals("false")) {
			matchKeyword("false");
			return new Expr.Constant(false, sourceAttr(start, index - 1));
		} else if (token instanceof Identifier) {
			return new Expr.Variable(matchIdentifier().text, sourceAttr(start,
					index - 1));
		} else if (token instanceof Lexer.Char) {
			char val = match(Lexer.Char.class, "a character").value;
			return new Expr.Constant(new Character(val), sourceAttr(start,
					index - 1));
		} else if (token instanceof Int) {
			int val = match(Int.class, "an integer").value;
			return new Expr.Constant(val, sourceAttr(start, index - 1));
		} else if (token instanceof Value) {
			double val = match(Value.class, "a real").value;
			return new Expr.Constant(val, sourceAttr(start, index - 1));
		} else if (token instanceof Strung) {
			return parseString();
		} else if (token instanceof Minus) {
			return parseNegation();
		} else if (token instanceof Bar) {
			return parseLengthOf();
		} else if (token instanceof LeftSquare) {
			return parseListVal();
		} else if (token instanceof LeftCurly) {
			return parseRecordVal();
		} else if (token instanceof Shreak) {
			match("!");
			return new Expr.Unary(Expr.UOp.NOT, parseTerm(), sourceAttr(start,
					index - 1));
		}
		syntaxError("unrecognised term (\"" + token.text + "\")", token);
		return null;
	}

	private Expr parseListVal() {
		int start = index;
		ArrayList<Expr> exprs = new ArrayList<Expr>();
		match("[");
		boolean firstTime = true;
		checkNotEof();
		Token token = tokens.get(index);
		while (!(token instanceof RightSquare)) {
			if (!firstTime) {
				match(",");

			}
			firstTime = false;
			exprs.add(parseExpression());

			checkNotEof();
			token = tokens.get(index);
		}
		match("]");
		return new Expr.ListConstructor(exprs, sourceAttr(start, index - 1));
	}

	private Expr parseRecordVal() {
		int start = index;
		match("{");
		HashSet<String> keys = new HashSet<String>();
		ArrayList<Pair<String, Expr>> exprs = new ArrayList<Pair<String, Expr>>();
		checkNotEof();
		Token token = tokens.get(index);
		boolean firstTime = true;
		while (!(token instanceof RightCurly)) {
			if (!firstTime) {
				match(",");
			}
			firstTime = false;

			checkNotEof();
			token = tokens.get(index);
			Identifier n = matchIdentifier();

			if (keys.contains(n.text)) {
				syntaxError("duplicate tuple key", n);
			}

			match(":");

			Expr e = parseExpression();
			exprs.add(new Pair<String, Expr>(n.text, e));
			keys.add(n.text);
			checkNotEof();
			token = tokens.get(index);
		}
		match("}");
		return new Expr.RecordConstructor(exprs, sourceAttr(start, index - 1));
	}

	private Expr parseLengthOf() {
		int start = index;
		match("|");
		Expr e = parseIndexTerm();
		match("|");
		return new Expr.Unary(Expr.UOp.LENGTHOF, e,
				sourceAttr(start, index - 1));
	}

	private Expr parseNegation() {
		int start = index;
		match("-");
		Expr e = parseIndexTerm();

		if (e instanceof Expr.Constant) {
			Expr.Constant c = (Expr.Constant) e;
			if (c.getValue() instanceof Integer) {
				int bi = (Integer) c.getValue();
				return new Expr.Constant(-bi, sourceAttr(start, index));
			} else if (c.getValue() instanceof Double) {
				double br = (Double) c.getValue();
				return new Expr.Constant(-br, sourceAttr(start, index));
			}
		}

		return new Expr.Unary(Expr.UOp.NEG, e, sourceAttr(start, index));
	}

	private Expr.Invoke parseInvokeExpr() {
		int start = index;
		Identifier name = matchIdentifier();
		match("(");
		boolean firstTime = true;
		ArrayList<Expr> args = new ArrayList<Expr>();
		while (index < tokens.size()
				&& !(tokens.get(index) instanceof RightBrace)) {
			if (!firstTime) {
				match(",");
			} else {
				firstTime = false;
			}
			Expr e = parseExpression();

			args.add(e);
		}
		match(")");
		return new Expr.Invoke(name.text, args, sourceAttr(start, index - 1));
	}

	private Expr parseString() {
		int start = index;
		String s = match(Strung.class, "a string").string;
		return new Expr.Constant(s, sourceAttr(start, index - 1));
	}

	private Type parseType() {
		int start = index;
		Type t = parseBaseType();

		// Now, attempt to look for union or intersection types.
		if (index < tokens.size() && tokens.get(index) instanceof Bar) {
			// this is a union type
			ArrayList<Type> types = new ArrayList<Type>();
			types.add(t);
			while (index < tokens.size() && tokens.get(index) instanceof Bar) {
				match("|");
				types.add(parseBaseType());
			}
			return new Type.Union(types, sourceAttr(start, index - 1));
		} else {
			return t;
		}
	}

	private Type parseBaseType() {
		checkNotEof();
		int start = index;
		Token token = tokens.get(index);
		Type t;

		if (token.text.equals("null")) {
			matchKeyword("null");
			t = new Type.Null(sourceAttr(start, index - 1));
		} else if (token.text.equals("int")) {
			matchKeyword("int");
			t = new Type.Int(sourceAttr(start, index - 1));
		} else if (token.text.equals("real")) {
			matchKeyword("real");
			t = new Type.Real(sourceAttr(start, index - 1));
		} else if (token.text.equals("void")) {
			matchKeyword("void");
			t = new Type.Void(sourceAttr(start, index - 1));
		} else if (token.text.equals("bool")) {
			matchKeyword("bool");
			t = new Type.Bool(sourceAttr(start, index - 1));
		} else if (token.text.equals("char")) {
			matchKeyword("char");
			t = new Type.Char(sourceAttr(start, index - 1));
		} else if (token.text.equals("string")) {
			matchKeyword("string");
			t = new Type.Strung(sourceAttr(start, index - 1));
		} else if (token instanceof LeftCurly) {
			// record type
			match("{");
			HashMap<String, Type> types = new HashMap<String, Type>();
			token = tokens.get(index);
			boolean firstTime = true;
			while (!(token instanceof RightCurly)) {
				if (!firstTime) {
					match(",");
				}
				firstTime = false;

				checkNotEof();
				token = tokens.get(index);
				Type tmp = parseType();

				Identifier n = matchIdentifier();

				if (types.containsKey(n.text)) {
					syntaxError("duplicate tuple key", n);
				}
				types.put(n.text, tmp);
				checkNotEof();
				token = tokens.get(index);
			}
			match("}");
			t = new Type.Record(types, sourceAttr(start, index - 1));
		} else if (token instanceof LeftSquare) {
			match("[");
			t = parseType();
			match("]");
			t = new Type.List(t, sourceAttr(start, index - 1));
		} else {
			Identifier id = matchIdentifier();
			t = new Type.Named(id.text, sourceAttr(start, index - 1));
		}

		return t;
	}

	/**
	 * This method attempts to match an optional token whilst skipping any
	 * whitespace in between. This method does not update the index unless it
	 * the match is successful.
	 * 
	 * @param text
	 * @return <code>true</code> if the match was successful, or
	 *         <code>false</code> otherwise.
	 */
	private boolean optionalMatch(String text) {
		int tmp = index;
		// First, skipp as much whitespace as possible
		while (tmp < tokens.size() && tokens.get(tmp) instanceof WhiteSpace) {
			tmp++;
		}
		if (tmp < tokens.size() && tokens.get(tmp).text.equals(text)) {
			// match!
			index = tmp + 1;
			return true;
		} else {
			// no match
			return false;
		}
	}
	
	/**
	 * This method attempts to match an optional symbol whilst skipping any
	 * whitespace in between. This method does not update the index unless it
	 * the match is successful.
	 * 
	 * @param symbol 
	 * @return <code>true</code> if the match was successful, or
	 *         <code>false</code> otherwise.
	 */
	private boolean optionalMatch(Lexer.SYMBOL symbol) {
		int tmp = index;
		// First, skipp as much whitespace as possible
		while (tmp < tokens.size() && tokens.get(tmp) instanceof WhiteSpace) {
			tmp++;
		}
		if (tmp < tokens.size()) {
			Token token = tokens.get(tmp);
			if (token instanceof Lexer.Symbol
					&& ((Lexer.Symbol) token).symbol == symbol) {
				// match!
				index = tmp + 1;
				return true;
			}
		} 
		// no match
		return false;		
	}
			
	private Token lookahead(Token.Kind kind) {		
		checkNotEof();
		Token t = tokens.get(index);
		if(t.kind == kind) { 			
			return t;
		}		
		return null; 
	}
	
	private Token[] lookahead(Token.Kind... kinds) {
		Token[] result = new Token[kinds.length];
		int tmp = index;
		for (int i = 0; i != result.length; ++i) {
			skipWhiteSpace(tmp);
			Token token = tokens.get(tmp++);
			if (token.kind == kinds[i]) {
				result[i] = token;
			} else {
				return null;
			}
		}
		return result;
	}
	
	private Token match(Token.Kind kind) {		
		checkNotEof();
		Token t = tokens.get(index);
		if(t.kind == kind) { 
			index = index + 1;
			return t;
		}		
		return null; 
	}

	private Token[] match(Token.Kind... kinds) {
		Token[] result = new Token[kinds.length];
		for (int i = 0; i != result.length; ++i) {
			checkNotEof();
			Token token = tokens.get(index++);
			if (token.kind == kinds[i]) {
				result[i] = token;
			} else {
				return null;
			}
		}
		return result;
	}
	
	/**
	 * Match a the end of a line. This is required to signal, for example, the
	 * end of the current statement.
	 */
	private void matchEndLine() {		
		// First, parse all whitespace characters (and return if we reach the
		// NewLine we're looking for)
		Token token;
		while (index < tokens.size()
				&& (token = tokens.get(index)) instanceof WhiteSpace) {
			index++;
			if (token instanceof NewLine) {
				// match!
				return;
			}
		}
		
		// Second, check whether we've reached the end-of-file (as signaled by
		// running out of tokens), or we've encountered some token which not a
		// newline. 
		if (index >= tokens.size()) {
			throw new SyntaxError("unexpected end-of-file", filename,
					index - 1, index - 1);
		} else {
			syntaxError("expected end-of-line", tokens.get(index));
		}
	}
	
	/**
	 * Check that the End-Of-File has not been reached. This method should be
	 * called from contexts where we are expecting something to follow.
	 */
	private void checkNotEof() {
		skipWhiteSpace();
		
		if (index >= tokens.size()) {
			throw new SyntaxError("unexpected end-of-file", filename,
					index - 1, index - 1);
		}
		return;
	}

	
	/**
	 * Skip over any whitespace characters.
	 */
	private void skipWhiteSpace() {
		while (index < tokens.size() && isWhiteSpace(tokens.get(index))) {
			index++;
		}
	}
	
	/**
	 * Define what is considered to be whitespace.
	 * 
	 * @param token
	 * @return
	 */
	private boolean isWhiteSpace(Token token) {
		return token.kind == Token.Kind.NewLine
				|| token.kind == Token.Kind.Indent;
	}
	
	private Attribute.Source sourceAttr(int start, int end) {
		Token t1 = tokens.get(start);
		Token t2 = tokens.get(end);
		return new Attribute.Source(t1.start, t2.end());
	}

	private void syntaxError(String msg, Expr e) {
		Attribute.Source loc = e.attribute(Attribute.Source.class);
		throw new SyntaxError(msg, filename, loc.start, loc.end);
	}

	private void syntaxError(String msg, Token t) {
		throw new SyntaxError(msg, filename, t.start, t.start + t.text.length()
				- 1);
	}
			
	/**
	 * Represents a given amount of indentation. Specifically, a count of tabs
	 * and spaces. Observe that the order in which tabs / spaces occurred is not
	 * retained.
	 * 
	 * @author David J. Pearce
	 * 
	 */
	public static class Indent extends Token {
		private final int countOfSpaces;
		private final int countOfTabs;
		
		public Indent(String text, int pos) {
			super(Token.Kind.Indent, text, pos);
			// Count the number of spaces and tabs
			int nSpaces = 0;
			int nTabs = 0;
			for (int i = 0; i != text.length(); ++i) {
				char c = text.charAt(i);
				switch (c) {
				case ' ':
					nSpaces++;
					break;
				case '\t':
					nTabs++;
					break;
				default:
					throw new IllegalArgumentException(
							"Space or tab character expected");
				}
			}
			countOfSpaces = nSpaces;
			countOfTabs = nTabs;
		}
		
		/**
		 * Test whether this indentation is considered "less than or equivalent"
		 * to another indentation. For example, an indentation of 2 spaces is
		 * considered less than an indentation of 3 spaces, etc.
		 * 
		 * @param other
		 *            The indent to compare against.
		 * @return
		 */
		public boolean lessThanEq(Indent other) {
			return countOfSpaces <= other.countOfSpaces
					&& countOfTabs <= other.countOfTabs;
		}
		
		/**
		 * Test whether this indentation is considered "equivalent" to another
		 * indentation. For example, an indentation of 3 spaces followed by 1
		 * tab is considered equivalent to an indentation of 1 tab followed by 3
		 * spaces, etc.
		 * 
		 * @param other
		 *            The indent to compare against.
		 * @return
		 */
		public boolean equivalent(Indent other) {
			return countOfSpaces == other.countOfSpaces
					&& countOfTabs == other.countOfTabs;
		}
	}	
	
	/**
	 * An abstract indentation which represents the indentation of top-level
	 * declarations, such as function declarations. This is used to simplify the
	 * code for parsing indentation.
	 */
	private static final Indent ROOT_INDENT = new Indent("", 0);
}
