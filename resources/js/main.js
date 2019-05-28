var data = localStorage.getItem("todoList")
  ? JSON.parse(localStorage.getItem("todoList"))
  : {
      todo: [],
      completed: []
    };

// Remove and complete icons in SVG format
var completeSVG =
  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

function getName(value) {
  console.log(value);
  var Http = new XMLHttpRequest();
  var url =
    "https://restcountries.eu/rest/v2/name/" +
    value +
    "?fields=name;flag;capital;currencies;";
  Http.open("GET", url, true);
  Http.send();
  Http.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      addItem(Http.responseText);
    }
  };
}

// User clicked on the add button
// If there is any text inside the item field, add that text to the todo list
document.getElementById("add").addEventListener("click", function() {
  var value = document.getElementById("item").value;
  if (value) {
    getName(value);
  }
});

document.getElementById("item").addEventListener("keydown", function(e) {
  var value = this.value;
  if ((e.code === "Enter" || e.code === "NumpadEnter") && value) {
    getName(value);
  }
});

function addItem(value) {
  const parsedList = JSON.parse(value);
  console.log(parsedList);
  addItemToDOM(parsedList);
  document.getElementById("item").value = "";
  parsedList.map(country =>
    data.todo.push({ name: country.name, flag: country.flag })
  );
  dataObjectUpdated();
}

function renderTodoList() {
  if (!data.todo.length) return;
  addItemToDOM(data.todo);
  data.todo = [];
}

function dataObjectUpdated() {
  localStorage.setItem("todoList", JSON.stringify(data));
}

function completeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item;
  if (id === "todo") {
    data.todo.splice(data.todo.indexOf(value), 1);
    item.querySelector(".currency").style.display = "block";
    item.querySelector(".capital").style.display = "block";
    data.completed.push(value);
  } else {
    data.completed.splice(data.completed.indexOf(value), 1);
    item.querySelector(".currency").style.display = "none";
    item.querySelector(".capital").style.display = "none";
    data.todo.push(value);
  }
  dataObjectUpdated();

  // Check if the item should be added to the completed list or to re-added to the todo list
  var target =
    id === "todo"
      ? document.getElementById("completed")
      : document.getElementById("todo");

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);
}

// Adds a new item to the todo list
function addItemToDOM(parsedList, completed) {
  var list = completed
    ? document.getElementById("completed")
    : document.getElementById("todo");

  var child = list.lastElementChild;
  while (child) {
    list.removeChild(child);
    child = list.lastElementChild;
  }
  parsedList.map(country => {
    var item = document.createElement("li");
    item.innerText = country.name;

    var buttons = document.createElement("div");
    buttons.classList.add("buttons");

    var flag = document.createElement("IMG");
    flag.setAttribute("src", country.flag);
    flag.style.paddingLeft = "8px";
    flag.setAttribute("width", "35");
    flag.setAttribute("height", "20");
    flag.setAttribute("display", "inline");

    var capital = document.createElement("p");
    capital.classList.add("capital");
    capital.innerText = "Capital: " + country.capital;
    capital.style.display = "none";

    var currencies = document.createElement("p");
    currencies.classList.add("currency");
    currencies.innerText = "Currency Symbol: " + country.currencies["0"].symbol;
    currencies.style.display = "none";

    var complete = document.createElement("button");
    complete.classList.add("complete");
    complete.innerHTML = completeSVG;

    complete.addEventListener("click", completeItem);

    buttons.appendChild(complete);
    item.appendChild(flag);
    item.appendChild(capital);
    item.appendChild(currencies);
    item.appendChild(buttons);
    list.insertBefore(item, list.childNodes[0]);
  });
}
