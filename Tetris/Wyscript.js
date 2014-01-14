"use strict";

var Wyscript = {};
Wyscript.funcs = {};		//Will store variables created for for-each loops
Wyscript.labels = {};	//Used to store variables created for switch statements

//FLOAT CLASS/METHODS
Wyscript.Float = function (i) {
	if ( i.num !== undefined) {
		this.num = i.num;
	}
	else {
		this.num = i;
	}
	this.type = new Wyscript.Type.Real();
};

Wyscript.Float.prototype.add = function (other) {
	return new Wyscript.Float(this.num + other.num);
};

Wyscript.Float.prototype.sub = function(other) {
	return new Wyscript.Float(this.num - other.num);
};

Wyscript.Float.prototype.mul = function(other) {
	return new Wyscript.Float(this.num * other.num);
};

Wyscript.Float.prototype.div = function(other) {
	return new Wyscript.Float(this.num / other.num);
};

Wyscript.Float.prototype.rem = function(other) {
	return new Wyscript.Float(this.num % other.num);
};
		
Wyscript.Float.prototype.cast = function(type) {
    if (type === 'real') {
      return new Wyscript.Float(this.num);
   }
	
   return new Wyscript.Integer(this.num);
};

Wyscript.Float.prototype.toString = function() {
    var tmp = this.num.toString();
    var abs = Math.abs(this.num);
    if (abs < 0.001 || abs >= 10000000) {
		tmp = this.num.toExponential().replace('e', 'E');
	}
	if (tmp.indexOf('.') === -1) {
		if (tmp.indexOf('E') !== -1) {
		    tmp = tmp.replace('E', '.0E');
		 }
		else {
			tmp += '.0';
		}
	}
	return new Wyscript.String(tmp);
};

//INTEGER CLASS/METHODS
Wyscript.Integer = function(i) {
	this.type = new Wyscript.Type.Int();
	if (i.num !== undefined) {
		this.num = ~~(i.num);
	}
	else {
		this.num = ~~i;
	}
};

Wyscript.Integer.prototype.add = function(other) {
	if (other instanceof Wyscript.Integer) {
		return new Wyscript.Integer(this.num + other.num);
	}
	
	return new Wyscript.Float(this.num + other.num);
};

Wyscript.Integer.prototype.sub = function(other) {
	if (other instanceof Wyscript.Integer) {
		return new Wyscript.Integer(this.num - other.num);
	}
		
	return new Wyscript.Float(this.num - other.num);
};

Wyscript.Integer.prototype.mul = function(other) {
	if (other instanceof Wyscript.Integer) {
		return new Wyscript.Integer(this.num * other.num);
	}
		
	return new Wyscript.Float(this.num * other.num);
};

Wyscript.Integer.prototype.div = function(other) {
	var tmp = this.num / other.num;
	if (other instanceof Wyscript.Integer) {
		return new Wyscript.Integer(~~tmp);
	}
	
	return new Wyscript.Float(this.num / other.num);
};

Wyscript.Integer.prototype.rem = function(other) {	
	if (other instanceof Wyscript.Integer) {
		return new Wyscript.Integer(this.num % other.num);
	}
		
	return new Wyscript.Float(this.num % other.num);
};
		
Wyscript.Integer.prototype.cast = function(type) {
	if (type === 'int') {
	  return new Wyscript.Integer(this.num);
	}
	  
	return new Wyscript.Float(this.num);
};

Wyscript.Integer.prototype.toString = function() {
	return new Wyscript.String(this.num.toFixed());
};

//BINARY METHODS

//Creates a list of integers equivalent to the given range
Wyscript.range = function(lower, upper) {
  var low = lower;
  var up = upper;
  var tmp = low;
  
  if (low.num !== undefined) {
  		low = lower.num;
  }
  
  if (up.num !== undefined) {
  		up = upper.num;
  }
  
  var result = [];
  var count = 0;
  
  for (tmp = low; tmp < up; tmp++) {
    result[count++] = new Wyscript.Integer(tmp);
  }
  return result;
};

