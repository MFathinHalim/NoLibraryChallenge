const getNotes = async () => {
  const response = await fetch("http://localhost:8080/getNotes");
  const res = await response.json();
  return res;
};
getNotes().then((ping) => {
  const notes = ping.notes;
  const newDiv = document.createElement("div");
  newDiv.id = "div1";

  notes.forEach((element: any) => {
    const newParent = document.createElement("div");
    newParent.id = "card";
    //============================================================
    const newContent1 = document.createElement("p");
    newContent1.textContent = element.time;
    newContent1.id = "time";
    const newContent = document.createElement("h3");
    newContent.textContent = element.value;
    newContent.id = "value";
    newParent.appendChild(newContent);
    newParent.appendChild(newContent1);
    //============================================================
    const newForm = document.createElement("form");
    newForm.id = "delete";
    newParent.appendChild(newForm);
    //============================================================
    const newDelete = document.createElement("button");
    newDelete.id = "deleteBtn";
    newDelete.textContent = "Delete This";
    newDelete.type = "submit";
    newForm.dataset.id = element.id;
    newForm.appendChild(newDelete);
    //============================================================
    newDiv.appendChild(newParent);
  });

  const currentDiv = document.getElementById("div1");
  document.body.insertBefore(newDiv, currentDiv);
});

document.body.addEventListener("submit", (event) => {
  if (event.target.id === "delete") {
    event.preventDefault(); // Prevent default form submission
    const id = event.target.dataset.id; // Get input value
    const data = new Object();
    data.id = id;

    fetch("http://localhost:8080/delete", {
      method: "POST",
      mode: "no-cors",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Send data as JSON
    })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  } else if (event.target.id === "add") {
    event.preventDefault(); // Prevent default form submission

    const value = document.getElementById("value").value; // Get input value
    const data = new Object();
    data.value = value;

    fetch("http://localhost:8080/add", {
      method: "POST",
      mode: "no-cors",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Send data as JSON
    })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
});
