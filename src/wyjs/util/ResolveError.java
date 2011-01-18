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

package wyjs.util;

/**
 * A resolve error is thrown by the ModuleLoader, when it was unable to resolve
 * a given class or package. This generally indicates some kind of compile time
 * error (e.g. trying to import from module that doesn't exist). However, it
 * could also indicate that the WHILEYPATH is not configured correctly.
 * 
 * @author David Pearce
 */
@SuppressWarnings("serial")
public class ResolveError extends Exception {

  public ResolveError(String msg) {
    super(msg);
  }

  public ResolveError(String msg, Throwable ex) {
    super(msg, ex);
  }
}