//Checks if two objects are equal (or not equal, based on the isEqual parameter)
Wyscript.equals = function(lhs, rhs, isEqual) {
  var left = lhs;
  if (left.num !== undefined) {
  		left = left.num;
  }
  else if (left instanceof Wyscript.String) {
  		left = left.text;
  }
  else if (left instanceof Wyscript.Char) {
  		left = left.char;
  }
  else if (left instanceof Wyscript.List) {
    	if (isEqual) {
    		return left.equals(rhs);
    	}
    	return !(left.equals(rhs));
  }
  var right = rhs;
  if (right.num !== undefined) {
  		right = right.num;
  	}
  else if (right instanceof Wyscript.String) {
  		right = right.text;
  	}
  else if (right instanceof Wyscript.Char) {
  		right = right.char;
  	}
  
  if (isEqual) {
  		return left === right;
  	}
	return left !== right;
};

//Checks for less than and less than or equal to
Wyscript.lt = function(lhs, rhs, isEqual) {
  var left = lhs;
  if (left.num !== undefined) {
  		left = left.num;
  	}
  var right = rhs;
  if (right.num !== undefined) {
  		right = right.num;
  	}
  if (isEqual) {
  		return (left <= right);
  	}
  return (left < right);
};

//Checks for greater than and greater than or equal to
Wyscript.gt = function(lhs, rhs, isEqual) {
  var left = lhs;
  if (left.num !== undefined) {
  		left = left.num;
  	}
  var right = rhs;
  if (right.num !== undefined) {
  		right = right.num;
  	}
  if (isEqual) {
  		return (left >= right);
  	}
  return (left > right);
};

//RECORD CLASS/METHODS
Wyscript.Record = function(listNames, listValues, type) {
  this.names = listNames;
  this.values = listValues;
  this.type = type;
};

//Gets the value associated with a given field
Wyscript.Record.prototype.getValue = function(name) {
  var index = (name.text !== undefined) ? this.names.indexOf(name.text) : this.names.indexOf(name);
  if (index === -1 || index >= this.values.length) {
    return null;
 }
  var elem = this.values[index];
  return elem;
};

//Checks if a given field exists
Wyscript.Record.prototype.hasKey = function(name) {
	
  return (name.text !== undefined) ? (this.names.indexOf(name.text) !== -1) : (this.names.indexOf(name) !== -1);
};

//Puts the given key into the field associated with the given name, overwriting any existing value
Wyscript.Record.prototype.setValue = function(name, key) {
  var index = (name.text !== undefined) ?this.names.indexOf(name.text) : this.names.indexOf(name);
  if (index === -1 || index >= this.values.length) {
    	return;
   }
  this.values[index] = key;
};

//Casts a record - uses fieldList to determine what field actually has its type changed
Wyscript.Record.prototype.cast = function(name, fieldList, newType) {
	var index;
  var result = this.clone();
  if (fieldList.length > 0) {
    index = this.names.indexOf(fieldList[0]);
    var t = newType.getType(fieldList);
    result.values[index] = this.values[index].cast(name.toString(), fieldList.slice(1), t);
  }
  else {
    index = this.names.indexOf(name.toString());
    result.values[index] = this.values[index].cast();
  }
  result.type = newType;
  return result;
};

//Deep-Clones the record to ensure pass-by-value holds
Wyscript.Record.prototype.clone = function() {
  var i;
  var cnames = [];
  var cvalues = [];
  var elem;
  for (i = 0; i < this.names.length; i++) {
    cnames[i] = this.names[i];
    elem = this.values[i];
    if (elem instanceof Wyscript.List || elem instanceof Wyscript.Record) {
      elem = elem.clone();
   }
    cvalues[i] = elem;
  }
  return new Wyscript.Record(cnames, cvalues, this.type);
};

