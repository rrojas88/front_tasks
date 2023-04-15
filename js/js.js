
var execBtn = document.getElementById("execute");
var outputElm = document.getElementById('output');
var errorElm = document.getElementById('error');
var commandsElm = document.getElementById('commands');
var dbFileElm = document.getElementById('dbfile');
var savedbElm = document.getElementById('savedb');

let db = null

const init = async () => {
	console.log('Inicio x1 ')
	const SQL = await initSqlJs({
		// HAce un Get:
		locateFile: file => `https://sql.js.org/dist/${file}`
		//locateFile: file => `js/sql-wasm.wasm`
	});
	db = new SQL.Database();
}
init()


// Create an HTML table
var tableCreate = function () {
	function valconcat(vals, tagName) {
		if (vals.length === 0) return '';
		var open = '<' + tagName + '>', close = '</' + tagName + '>';
		return open + vals.join(close + open) + close;
	}
	return function (columns, values) {
		var tbl = document.createElement('table');
		var html = '<thead>' + valconcat(columns, 'th') + '</thead>';
		var rows = values.map(function (v) { return valconcat(v, 'td'); });
		html += '<tbody>' + valconcat(rows, 'tr') + '</tbody>';
		tbl.innerHTML = html;
		return tbl;
	}
}();

// Execute the commands when the button is clicked
function execEditorContents() {
	let querys = commandsElm.value
	console.log({ querys })

	try {
		//db.run( querys , []);
		db.run( querys );
	}
	catch ( err1 ) {
		console.log('Error 1:');
		console.log( err1 );
	}
	// Mostrar los datos de la tabla en la consola del navegador
	try {
		let resultado = db.exec('SELECT * FROM employees');
		console.log('resultado employees:');
		console.log(resultado);
	}
	catch ( err ) {
		console.log('Error employees:');
		console.log( err );
	}
}
execBtn.addEventListener("click", execEditorContents, true);


// Load a db from a file
dbFileElm.onchange = function () {
	var f = dbFileElm.files[0];
	var r = new FileReader();
	r.onload = function () {
		console.log("Loading database from file");
		// Show the schema of the loaded database
		//editor.setValue("SELECT `name`, `sql`\n  FROM `sqlite_master`\n  WHERE type='table';");
		execEditorContents();
	}
	r.readAsArrayBuffer(f);
}

// Save the db to a file
function savedb(  ) {
	//var arraybuff = event.data.buffer;
	const binaryArray = db.export();
	var blob = new Blob([ binaryArray ]);
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.href = window.URL.createObjectURL(blob);
	a.download = "sql.db";
	a.onclick = function () {
		setTimeout(function () {
			window.URL.revokeObjectURL(a.href);
		}, 1500);
	};
	a.click();
}
savedbElm.addEventListener("click", savedb, true);


const init2 = async () => {
	console.log('Inicio x2 ')
	config = {
		//locateFile: filename => `/dist/${filename}`
	}
	// The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
	// We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
	initSqlJs(config).then(function( SQLite ){
		//Create the database
		const db22 = new SQLite.Database();
		// Run a query without reading the results
		db22.run("CREATE TABLE test (col1, col2);");
		// Insert two rows: (1,111) and (2,222)
		db22.run("INSERT INTO test VALUES (?,?), (?,?)", [1,111,2,222]);
  
		// Prepare a statement
		const stmt = db22.prepare("SELECT * FROM test WHERE col1 BETWEEN $start AND $end");
		stmt.getAsObject({$start:1, $end:1}); // {col1:1, col2:111}
  
		// Bind new values
		stmt.bind({$start:1, $end:2});
		while( stmt.step() ) {
			const row = stmt.getAsObject();
			console.log('Here is a row: ' + JSON.stringify(row));
		}
	});
}
init2()

