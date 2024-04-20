document.addEventListener("DOMContentLoaded", function () {
  loadUsers();
  loadBlogs();

  document.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("delete-user-btn")) {
      const userId = target.dataset.id;
      deleteUser(userId);
    } else if (target.classList.contains("delete-blog-btn")) {
      const blogId = target.dataset.id;
      deleteBlog(blogId);
    }
  });
});

function loadUsers() {
  fetch("/users")
    .then((response) => response.json())
    .then((users) => displayUsers(users));
}

function displayUsers(users) {
  const userList = document.getElementById("user-list");
  userList.innerHTML = "";

  users.forEach((user) => {
    const userItem = document.createElement("li");
    userItem.innerHTML = `<div class="user-details">${user.username} - ${user.email}</div><button class="delete-user-btn" data-id="${user._id}">Delete</button>`;
    userList.appendChild(userItem);
  });
}

function deleteUser(userId) {
  fetch(`/users/${userId}`, {
    method: "DELETE",
  }).then((response) => {
    loadUsers();
    alert("User deleted successfully!");
  });
}

function loadBlogs() {
  fetch("/ablogs")
    .then((response) => response.json())
    .then((data) => {
      const blogs = data.blogs;
      const totalBlogs = data.totalBlogs;
      displayBlogs(blogs, totalBlogs);
    });
}

function displayBlogs(blogs, totalBlogs) {
  const blogList = document.getElementById("blog-list");
  blogList.innerHTML = "";

  blogs.forEach((blog) => {
    const blogItem = document.createElement("li");
    blogItem.innerHTML = `<div class="blog-title">${blog.title}:</div><div class="blog-content">${blog.content}</div><button class="delete-blog-btn" data-id="${blog._id}">Delete</button>`;
    blogList.appendChild(blogItem);
  });
  document.getElementById("total-blogs").textContent = totalBlogs;
}

function deleteBlog(blogId) {
  fetch(`/ablogs/${blogId}`, {
    method: "DELETE",
  }).then((response) => {
    loadBlogs();
    alert("Blog deleted successfully!");
  });
}