Wyscript.Record.prototype.toString = function() {
	var i;
  var str = '{';
  var tmpNames = [];
  var tmp;
  for (i = 0; i < this.names.length; i++) {
    tmpNames[i] = this.names[i];
    tmpNames.sort();
  }
  var first = true;
  for (i = 0; i < this.names.length; i++) {
    if (!first) {
      str += ',';
   }
    first = false;
    str += tmpNames[i];
    str += ':';
    tmp = this.values[this.names.indexOf(tmpNames[i])];
    str += (tmp === null) ? 'null' : tmp.toString().toString();
  }
  str += '}';
  return new Wyscript.String(str);
};

//LIST CLASS/METHODS
Wyscript.List = function(list, type) {
  this.list = list;
  this.type = type;
};

//Gets the value at a given index
Wyscript.List.prototype.getValue = function(index) {
  var idx = index;
  if (index.num !== undefined) {
  		idx = index.num;
  	}
  return this.list[idx];
};

//Sets the value at the given index to the given value
Wyscript.List.prototype.setValue = function(index, value) {
  var idx = index;
  if (index.num !== undefined) {
  		idx = index.num;
  	}
  this.list[idx] = value;
};

Wyscript.List.prototype.length = function() {
  return new Wyscript.Integer(this.list.length);
};

//Appends another list to this list (must be of same type)
Wyscript.List.prototype.append = function(other) {
  var result = [];
  var count = 0;
  var i;
  for (i = 0; i < this.list.length; i++) {
    result[count++] = this.list[i];
  }
  for (i = 0; i < other.list.length; i++) {
    result[count++] = other.list[i];
  }
  return new Wyscript.List(result, this.type);
};

//Casts the list - requires knowledge of a fieldList in case this list contains records
Wyscript.List.prototype.cast = function(name, fieldList, newType) {
  var tmp = [];
  var i;
  var t;
  
  for (i = 0; i < this.list.length; i++) {
    if (fieldList !== undefined && fieldList !== null && fieldList.length > 0) {
      t = newType.getType(fieldList);
      tmp[i] = this.list[i].cast(name, fieldList, t);
    }
    tmp[i] = this.list[i].cast(name, fieldList);
    
  }
  return new Wyscript.List(tmp, newType);
};

//Deep-Clones the list to ensure pass-by-value
Wyscript.List.prototype.clone = function() {
  var clist = [];
  var i;
  var elem;
  
  for (i = 0; i < this.list.length; i++) {
    elem = this.list[i];
    if (elem instanceof Wyscript.List || elem instanceof Wyscript.Record) {
      elem = elem.clone();
    }
    clist[i] = elem;
  }
  return new Wyscript.List(clist, this.type);
};

Wyscript.List.prototype.toString = function() {
  var str = '[';
  var first = true;
  var i;
  
  for (i = 0; i < this.list.length; i++) {
    if (!first) {
      str += ', ';
    }
    
    first = false;
    str += (this.list[i] === null) ? 'null' : (this.list[i].toString().toString());
  }
  str += ']';
  return new Wyscript.String(str);
};

Wyscript.List.prototype.equals = function(other) {
	
	var i;
	
  if (!(other instanceof Wyscript.List) || other === undefined) {
    return false;
 }
  if (this.length().num !== other.length().num) {
  	return false;
  }
  for (i = 0; i < this.list.length; i++) {
    if (!(Wyscript.equals(this.list[i], other.list[i], true))) {
      return false;
    }
  }
  return true;
};

//TYPE CLASSES AND METHODS
Wyscript.Type = function() {};

Wyscript.Type.Void = function() {};
Wyscript.Type.Void.prototype = new Wyscript.Type();
Wyscript.Type.Void.prototype.subtype = function() {
  //Void is a subtype of all types
  return true;
};

Wyscript.Type.Null = function() {};
Wyscript.Type.Null.prototype = new Wyscript.Type();
Wyscript.Type.Null.prototype.subtype = function(superType) {
  if (superType instanceof Wyscript.Type.Null) {
    return true;
  }
  return (superType instanceof Wyscript.Type.Union && superType.unionSupertype(this));
};

