const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});
// new route to handle the update of a blog post
router.put('/posts/:id', withAuth, async (req, res) => {
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
          userId: req.session.user_id,
        },
      }
    );

    if (!updatedPost[0]) {
      res.status(404).json({ message: 'No post found with this id or you are not authorized to update this post.' });
      return;
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add a new comment to a post
router.post('/:id/comments', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      content: req.body.content,
      postId: req.params.id,
      userId: req.session.user_id,
    });

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Get comments for a specific post
router.get('/:id/comments', async (req, res) => {
  try {
    const commentsData = await Comment.findAll({
      where: { postId: req.params.id },
      include: [{ model: User, attributes: ['name'] }],
    });

    const comments = commentsData.map((comment) => comment.get({ plain: true }));

    res.json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
