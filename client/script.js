import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadIntervel;

//while the data is not fetched we show the loading dots ...
function loader(element) {
  element.textContent = "";

  loadIntervel = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

// typing speed of chat as we dont want that whole data to be shown directly to user : we show that chatbot is thinking and then writting ans as human dose
function typeText(element, text) {
  let index = 0;

  let intervel = setInterval(() => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
    } else {
      clearInterval(intervel);
    }
  }, 20);
}

//we have to generate a unique ID for every single message to be able to map over them
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi && "ai"}">
      <div class="chat">
        <div class="profile">
          <img
          src="${isAi ? bot : user}" 
          alt="${isAi ? "bot" : "user"}" 
          />
        </div>
        <div class="message" id=${uniqueId} >${value}</div>
      </div>
    </div>
    `;
}

const handleSumbit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  // bot,s chatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, "", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);
};

form.addEventListener("submit", handleSumbit); //onsubiting the form we have to call this  handleSumbit function
form.addEventListener("keyup", (e) => {
  //if user sumbit form using 'Enter key' then this event listner well run
  if (e.keyCode === 13) {
    handleSumbit(e);
  }
});