Wyscript.Type.Bool = function() {};
Wyscript.Type.Bool.prototype = new Wyscript.Type();
Wyscript.Type.Bool.prototype.subtype = function(superType) {
  if (superType instanceof Wyscript.Type.Bool) {
    return true;
  }
  return (superType instanceof Wyscript.Type.Union && superType.unionSupertype(this));
};

Wyscript.Type.Int = function() {};
Wyscript.Type.Int.prototype = new Wyscript.Type();
Wyscript.Type.Int.prototype.subtype = function(superType) {
  //Ints are a subtype of reals
  if (superType instanceof Wyscript.Type.Int || superType instanceof Wyscript.Type.Real) {
    return true;
  }
  return (superType instanceof Wyscript.Type.Union && superType.unionSupertype(this));
};

Wyscript.Type.Real = function() {};
Wyscript.Type.Real.prototype = new Wyscript.Type();
Wyscript.Type.Real.prototype.subtype = function(superType) {
  if (superType instanceof Wyscript.Type.Real) {
    return true;
  }
  return (superType instanceof Wyscript.Type.Union && superType.unionSupertype(this));
};

Wyscript.Type.Char = function() {};
Wyscript.Type.Char.prototype = new Wyscript.Type();
Wyscript.Type.Char.prototype.subtype = function(superType) {
  if (superType instanceof Wyscript.Type.Char) {
    return true;
  }
  return (superType instanceof Wyscript.Type.Union && superType.unionSupertype(this));
};

Wyscript.Type.String = function() {};
Wyscript.Type.String.prototype = new Wyscript.Type();
Wyscript.Type.String.prototype.subtype = function(superType) {
 if (superType instanceof Wyscript.Type.String) {
    return true;
 }
  return (superType instanceof Wyscript.Type.Union && superType.unionSupertype(this));
};

Wyscript.Type.List = function(elem) {this.elem = elem;};
Wyscript.Type.List.prototype = new Wyscript.Type();
Wyscript.Type.List.prototype.subtype = function(superType) {
  //A list is a subtype of a list if its element type is a subtype of the supertypes element type
  if (superType instanceof Wyscript.Type.List && this.elem.subtype(superType.elem)) {
    return true;
  }
  return (superType instanceof Wyscript.Type.Union && superType.unionSupertype(this));
};

//Used for determining the type when casting nested records - for a list, just return the element type
Wyscript.Type.List.prototype.getType = function() {
  return this.elem;
};

Wyscript.Type.Record = function(names, types) {
  this.names = names;
  this.types = types;
};
Wyscript.Type.Record.prototype = new Wyscript.Type();
Wyscript.Type.Record.prototype.subtype = function(superType) {
  //Uses depth subtyping, but not width subtyping (field names and numbers must match, must be subtypes)
  var i;
  var valid;
  
  if (superType instanceof Wyscript.Type.Record) {
    if (this.types.length === superType.types.length) {
      valid = true;
      for (i = 0; i < this.types.length; i++) {
	     if (!(this.names[i] === superType.names[i] && this.types[i].subtype(superType.types[i]))) {
	       valid = false;
	       break;
	     }
      }
      return valid;
    }
    return false;
  }
  return (superType instanceof Wyscript.Type.Union && superType.unionSupertype(this));
};

//Used to determine the type of nested casted records - return the type of the field
//corresponding to the first element of fieldList (which is always non-empty)
Wyscript.Type.Record.prototype.getType = function(fieldList) {
	
	var i = 0;
	
  for (i = 0; i < this.types.length; i++) {
    if (this.names[i] === fieldList[0]) {
      return this.types[i];
    }
  }
  return undefined; //Shouldn't happen
};

Wyscript.Type.Union = function(bounds) {this.bounds = bounds};
Wyscript.Type.Union.prototype = new Wyscript.Type();
Wyscript.Type.Union.prototype.subtype = function(superType) {
  //A union is a subtype of any type if all its bounds are subtypes of that type
  var i;
  
  for (i = 0; i < this.bounds.length; i++) {
    if (!(this.bounds[i].subtype(superType))) {
      return false;
    }
  }
  return true;
};

