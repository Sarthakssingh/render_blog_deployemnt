Hi

Database used: SQLITE
to access to the database through command lite type-sqlite3, and a command of sqlite will open and you can do the operations on db.

Database Schema
table

POSTS
Author - TEXT
Blog - TEXT
Id - INT Primary key

USER
Username-TEXT
Password-TEXT(Encrypted by Bcrypt and should be greater then 6 chars)

APIs

To rigester a new user.
POST -/register/

{
  "username": "adam_richard",
  "password": "richard_567",
}
###
To login a rigestered user.

POST - /login/

{
  "username": "adam_richard",
  "password": "richard_567",
}
###
To get all the posts.

GET - /posts/
it will give the list of all the blogs posted on the website.

###
To get a post by id.

GET - /posts/:id
It will reflect a post whose id is provided and if id is not there it should give id not available.

###

To create a new post

POST - /posts/

It will create a post and take input as author and the blog.

###
Updating any blod by their Id.
PUT - /posts/:id

{
  "author": "adam_richard",
  "blog": "blog..................................................",
}

###
Delete a blog by id

DELETE - /posts/:id

THANKS.







