let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Home' });
});

/* GET about page */
router.get('/about', (req, res, next) => {
  res.render('about', { title: 'About'});
});

module.exports = router;
