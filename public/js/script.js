const socket = io();

const loginScreen = document.querySelector("#loginform");
const loginSubmit = document.querySelector("#loginform input[type=submit]");

const loadScreen = document.querySelector("#loadScreen");

const messages = document.querySelector("#messages");
const messageForm = document.querySelector("#form");
const input = document.querySelector("#input");
let allMessages = document.querySelector("#messages li");

let chatsList = document.querySelector("#chatlijst");

const chatBackButton = document.querySelector("#chatbackbutton");
const asideElement = document.querySelector("#chatlijstcontainer");

if((window.location.href.indexOf("messages") < 1)) {
  loginSubmit.addEventListener("click", function(e) {
    socket.emit("new user");
  });
}


if((window.location.href.indexOf("messages") > -1)) {

  function chatLijst () {
    const chatsListItem = document.createElement("li");
    chatsListItem.innerHTML = "<strong>"+"Naam"+"</strong><span>"+"Bericht!"+"</span>";
    chatsList.appendChild(chatsListItem);
  }
  
  // regelt input van form(tekstbox)
  messageForm.addEventListener("submit", function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit("chat message", input.value);
      input.value = "";
    }
  });
  
  
  
  //laadscherm
  // socket.on("connect", () => {
  //   loadScreen.classList.add("connected");
  //   input.placeholder = "";
  // })
  
  // socket.on("disconnect", () => {
  //   loadScreen.classList.remove("connected");
  //   input.placeholder = "Berichten worden automatisch verzonden wanneer je online bent";
  // })
  
  
  //mobile aside (chatlijst) tonen
  function mobileAside() {
    asideElement.classList.add("active");
  }
  
  
  //display berichten
  socket.on("chat message", function(msg) {
    const liMessage = document.createElement("li");
    liMessage.innerHTML = msg.bericht+"<small>"+msg.time+"</small>";
    messages.appendChild(liMessage);
    messages.scrollTo(0, messages.scrollHeight);
  });
  
  socket.on("new user", function(msg) {
    const liMessage = document.createElement("li");
    liMessage.innerHTML = msg.bericht;
    messages.appendChild(liMessage);
    messages.scrollTo(0, messages.scrollHeight);
  });
  
  
  
  document.addEventListener("keydown", e => {
    if (e.target.matches("input")) return;
  
    if(e.key === "c") socket.connect();
  
    if(e.key === "d") socket.disconnect();
    }
  )

chatBackButton.addEventListener("click", mobileAside);
// document.addEventListener("click", chatLijst);

}