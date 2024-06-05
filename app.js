//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
//using lodash lib for causing problem facing in the route para method.
const _ = require("lodash");

//new loading mongoose here:
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to My Daily Blog! Discover, share, and enjoy the latest stories.";
const aboutContent = "This blog is a place where you can share your daily experiences, thoughts, and stories. We believe that everyone has a story to tell, and we provide the platform for you to share it with the world.";
const contactContent = "Got questions? Want to share feedback? Feel free to reach out to us through this page.";
const app = express();

app.set('view engine', 'ejs');

//new
mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true});

//new creating Schema
const postSchema = {

  title: String,
 
  content: String
 
 };
 
//new Creating  mongoose model
const Post = mongoose.model("Post", postSchema);
 
 



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  Post.find({})
    .then(posts => {
      console.log(posts);
      res.render("home", {
        homePara: homeStartingContent,
        posts: posts
      });
    })
    .catch(err => {
      console.log(err);
    });
});


app.get("/about",function(req,res){
  res.render("about",{
                  aboutPara:aboutContent
  });
});

app.get("/contact",function(req,res){
  res.render("contact",{
                  contactPara:contactContent
  });
});


app.get("/compose",function(req,res){
  res.render("compose");
})
app.post("/compose",function(req,res){
  let compose1 = req.body.composePara;
  let post1 = req.body.postBody;
  
  const post = new Post ({

    title: compose1,
 
    content: req.body.postBody
 
  });
  //new to save
  post.save()
    .then(() =>{
      res.redirect("/");
    });
  
});

// express routing
app.get('/posts/:postId', (req, res) => {
  //new
  const requestedPostId = req.params.postId;

  //new for checking in database:
  Post.findOne({_id: requestedPostId})
    .then(post =>{
      res.render("post",{

        title11: post.title,
        content11: post.content
      });

    });
  
  
});


// app.get('/posts/:postId', async (req, res) => {
//   try {
//     const requestedPostId = req.params.postId;
//     const post = await Post.findOne({ _id: requestedPostId });

//     if (!post) {
//       // Handle case where post is not found
//       res.status(404).send('Post not found');
//       return;
//     }

//     res.render("post", {
//       title11: post.title,
//       content11: post.content
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