Wyscript.Type.Union.prototype.unionSupertype = function(bound) {
  //A union is a supertype of a type if any of its bounds are supertypes of the type
  //Note records containing union types have already been extracted into union types, so this is safe
  var i;
  
  for (i = 0; i < this.bounds.length; i++) {
    if (bound.subtype(this.bounds[i])) {
      return true;
    }
  }
  return false;
};

//CHARACTER AND STRING TYPES
Wyscript.Char = function(c) { this.char = c.toString(); this.type = new Wyscript.Type.Char();};

Wyscript.Char.prototype.toString = function() {
  return new Wyscript.String(this.char);
};

Wyscript.String = function(text) {
	this.text = text.toString();
	this.type = new Wyscript.Type.String();
};

//Allows you access the index'th character of a string
Wyscript.String.prototype.getValue = function(index) {
	if (index.num !== undefined) {
		index = index.num;
	}
	
  return new Wyscript.Char(this.text.charAt(index));
};

//Allows you to mutate the index'th character of a string to the given char
Wyscript.String.prototype.assign = function(index, char) {
	var tmp;	
	
  if (index.num !== undefined) {
    index = index.num;
  }
  
  tmp = this.text.split('');
  tmp[index] = char.toString().toString();
  return new Wyscript.String(tmp.join(''));
};

Wyscript.String.prototype.length = function() {
  return new Wyscript.Integer(this.text.length);
};

Wyscript.String.prototype.append = function(other) {
	return new Wyscript.String(this.text.concat(other.toString().toString()));
};

Wyscript.String.prototype.toString = function() {
  return this.text;
};

//prints to System.out
Wyscript.print = function(obj) {
  if (obj === null) {
    	sysout.println('null');
  }
  else {
  		sysout.println(obj.toString().toString());
  }
};

//Subtyping operator - checks if obj's type is a subtype of the given type
Wyscript.is = function(obj, type) {
  
  //Check primitive/simple types first
  if (type instanceof Wyscript.Type.Null) {
      if (obj === null) {
      	return true;
      }
      return false;
  }
      
  if (type instanceof Wyscript.Type.Bool) {
      if (obj instanceof Boolean || typeof obj === 'boolean') {
      	return true;
      }
      return false;
  }
      
  else if (type instanceof Wyscript.Type.String) {
      return (obj instanceof Wyscript.String);
  }
      
  else if (type instanceof Wyscript.Type.Char) {
      return (obj instanceof Wyscript.Char);
  }
  
  else if (type instanceof Wyscript.Type.Real) {
      if (obj instanceof Wyscript.Float || obj instanceof Wyscript.Integer) {
      	return true;
      }
      return false;
  }
      
  else if (type instanceof Wyscript.Type.Int) {
      if (obj instanceof Wyscript.Integer) {
      	return true;
      }
      return false;
  }
      
  else if (type instanceof Wyscript.Type.List) {
  	  return (obj instanceof Wyscript.List && obj.type.subtype(type));
  }
  
  else if (type instanceof Wyscript.Type.Record) {
  		return (obj instanceof Wyscript.Record && obj.type.subtype(type));
  }
  
  else if (type instanceof Wyscript.Type.Union) {
  		return Wyscript.getType(obj).subtype(type);
  }
  return false; //obj is not a subtype of type/type unknown
};

//Gets the type of the given object
Wyscript.getType = function(obj) {
	if (obj === null) {
		return new Wyscript.Type.Null();
	}
	if (obj instanceof Boolean || typeof obj === 'boolean') {
		return new Wyscript.Type.Bool();
	}
	return obj.type;
};

//Assigns a property with the given name and value to
//the given object - used to deal with recursive for-each
//loop variable storage
Wyscript.defProperty = function(obj, name, val) {
	Object.defineProperty(obj, name, {
		value: val,
		writable: true,
		configurable: true,
		enumerable: true});
};