const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'newuser',
	password : 'Newmysql@123',
	database : 'userdb'
});

const app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));


// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/index.html'));
});

// http://localhost:3000/slogin
app.post('/slogin', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});

// http://localhost:3000/auth
app.post('/sauth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM userTable WHERE user = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/shome');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


// http://localhost:3000/signup
app.post('/ssignup', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/signup.html'));
});

// http://localhost:3000/register
app.post('/register', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
    let confirm_password = request.body.confirm_password;
	// Ensure the input fields exists and are not empty
	if (username && password && confirm_password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM userTable WHERE user = ?', [username], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				response.send('Already Exists!')
			} else if(confirm_password!=password) {
				response.send('Password & Confirm Password is not Matched');
			}	else {
                var users={
                    user : request.body.username,
                    password: request.body.password
                  }
                var sql = 'INSERT INTO userTable SET ?';
                connection.query(sql,users, function(error,results){
                    if (error) throw error;
                    
                });
                response.send('entered into db!');
            }		
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// http://localhost:3000/tlogin
app.post('/tlogin', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/tlogin.html'));
});

// http://localhost:3000/tauth
app.post('/tauth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		
		if(username=='teacher' && password=='1234'){
			request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/thome');

		} else {
			response.send('Incorrect Username and/or Password!');
		}			
		response.end();
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// http://localhost:3000/hlogin
app.post('/hlogin', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/hlogin.html'));
});

// http://localhost:3000/hauth
app.post('/hauth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
	
		if(username=='hod' && password=='hod'){
			request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/hhome');

		} else {
			response.send('Incorrect Username and/or Password!');
		}			
		response.end();
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// http://localhost:3000/glogin
app.post('/glogin', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/glogin.html'));
});

// http://localhost:3000/gauth
app.post('/gauth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		
		if(username=='gate' && password=='gate'){
			request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/ghome');

		} else {
			response.send('Incorrect Username and/or Password!');
		}			
		response.end();
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


// http://localhost:3000/home
app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

// http://localhost:3000/shome
/*app.get('/shome', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back to student main page, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});*/

// http://localhost:3000/
app.get('/shome', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/mainStd.html'));
});
app.post('/aply', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/apply.html'));
});

app.post('/status', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/status.html'));
});

app.get('/thome', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/mainTea.html'));
});

app.get('/hhome', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/mainhod.html'));
});

app.get('/ghome', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/maingate.html'));
});

app.listen(3000);