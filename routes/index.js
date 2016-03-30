var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});



module.exports = router;



// add sth new in here
module.exports = function(app){
	

	app.get('/yiwendai',function(req, res)
	{
		res.send('hihi, Yiwen!!');
	});

	app.get('/test', function(req, res)
	{
		res.render('test', {title: 'JustMusic'});
		//res.render('test', {source: "src='/music/'"});

	});

	app.get('/yiwen', function(req, res)
	{
		res.render('audioPlayer');
		//res.render('test', {source: "src='/music/'"});

	});

	app.get('/user', function(req, res)
	{
		res.render('userinfo');

	});


};
