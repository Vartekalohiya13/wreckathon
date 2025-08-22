const API_BASE = "http://localhost:8080";
let ghost = "";

async function initGhost() {
  try {
    const res = await fetch(`${API_BASE}/ghost`);
    const data = await res.json();
    ghost = data.ghost;
    window.currentGhost = ghost;
    document.getElementById("ghostName").innerText = `💀 You are speaking with: ${ghost}`;
  } catch (error) {
    ghost = "The Phantom Roaster";
    window.currentGhost = ghost;
    document.getElementById("ghostName").innerText = `💀 You are speaking with: ${ghost}`;
    appendMessage("system", "🌙 Connection to spirit realm couldn't be established... but the true connection is eternal...");
  }
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.className =
    sender === "you"
      ? "text-right mb-3"
      : sender === "system"
      ? "text-center mb-3"
      : "text-left mb-3";

  let senderColor = "text-gray-200";
  let senderIcon = "";

  if (sender === "ghost") {
  div.classList.add("bot-bubble");
  const ghostName = window.currentGhost || "👻";
  div.innerHTML = `<b>${ghostName}:</b> <span class="typing-text">${text}</span>`;
} else if (sender === "you") {
  div.classList.add("user-bubble");
  div.innerHTML = `<b>🧿 You:</b> <span class="typing-text">${text}</span>`;
} else if (sender === "system") {
  div.classList.add("system-bubble");
  div.innerHTML = `<span class="typing-text">${text}</span>`;
}



  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  appendMessage("you", msg);
  input.value = "";

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        appendMessage("ghost", "😈 Whoa there! Try typing slower, you impatient mortal...");
        return;
      } else {
        throw new Error(res.statusText);
      }
    }

    const data = await res.json();
    appendMessage("ghost", data.reply);
  } catch (error) {
    const spookyResponses = [
      "The spirits are restless... they sense your presence...",
      "From beyond the veil, I sense... confusion in your mortal words...",
      "The ethereal realm grows cold when you speak such things...",
      "Even in death, I find your statement... questionably amusing...",
      "The phantom winds whisper... 'that's not quite right, mortal...'",
    ];
    const randomResponse = spookyResponses[Math.floor(Math.random() * spookyResponses.length)];
    setTimeout(() => appendMessage("ghost", randomResponse), 500);
  }
}




// Initialize connection
initGhost();
setTimeout(() => {
  appendMessage("", "🕯️ The candles flicker as spirits gather... 🕯️");
}, 2000);
