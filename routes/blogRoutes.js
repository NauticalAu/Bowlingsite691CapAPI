const express = require('express');
const router = express.Router();
const blog = require('../models/blogModel');

router.get('/', async (req, res) => {
  const posts = await blog.getAllPosts();
  res.json(posts);
});

router.get('/:id', async (req, res) => {
  const data = await blog.getPostById(req.params.id);
  res.json(data);
});

router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  const post = await blog.createPost(userId, title, content);
  res.status(201).json(post);
});

router.post('/:id/comments', async (req, res) => {
  const { content } = req.body;
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  const comment = await blog.addComment(req.params.id, userId, content);
  res.status(201).json(comment);
});

router.put('/:id', async (req, res) => {
    const { title, content } = req.body;
    const userId = req.session.userId;
  
    const result = await db.query(`
      UPDATE blog_post
      SET title = $1, content = $2
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `, [title, content, req.params.id, userId]);
  
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized or post not found' });
    }
  
    res.json(result.rows[0]);
  });
  
  router.delete('/:id', async (req, res) => {
    const userId = req.session.userId;
  
    const result = await db.query(`
      DELETE FROM blog_post
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `, [req.params.id, userId]);
  
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized or post not found' });
    }
  
    res.json({ success: true });
  });
  

module.exports = router;
// This code defines the routes for the blog feature of the application.
// It includes routes for getting all posts, getting a single post by ID, creating a new post, and adding comments to a post.
// The routes are defined using Express.js and utilize the blog model for database interactions.
// The routes also check if the user is logged in by verifying the session ID before allowing post creation and comment addition.
// The router is exported for use in the main server file.