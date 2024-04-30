const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const User = require("./backend/models/user");
const Blog = require("./backend/models/blog");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + "/frontend"));
app.use(cookieParser());
app.use(
  session({
    secret: "admin",
    resave: true,
    saveUninitialized: true,
  })
);

mongoose
  .connect("mongodb://localhost:27017/blogDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.get("/users", async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const duser = await User.findOneAndDelete({ _id: userId });
  if (duser) {
    res.status(200).send("User deleted successfully");
  } else {
    res.status(404).send("User not found");
  }
});

app.get("/ablogs", async (req, res) => {
  const blogs = await Blog.find({});
  const totalBlogs = blogs.length;
  res.status(200).json({ blogs, totalBlogs });
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  await user.save();
  res.status(201).send("User created successfully");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === "admin@gmail.com" && password === "Admin@123") {
      req.session.userId = "admin";
      res.status(200).send("Login successful");
    } else {
      const user = await User.findOne({ email, password });
      if (user) {
        req.session.userId = user._id;
        req.session.save();
        res.status(200).send("Login successful");
      } else {
        throw new Error("Invalid email or password");
      }
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(401).send("Invalid email or password");
  }
});

app.post("/cblog", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }
  const { title, content } = req.body;
  const newBlog = new Blog({ userId, title, content });
  await newBlog.save();
  res.status(201).send("Blog created successfully");
});

app.get("/blogs", async (req, res) => {
  const blogs = await Blog.find({});
  res.status(200).json(blogs);
});

app.put("/blogs/:id", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }
  const { title, content } = req.body;
  const updatedBlog = await Blog.findOneAndUpdate(
    { _id: req.params.id, userId },
    { title, content },
    { new: true }
  );
  if (updatedBlog) {
    res.status(200).json(updatedBlog);
  } else {
    res.status(404).send({ message: "Blog not found" });
  }
});

app.delete("/blogs/:id", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }
  const deletedBlog = await Blog.findOneAndDelete({
    _id: req.params.id,
    userId,
  });
  if (deletedBlog) {
    res.status(200).json({ message: "Blog deleted successfully" });
  } else {
    res.status(404).send({ message: "Blog not found or unauthorized" });
  }
});

app.delete("/ablogs/:id", async (req, res) => {
  const blogId = req.params.id;
  await Blog.findByIdAndDelete(blogId);
  res.status(200).send("Blog deleted successfully");
});

app.get("/user-blogs", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }
  const userBlogs = await Blog.find({ userId });
  res.status(200).json(userBlogs);
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/frontend/login.html");
});

app.get("/cblog", (req, res) => {
  res.sendFile(__dirname + "/frontend/cblog.html");
});

app.get("/sblogs", (req, res) => {
  res.sendFile(__dirname + "/frontend/sblogs.html");
});

app.get("/dblog", (req, res) => {
  res.sendFile(__dirname + "/frontend/dblog.html");
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/frontend/signup.html");
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/frontend/admin.html");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
