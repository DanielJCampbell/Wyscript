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

package wyjs.lang;

import java.util.*;
import wyjs.ModuleLoader;
import wyjs.util.*;

public class Module extends ModuleLoader.Skeleton {	
	private final String filename;
	private HashMap<Pair<String,Type.Fun>,Method> methods;
	private HashMap<String,TypeDef> types;
	private HashMap<String,ConstDef> constants;
	
	public Module(ModuleID mid,
			String filename,
			Collection<Method> methods,
			Collection<TypeDef> types,
			Collection<ConstDef> constants) {		
		super(mid);
		this.filename = filename;
		
		// first, init the caches
		this.methods = new HashMap<Pair<String,Type.Fun>, Method>();
		this.types = new HashMap<String, TypeDef>();
		this.constants = new HashMap<String, ConstDef>();
		
		// second, build the caches
		for(Method m : methods) {
			Pair<String,Type.Fun> p = new Pair<String,Type.Fun>(m.name(),m.type());
			Method tmp = this.methods.get(p);
			if (tmp != null) {
				throw new IllegalArgumentException(
						"Multiple function or method definitions with the same name and type not permitted");
			}
			this.methods.put(p,m);
		}
		
		for (TypeDef t : types) {
			TypeDef tmp = this.types.get(t.name());
			if (tmp != null) {
				throw new IllegalArgumentException(
						"Multiple type definitions with the same name not permitted");
			}
			this.types.put(t.name(), t);
		}

		for (ConstDef c : constants) {
			ConstDef tmp = this.constants.get(c.name());
			if (tmp != null) {
				throw new IllegalArgumentException(
						"Multiple constant definitions with the same name not permitted");
			}
			this.constants.put(c.name(), c);
		}
	}
	
	public String filename() {
		return filename;
	}
	
	public TypeDef type(String name) {
		return types.get(name);
	}
	
	public Collection<Module.TypeDef> types() {
		return types.values();
	}
	
	public ConstDef constant(String name) {
		return constants.get(name);
	}
	
	public Collection<Module.ConstDef> constants() {
		return constants.values();
	}
	
	public List<Method> method(String name) {
		ArrayList<Method> r = new ArrayList<Method>();
		for(Pair<String,Type.Fun> p : methods.keySet()) {
			if(p.first().equals(name)) {
				r.add(methods.get(p));
			}
		}
		return r;
	}
	
	public Method method(String name, Type.Fun ft) {
		return methods.get(new Pair<String, Type.Fun>(name, ft));
	}
	
	public Collection<Module.Method> methods() {
		return methods.values();
	}
	
	public boolean hasName(String name) {		
		return types.get(name) != null || constants.get(name) != null
				|| method(name).size() > 0;
	}
	
	public static class TypeDef {
		private String name;
		private Type type;		

		public TypeDef(String name, Type type) {			
			this.name = name;
			this.type = type;						
		}

		public String name() {
			return name;
		}

		public Type type() {
			return type;
		}
	}
	
	public static class ConstDef {
		private String name;		
		private Value constant;
		
		public ConstDef(String name, Value constant) {
			this.name = name;
			this.constant = constant;
		}
		
		public String name() {
			return name;
		}
		
		public Value constant() {
			return constant;
		}
	}
		
	public static class Method {
		private String name;		
		private Type.Fun type;
		private List<Case> cases;
		
		public Method(String name, Type.Fun type, Case... cases) {
			this.name = name;
			this.type = type;
			ArrayList<Case> tmp = new ArrayList<Case>();
			for (Case c : cases) {
				tmp.add(c);
			}
			this.cases = Collections.unmodifiableList(tmp);
		}
		
		public Method(String name, Type.Fun type,
				Collection<Case> cases) {
			this.name = name;
			this.type = type;
			this.cases = Collections
					.unmodifiableList(new ArrayList<Case>(cases));
		}
		
		public String name() {
			return name;
		}
		
		public Type.Fun type() {
			return type;
		}

		public List<Case> cases() {
			return cases;
		}

		public boolean isFunction() {
			return type.receiver == null;
		}
		
		public boolean isPublic() {
			return true;
		}
	}	
	
	public static class Case extends SyntacticElement.Impl {
		private final ArrayList<String> paramNames;
		private final Block body;

		public Case(Collection<String> paramNames, Block body) {
			this.paramNames = new ArrayList<String>(paramNames);
			this.body = body;
		}

		public Block body() {
			return body;
		}
				
		public List<String> parameterNames() {
			return paramNames;
		}
		
	}
}
