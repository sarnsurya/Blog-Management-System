document.addEventListener("DOMContentLoaded", function () {
  const blogList = document.getElementById("blog-list");
  blogList.innerHTML = "";
  fetch("/blogs")
    .then((response) => response.json())
    .then((blogs) => {
      blogs.forEach(function (blog) {
        const blogItem = document.createElement("div");
        blogItem.classList.add("blog-item");
        blogItem.innerHTML = `
                    <h3>${blog.title}</h3>
                    <p>${blog.content}</p>
                `;
        blogList.appendChild(blogItem);
      });
    });
});
