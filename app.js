/*
 Authors:
 Matthew Dandar A0118450
*/
const { render } = require("ejs");
const express = require("express");
const fs = require('fs')

const username = "Matt"


let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => { 
  const defaultMovieList = ['Inception', 'Spiderman', 'The Dark Knight', 'Tenet']
  res.render("pages/index", { result: defaultMovieList, username: username }) 
});

app.get("/myForm", (req, res) => { res.render("pages/myForm", { username: username })} )

app.post("/myForm", (req, res)=> {
  let formData = req.body;
  console.log(formData);
  let movie_list = formData.movie_list.split('-');
  res.render("pages/index", { result: movie_list, username: username });
});

app.get("/myListQueryString", (req, res) => {
  let movie1 = req.query.movie1;
  let movie2 = req.query.movie2;
  let movie_list = [movie1, movie2]
  res.render("pages/index", { result: movie_list, username: username });
})

let promise_Start = new Promise(function(res, rej) {
  fs.readFile('movieDescriptions.txt', function (err, data) {
      if (err) res(err)
      else {
          res(data.toString())
      }
  })
})

let findMatch = (param, name) => {
  const data = param.split('\n')
  return new Promise(function(res, rej) {
      data.forEach(function(item) {
          title = item.split(':')[0]
          description = item.split(':')[1]
          if (name == title) {
              res(description)
          }
      })
      rej("Movie could not be found :(")
  })
}
app.get("/search/:movieName", (req, res) => {
  let name = req.params.movieName.replace(/_/g, ' ')
  promise_Start
  .then((data) => findMatch(data, name))
  .then((data) => res.render("pages/searchResult", { description: data, title: name, username:username }) )
  .catch((err) => res.render("pages/searchResult", { description: err, title: "Sorry...", username: username }) );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});