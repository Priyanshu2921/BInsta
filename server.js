const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Set view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Load user data from JSON file
const users = JSON.parse(fs.readFileSync('./data/users.json'));

// Route: Home Page with Search Bar
app.get('/', (req, res) => {
  res.render('index');
});

// Route: Handle Search
app.post('/search', (req, res) => {
  const { username } = req.body;
  const user = users.users.find((u) => u.username === username);

  if (user) {
    res.redirect(`/user/${username}`);
  } else {
    res.render('index', { error: 'No such user found' });
  }
});

// Route: User Profile Page with Posts, Followers, Profile Picture, Likes, and Comments
app.get('/user/:username', (req, res) => {
  const searchedUsername = req.params.username.toLowerCase();
  const user = users.users.find((u) =>  u.username.toLowerCase() === searchedUsername);

  if (user) {
    res.render('user', {
      username: user.username,
      userProfilePicture: user.userProfilePicture,
      userFollowers: user.userFollowers,
      userFollowing: user.userFollowing,
      userBio: user.userBio,
      posts: user.posts
    });
  } else {
    res.render('index', { error: 'No such user found' });
  }
});

app.get('/user/:username/post/:postId', (req, res) => {
  const { username, postId } = req.params;
  const user = users.users.find((u) => u.username.toLowerCase() === username.toLowerCase());

  if (user) {
    const post = user.posts[postId];  

    if (post) {
      // Rendering my post page and pass the post data, including comments, to the EJS template
      res.render('page', { 
        username: user.username, 
        post, 
        userProfilePicture: user.userProfilePicture, 
        comments: post.comments || [] 
      });
    } else {
      res.redirect(`/user/${username}`);  // Rediecting if the user dont exist
    }
  } else {
    res.redirect('/');   // Rediecting if the user dont exist
  }
});


// Start 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
