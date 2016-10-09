var express = require('express');
var app = express();

var mongojs = require('mongojs');
var db = mongojs('emaillist', ['emaillist']);
var bodyParser = require('body-parser');

/*app.get('/',function(req, res){
  res.send("Hello World from server.js");
});
*/

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.json());
app.get('/emaillist', function(req, res){
	console.log("I received a get request");
		db.emaillist.find(function(err, docs){
		console.log(docs);
		res.json(docs);
	});
});

app.post('/emaillist', function(req, res){
	console.log(req.body);
	// send email
	sendemail(req.body.receiver, req.body.sender, req.body.subject, req.body.content);
	db.emaillist.insert(req.body, function(err, doc){
		res.json(doc);
	});

});

app.delete('/emaillist/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
	db.emaillist.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
		res.json(doc);
	});
});
/*
app.get('/contactlist/:id', function(req, res){
	var id= req.params.id;
	console.log("in get request"+id);
	db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc){
		res.json(doc);
	});
});

app.put('/contactlist/:id', function(req, res){
	var id = req.params.id;
	console.log(req.body.name);
	db.contactlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
		new: true}, function(err, doc){
			res.json(doc);
		
 	});
});
*/

app.listen(3000);
console.log("server running on port 3000");




function sendemail(to_email, from_email, subject, content){

	var helper = require('sendgrid').mail;
	from_email = new helper.Email(from_email);
	to_email = new helper.Email(to_email);
	subject = subject;
	content = new helper.Content('text/plain', content);
	mail = new helper.Mail(from_email, subject, to_email, content);

	var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
	var request = sg.emptyRequest({
	  method: 'POST',
	  path: '/v3/mail/send',
	  body: mail.toJSON(),
	});

	sg.API(request, function(error, response) {
	  console.log(response.statusCode);
	  console.log(response.body);
	  console.log(response.headers);
	});

}