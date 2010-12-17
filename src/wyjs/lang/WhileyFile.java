// This file is part of the Whiley-to-Java Compiler (wyjc).
//
// The Whiley-to-Java Compiler is free software; you can redistribute 
// it and/or modify it under the terms of the GNU General Public 
// License as published by the Free Software Foundation; either 
// version 3 of the License, or (at your option) any later version.
//
// The Whiley-to-Java Compiler is distributed in the hope that it 
// will be useful, but WITHOUT ANY WARRANTY; without even the 
// implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
// PURPOSE.  See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public 
// License along with the Whiley-to-Java Compiler. If not, see 
// <http://www.gnu.org/licenses/>
//
// Copyright 2010, David James Pearce. 

package wyjc.lang;

import java.util.*;
import wyil.ModuleLoader;
import wyil.lang.*;
import wyil.util.SyntacticElement;
import wyil.util.SyntaxError;

public class WhileyFile {
	public final ModuleID module;
	public final String filename;
	public final ArrayList<Decl> declarations;
	
	public WhileyFile(ModuleID module, String filename, List<Decl> decls) {
		this.module = module;
		this.filename = filename;
		this.declarations = new ArrayList<Decl>(decls);
	}
	
	public ModuleLoader.Skeleton skeleton() {		
		return new ModuleLoader.Skeleton(module) {
			public boolean hasName(String name) {
				// FIXME: improve performance!
				for(Decl d : declarations) {
					if(d.name().equals(name)) {
						return true;
					}
				}
				return false;
			}			
		};
	}

	
	public interface Decl extends SyntacticElement {
		public String name();
	}
	
	public static class ImportDecl extends SyntacticElement.Impl implements Decl {
		public ArrayList<String> pkg;
		
		public ImportDecl(List<String> pkg, Attribute... attributes) {
			super(attributes);
			this.pkg = new ArrayList<String>(pkg);
		}
	
		public String name() {
			return "";
		}		
	}

	public static class ConstDecl extends
				SyntacticElement.Impl implements Decl {
		
		public final List<Modifier> modifiers;
		public final Expr constant;
		public final String name;

		public ConstDecl(List<Modifier> modifiers, Expr constant, String name,
				Attribute... attributes) {
			super(attributes);
			this.modifiers = modifiers;
			this.constant = constant;
			this.name = name;
		}

		public String name() {
			return name;
		}
		
		public boolean isPublic() {
			for(Modifier m : modifiers) {
				if(m instanceof Modifier.Public) {
					return true;
				}
			}
			return false;
		}
		
		public String toString() {
			return "define " + constant + " as " + name;
		}
	}
	
	public static class TypeDecl extends SyntacticElement.Impl implements Decl {
		public final List<Modifier> modifiers;
		public final UnresolvedType type;			
		public final String name;

		public TypeDecl(List<Modifier> modifiers, UnresolvedType type, String name,
				Attribute... attributes) {
			super(attributes);
			this.modifiers = modifiers;
			this.type = type;
			this.name = name;			
		}

		public boolean isPublic() {
			for(Modifier m : modifiers) {
				if(m instanceof Modifier.Public) {
					return true;
				}
			}
			return false;
		}
		
		public String name() { return name; }		
		
		public String toString() {
			return "define " + type + " as " + name;
		}
	}

	public final static class FunDecl extends SyntacticElement.Impl implements Decl {
		public final ArrayList<Modifier> modifiers; 
		public final String name;
		public final UnresolvedType receiver;
		public final UnresolvedType ret;
		public final ArrayList<Parameter> parameters;
		public final ArrayList<Stmt> statements;
		
		/**
		 * Construct an object representing a Whiley function.
		 * 
		 * @param name -
		 *            The name of the function.
		 * @param returnType -
		 *            The return type of this method
		 * @param paramTypes -
		 *            The list of parameter names and their types for this method
		 * @param precondition -
		 *            The constraint which must hold true on entry and exit (maybe null)
		 * @param statements -
		 *            The Statements making up the function body.
		 */
		public FunDecl(List<Modifier> modifiers, String name,
				UnresolvedType receiver, UnresolvedType ret,
				List<Parameter> parameters, List<Stmt> statements,
				Attribute... attributes) {
			super(attributes);
			this.modifiers = new ArrayList<Modifier>(modifiers);
			this.name = name;
			this.receiver = receiver;
			this.ret = ret;
			this.parameters = new ArrayList<Parameter>(parameters);
			this.statements = new ArrayList<Stmt>(statements);
		}
		
		public boolean isPublic() {
			for(Modifier m : modifiers) {
				if(m instanceof Modifier.Public) {
					return true;
				}
			}
			return false;
		}
		
		public String name() {
			return name;
		}
	}
	
	public static final class Parameter extends SyntacticElement.Impl implements Decl {
		public final UnresolvedType type;
		public final String name;

		public Parameter(UnresolvedType type, String name, Attribute... attributes) {
			super(attributes);
			this.type = type;
			this.name = name;
		}
		
		public String name() {
			return name;
		}
	}	
}
