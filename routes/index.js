var router = require('express').Router();



module.exports = function (passport) {
    router.get('/', function (req, res, next) {
        res.render('index', { title: 'Express' });
    });

    router.get('/login', function (req, res, next) {
        if (req.isAuthenticated())
            res.redirect('/profile')
        else
            res.render('loginPage', { message: req.flash('loginMessage') });
    });

    router.get('/signup', function (req, res) {
        if(isLoggedIn)
            res.redirect('/profile')
        else
            res.render('signup', { message: req.flash('signupMessage') });
    });

    router.post('/login', passport.authenticate('local-login', { failureRedirect: '/login', failureFlash: true }),
        function (req, res) {
            res.redirect('/profile');
        });

    router.post('/signup', passport.authenticate('local-signup', { failureRedirect: '/login', failureFlash: true }),
        function (req, res) {
            res.redirect('/profile');
        });

    router.get('/profile', isLoggedIn,
        function (req, res) {
            res.render('profile.ejs', {
                user: req.user // get the user out of session and pass to template
            });
        });
    
    return router
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
