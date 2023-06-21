
const express = require('express');
const mongoose= require('mongoose');
const Blog= require('./models/blog');
const { result } = require('lodash');

// express app
const app = express();
const dbURI='mongodb+srv://rupanjana:fatal123@noderupu.fn27sy4.mongodb.net/note-rupu?retryWrites=true&w=majority';
mongoose.connect(dbURI)
   .then((result)=>app.listen(3000))
   .catch((err)=>console.log(err));


// register view engine
app.set('view engine', 'ejs');
// app.set('views', 'myviews');
// listen for requests
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));



//routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});
//blogroutes
app.get('/blogs',(req,res)=>{
  Blog.find()
  .then((result)=>{
    res.render('index',{title:'all_blogs',blogs:result})

  })
  .catch((err)=>{
    console.log(err);
  })
})

app.post('/blogs',(req,res)=>{
  const blog= new Blog(req.body);
  blog.save()
   .then((result)=>{
    res.redirect('/blogs');
   })
   .catch((err)=>{
    console.log(err);
   })
})

app.get('/blogs/:id',(req,res)=>{
  const id= req.params.id;
  Blog.findById(id)
  .then(result =>{
    res.render('details',{blog:result,title:'Blog Deytails'});
  })
  .catch(err =>{
    console.log(err);
  });
})
app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});
app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});