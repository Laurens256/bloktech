console.log("script.js geladen");

const socket = io();

const loginScreen = document.querySelector("#loginform");
const loginSubmit = document.querySelector("#loginform input[type=submit]");

const loadScreen = document.querySelector("#loadScreen");

const messages = document.querySelector("#messages");
const messageForm = document.querySelector("#form");
const input = document.querySelector("#input");
let allMessages = document.querySelector("#messages li");

const chatsList = document.querySelector("aside ul:first-of-type");
const usersList = document.querySelector("aside ul:last-of-type");

const chatBackButton = document.querySelector("#chatbackbutton");
const asideElement = document.querySelector("#chatlijstcontainer");

if((window.location.href.indexOf("messages") < 1)) {
  loginSubmit.addEventListener("click", function(e) {
  });
}


if((window.location.href.indexOf("messages") > -1)) {

  const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  socket.emit("joinRoom", { username, room });

  function chatLijst () {
    const chatsListItem = document.createElement("li");
    chatsListItem.innerHTML = "<strong>"+"Naam"+"</strong><span>"+"Bericht!"+"</span>";
    chatsList.appendChild(chatsListItem);
  }

  // regelt input van form(tekstbox)
  messageForm.addEventListener("submit", function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit("message", input.value);
      input.value = "";
    }
  });
  
  
  //mobile aside (chatlijst) tonen
  function mobileAside() {
    asideElement.classList.add("active");
  }
  
  
  //display berichten
  socket.on("message", function(msg) {
    const liMessage = document.createElement("li");
    liMessage.innerHTML = "<div><strong>"+msg.naam+"</strong><small>"+msg.time+"</small></div>"+msg.bericht;
    messages.appendChild(liMessage);
    messages.scrollTo(0, messages.scrollHeight);
  });

  //display server berichten // nog ff aparte styling voor systeembericht maken
  socket.on("systemMessage", function(msg) {
    const liMessage = document.createElement("li");
    liMessage.innerHTML = "<div><strong>"+msg.naam+"</strong><small>"+msg.time+"</small></div>"+msg.bericht;
    messages.appendChild(liMessage);
    messages.scrollTo(0, messages.scrollHeight);
  });

    //display lijst met users in room
    socket.on("updateusers", function(users) {
      usersList.innerHTML = "";
      users.forEach((user) => {
        const liUser = document.createElement("li");
        liUser.innerHTML = user.username;
        usersList.appendChild(liUser);
        usersList.scrollTo(0, usersList.scrollHeight);
      })
    });

    //check of gebruiker connected blijft
    socket.on("disconnect", () => {
      
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