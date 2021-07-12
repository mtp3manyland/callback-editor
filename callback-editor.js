/*
CallbackEditor by MTP3
edit callbacks without necessarily having to deal with terrible string manipulation directly™

CallbackEditor.prototype
	disassemble(Function func): Object funcobj
		Converts a function into a form that CallbackEditor can manipulate
	reassemble(Object funcobj): Function func
		Converts a funcobj generated by this.disassemble back to a new Function.

	toFuncString(Object funcobj): String string
		Returns a string that defines an anonymous arrow function with the funcobj's arguments and code.
	funcToString(Function func): String string
		Returns a string that defines an anonymous arrow function with the function's arguments and code.
		Disassembles func and runs this.toFuncString with the resulting funcobj.
	getCallString(String str, String args): String string
	getCallString(String str, Array args): String string
		Appends `args` to str, surrounded with parentheses. This creates a function call when converted to code.
		`args` is treated like in 'new Function(args, code)'.

	! Actual functions that I expect people to call.

	prepend(Function func, String string): Function func
		Prepends an arbitrary string to the beginning of the function.
		Automatically appends a semicolon during concatenation.
	append(Function func, String string): Function func
		Appends an arbitrary string to the end of the function.
		Automatically prepends a semicolon during concatenation.

	callBefore(Function func, String funcref, String args): Function func
	callBefore(Function func, String funcref, Array args): Function func
		Prepends a function call to the beginning of `func`. Does not overwrite the original reference.
		`funcref` is expected to be a path to the function accessible from the calling function.
		`args` is treated like in 'new Function(args, code)'.
	callAfter(Function func, String funcref, String args): Function func
	callAfter(Function func, String funcref, Array args): Function func
		Appends a function call to the end of `func`. Does not overwrite the original reference.
		`funcref` is expected to be a path to the Function variable accessible from the calling function.
		`args` is treated like in 'new Function(args, code)'.

	runBefore(Function func, Function func2, String args): Function func
	runBefore(Function func, Function func2, Array args): Function func
		Prepends a copy of `func2` to the beginning of `func`. Does not overwrite the original reference.
		`func2` inherits `func`'s scope.
		`args` is treated like in 'new Function(args, code)'.
	runAfter(Function func, Function func2, String args): Function func
	runAfter(Function func, Function func2, Array args): Function func
		Appends a copy of `func2` to the end of `func`. Does not overwrite the original reference.
		`func2` inherits `func`'s scope.
		`args` is treated like in 'new Function(args, code)'.
*/

if (typeof window.CallbackEditor === "undefined") {
	window.CallbackEditor = class {
		constructor() {
			let _console = consoleref;

			if (typeof _console === "undefined")
				_console = console;

			_console.log("%c loaded CallbackEditor by MTP3 ", "background: #aa7700; color: #ffff00");
		}

		disassemble(func) { /* Split up a function into strings for manipulation. */
			let code = func.toString();

			return {
				argumentStr: code.slice(code.indexOf("(") + 1, code.indexOf(")")),
				code: code.slice(code.indexOf("{") + 1, -1)
			}
		};

		reassemble(funcobj) { /* Generate a new function from a disassembled function. */
			return new Function(funcobj.argumentStr, funcobj.code);
		};

		toFuncString(funcobj) { /* Generate a stringified function from a disassembled function. */
			return "(" + funcobj.argumentStr + ")=>{" + funcobj.code + "}";
		};

		funcToString(func) { /* Stringify a function. */
			return this.toFuncString(this.disassemble(func));
		};

		getCallString(str, args) { /* Append function call syntax to a string, using an argument list. */
			let argstr;

			if (typeof args === "undefined")
				argstr = "";
			else
				argstr = args.toString();

			return str + `(${argstr})`;
		};

		prepend(func, string) { /* Prepend arbitrary text to the beginning of a function. */
			let funcobj = this.disassemble(func);
			funcobj.code = string + ";" + funcobj.code;
			return this.reassemble(funcobj);
		};

		append(func, string) { /* Append arbitrary text to the end of a function. */
			let funcobj = this.disassemble(func);
			funcobj.code += ";" + string;
			return this.reassemble(funcobj);
		};

		callBefore(func, funcref, args) { /* Prepend arbitrary function call to the beginning of a function. */
			return this.prepend(func, this.getCallString(funcref, args));
		};

		callAfter(func, funcref, args) { /* Append arbitrary function call to the end of a function. */
			return this.append(func, this.getCallString(funcref, args));
		};

		runBefore(func, func2, args) { /* Prepend arbitrary code to the beginning of a function. */
			return this.prepend(func, this.getCallString("(" + this.funcToString(func2) + ")", args));
		};

		runAfter(func, func2, args) { /* Append arbitrary code to the end of a function. */
			return this.append(func, this.getCallString("(" + this.funcToString(func2) + ")", args));
		};
	};

	window.callbackEditor = new CallbackEditor;
}
