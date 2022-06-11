const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

flash = require('express-flash')


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
app.use(
    session({
      resave: true,
      saveUninitialized: true,
      secret:"yash is a super star",
      cookie: { secure: false, maxAge: 14400000 },
    })
);
app.use(flash());


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
				//response.render("/shome");
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
				response.redirect('/afterreg');
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

app.get('/afterreg', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/afterreg.html'));
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
	var un = request.session.username;
	console.log(un);
	// Render login template
	//response.sendFile(path.join(__dirname + '/mainStd.html'));
	response.render(__dirname+"/mainStd.ejs",{name:un});
});
app.post('/aply', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/apply.html'));
});

app.post('/filled', function(request, response) {
	// Render login template
	var roll = request.body.roll;
	var name = request.body.name;
	var date = request.body.date;
	var section = request.body.section;
	var phnum = request.body.phnum;
	var reason = request.body.reason;
	console.log(date);
	//response.sendFile(path.join(__dirname + '/filled.ejs'));
	response.render(__dirname+"/filled.ejs",{roll:roll,name:name,date:date,section:section,phnum:phnum,reason:reason});
	var details={
		roll: roll,
		name : name,
		class: section,
		phnum: phnum,
		reason: reason,
		date: date,
		
	  }
	var sql = 'INSERT INTO details1 SET ?';
	connection.query(sql,details, function(error,results){
		if (error) throw error;
		console.log("entered in db");
	});
});

app.post('/update', function(request, response) {
	// Render login template
	var auto = request.body.accepting;
    //var location = document.location;
	var sql = 'UPDATE details1 SET status = ? where auto = ?'
	connection.query(sql,['hod',auto], function(error,results){
		if (error) throw error;
		else{
			response.redirect("/thome");
			//res.json(result);
		  }
	});
	//response.sendFile(path.join(__dirname + '/updated.html'));
	//response.render(__dirname+"/updated.html");
	
});
app.post('/tdecline', function(request, response) {
	// Render login template
	var auto = request.body.declining;
    //var location = document.location;
	var sql = 'UPDATE details1 SET status = ? where auto = ?'
	connection.query(sql,['declined from teacher',auto], function(error,results){
		if (error) throw error;
		else{
			response.redirect("/thome");
			//res.json(result);
		  }
	});
	//response.sendFile(path.join(__dirname + '/updated.html'));
	//response.render(__dirname+"/updated.html");
	
});

app.post('/hdecline', function(request, response) {
	// Render login template
	var auto = request.body.declining;
    //var location = document.location;
	var sql = 'UPDATE details1 SET status = ? where auto = ?'
	connection.query(sql,['declined from hod',auto], function(error,results){
		if (error) throw error;
		else{
			response.redirect("/hhome");
			
		  }
	});
	
	
});



app.post('/status', function(request, response) {
	// Render login template
	//response.sendFile(path.join(__dirname + '/status.html'));
	var un = request.session.username;
	console.log('status',un);
	connection.query('SELECT * FROM details1 where roll=?',[un],function(err,rows)     {
 
        if(err){
         request.flash('error', err); 
         response.render(__dirname+"/status.ejs",{page_title:"Users - Node.js",data:''});   
        }else{
            console.log(rows);
            response.render(__dirname+"/status.ejs",{page_title:"Users - Node.js",data:rows});
        }
                            
         });
        
});

app.get('/thome', function(request, response) {
	// Render login template
	//response.sendFile(path.join(__dirname + '/mainTea.html'));
	connection.query('SELECT * FROM details1 where status is null',function(err,rows)     {
 
        if(err){
         request.flash('error', err); 
         response.render(__dirname+"/mainTea.ejs",{page_title:"Users - Node.js",data:''});   
        }else{
            //console.log(rows);
            response.render(__dirname+"/mainTea.ejs",{page_title:"Users - Node.js",data:rows});
        }
                            
         });
        
    });
 

app.get('/hhome', function(request, response) {
	// Render login template
	//response.sendFile(path.join(__dirname + '/mainhod.html'));
	var val = 'hod';
	connection.query('SELECT * FROM details1 where status = ?',[val],function(err,rows)     {
 
        if(err){
         request.flash('error', err); 
         response.render(__dirname+"/mainhod.ejs",{page_title:"Users - Node.js",data:''});   
        }else{
            //console.log(rows);
            response.render(__dirname+"/mainhod.ejs",{page_title:"Users - Node.js",data:rows});
        }
                            
         });
});

app.post('/updatehod', function(request, response) {
	// Render login template
	var auto = request.body.accepting;
    //var location = document.location;
	var sql = 'UPDATE details1 SET status = ? where auto = ?'
	connection.query(sql,['gate',auto], function(error,results){
		if (error) throw error;
		else{
			response.redirect("/hhome");
			//res.json(result);
		  }
	});
	//response.sendFile(path.join(__dirname + '/updated.html'));
	//response.render(__dirname+"/updated.html");
	
});


app.get('/ghome', function(request, response) {
	// Render login template
	//response.sendFile(path.join(__dirname + '/maingate.html'));
	var val = 'gate';
	connection.query('SELECT * FROM details1 where status = ?',[val],function(err,rows)     {
 
        if(err){
         request.flash('error', err); 
         response.render(__dirname+"/maingate.ejs",{page_title:"Users - Node.js",data:''});   
        }else{
            //console.log(rows);
            response.render(__dirname+"/maingate.ejs",{page_title:"Users - Node.js",data:rows});
        }
                            
         });
});

app.post('/updategate', function(request, response) {
	// Render login template
	var auto = request.body.out;
    //var location = document.location;
	var sql = 'UPDATE details1 SET status = ?, outtime = CURRENT_TIMESTAMP where auto = ?'
	connection.query(sql,['issuefinish',auto], function(error,results){
		if (error) throw error;
		else{
			response.redirect("/ghome");
			//res.json(result);
		  }
	});
	//response.sendFile(path.join(__dirname + '/updated.html'));
	//response.render(__dirname+"/updated.html");
	
});

app.listen(3000);