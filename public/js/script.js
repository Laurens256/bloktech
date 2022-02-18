const socket = io();

const startScherm = document.querySelector("#startscherm");
const messages = document.querySelector("#messages");
const form = document.querySelector("#form");
const input = document.querySelector("#input");

let chatsList = document.querySelector("#chatlijst");

// const username = prompt("Please enter your username");
// const userPassword = prompt("Please enter your password");

function chatLijst () {
  const chatsListItem = document.createElement("li");
  const chatsListItemName = document.createElement("strong");
  const chatsListItemMsg = document.createElement("span");
  chatsListItemName.textContent = "Laurens";
  chatsListItemMsg.textContent = "Hello world!";
  chatsListItem.appendChild(chatsListItemName);
  chatsListItem.appendChild(chatsListItemMsg);
  chatsList.appendChild(chatsListItem);
}

// regelt input van form(tekstbox)
form.addEventListener("submit", function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});



//laadscherm
// socket.on("connect", () => {
//   startScherm.classList.add("connected");
//   input.placeholder = "";
// })

// socket.on("disconnect", () => {
//   startScherm.classList.remove("connected");
//   input.placeholder = "Berichten worden automatisch verzonden wanneer je online bent";
// })


//display berichten
socket.on("chat message", function(msg) {
  const item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTo(0, messages.scrollHeight);
});



document.addEventListener("keydown", e => {
  if (e.target.matches("input")) return;

  if(e.key === "c") socket.connect();

  if(e.key === "d") socket.disconnect();
  }
)

// document.addEventListener("click", chatLijst);