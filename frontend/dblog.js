document.addEventListener("DOMContentLoaded", function () {
  loadBlogs();

  document.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("delete")) {
      const blogId = target.dataset.id;
      deleteBlog(blogId);
    } else if (target.classList.contains("edit")) {
      const blogId = target.dataset.id;
      editBlog(blogId);
    }
  });
});

function loadBlogs() {
  fetch("/user-blogs")
    .then((response) => response.json())
    .then((blogs) => displayBlogs(blogs));
}

function displayBlogs(blogs) {
  const blogList = document.getElementById("blog-list");
  blogList.innerHTML = "";

  blogs.forEach(function (blog) {
    const blogItem = document.createElement("div");
    blogItem.classList.add("blog-item");
    blogItem.innerHTML = `
            <h3>${blog.title}</h3>
            <p>${blog.content}</p>
            <br>
            <button class="edit" data-id="${blog._id}">Edit</button>
            <button class="delete" data-id="${blog._id}">Delete</button>
        `;
    blogList.appendChild(blogItem);
  });
}

function deleteBlog(blogId) {
  fetch(`/blogs/${blogId}`, {
    method: "DELETE",
  }).then(function (response) {
    loadBlogs();
    alert("Blog deleted successfully!");
  });
}

function editBlog(blogId) {
  const newt = prompt("Enter new title:");
  const newc = prompt("Enter new content:");

  if (newt && newc) {
    const ublog = {
      title: newt,
      content: newc,
    };

    fetch(`/blogs/${blogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ublog),
    }).then(function (response) {
      loadBlogs();
      alert("Blog edited successfully!");
    });
  }
}