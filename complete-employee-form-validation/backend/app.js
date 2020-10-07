var app = require('./index')
const postsRoutes = require("./routes/posts");

var server = app.listen(3000, function(){
  console.log('http server running at ' + 3000)
 });

app.use("/api/posts", postsRoutes);
