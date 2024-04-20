document
  .getElementById("create-blog-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const fdata = new FormData(this);
    const data = {
      title: fdata.get("title"),
      content: fdata.get("content"),
    };
    const response = await fetch("/cblog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    alert("Blog created successfully!");
    window.location.href = "/sblogs";
  });