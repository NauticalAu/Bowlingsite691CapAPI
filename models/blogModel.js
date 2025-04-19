const db = require('../config/db');

const getAllPosts = async () => {
  const result = await db.query(`
    SELECT p.*, u.full_name 
    FROM blog_post p
    JOIN "user" u ON p.user_id = u.user_id
    ORDER BY p.created_at DESC
  `);
  return result.rows;
};

const getPostById = async (id) => {
  const post = await db.query(`
    SELECT p.*, u.full_name 
    FROM blog_post p
    JOIN "user" u ON p.user_id = u.user_id
    WHERE p.id = $1
  `, [id]);

  const comments = await db.query(`
    SELECT c.*, u.full_name 
    FROM comment c
    JOIN "user" u ON c.user_id = u.user_id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
  `, [id]);

  return { post: post.rows[0], comments: comments.rows };
};

const createPost = async (userId, title, content) => {
  const result = await db.query(`
    INSERT INTO blog_post (user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [userId, title, content]);

  return result.rows[0];
};

const addComment = async (postId, userId, content) => {
  const result = await db.query(`
    INSERT INTO comment (post_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [postId, userId, content]);

  return result.rows[0];
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  addComment
};
