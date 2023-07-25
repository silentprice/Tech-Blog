const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      where: {
        userId: req.session.user_id,
      },
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage-admin', {
      layout: 'dashboard',
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get('/edit/:id', async (req, res) => {
  Post.findByPk(req.params.id)
    .then((postData) => {
      if (postData) {
        const post = postData.get({ plain: true });
        res.render('edit', {
          layout: 'dashboard',
          post,
        });
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.status(500).json(err);
      console.log(err);
    });
});

router.get('/new', (req, res) => {
  res.render('new', {
    layout: 'dashboard',
  });
});

module.exports = router;
