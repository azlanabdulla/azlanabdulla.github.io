const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

const memory = {
  username: 'Azlan',
  scaarName: 'SCAAR',
  history: [],
  notes: [],
  reminders: [],
  tasks: [],
  importantDetails: '',
  timer: null
};

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function cmd(text, command) {
  return text.trim().toLowerCase() === command.toLowerCase();
}

function getSCAARResponse(text) {
  memory.history.push({ user: text });

  const t = text.toLowerCase();

  if (cmd(t, "hello") || cmd(t, "hi")) return `Hello, ${memory.username}`;
  if (cmd(t, "okey")) return "👍";
  if (t.includes("your name") || t.includes("who are you")) return `My name is ${memory.scaarName}, your assistant.`;
  if (t.includes("my name")) return `Your name is ${memory.username}.`;
  if (t.includes("how are you")) return "I'm fine, thank you.";
  if (["bye", "goodbye", "exit", "quit", "thank you"].includes(t)) return "Goodbye 👋";
  if (t.includes("are you there")) return `At your service, ${memory.username}!`;

  if (t.includes("time")) return `⏰ The current time is ${new Date().toLocaleTimeString()}`;
  if (t.includes("date")) return `📅 Today's date is ${new Date().toLocaleDateString()}`;

  if (t.includes("set timer") || t.includes("start timer")) {
    if (memory.timer) return "⏳ Timer is already running.";
    memory.timer = setTimeout(() => {
      appendMessage('scaar', '⏰ Timer finished!');
      memory.timer = null;
    }, 5000);
    return "⏳ Timer started for 5 seconds.";
  }

  if (t.includes("stop timer")) {
    if (memory.timer) {
      clearTimeout(memory.timer);
      memory.timer = null;
      return "⏹️ Timer stopped.";
    }
    return "No timer running.";
  }

  if (t.includes("create note") || t.includes("add note")) {
    const note = text.split("note").pop().trim();
    memory.notes.push(note);
    return `📝 Note saved: "${note}"`;
  }

  if (t.includes("view note")) return memory.notes.length ? `📋 Notes:\n- ${memory.notes.join('\n- ')}` : "No notes available.";
  if (t.includes("clear my note")) {
    memory.notes = [];
    return "🧹 Notes cleared.";
  }

  if (t.includes("add reminder")) {
    const reminder = text.split("reminder").pop().trim();
    memory.reminders.push(reminder);
    return `⏰ Reminder added: "${reminder}"`;
  }

  if (t.includes("show reminder")) return memory.reminders.length ? `🔔 Reminders:\n- ${memory.reminders.join('\n- ')}` : "No reminders.";
  if (t.includes("delete reminder")) {
    memory.reminders = [];
    return "🗑️ Reminders deleted.";
  }

  if (t.includes("add task")) {
    const task = text.split("task").pop().trim();
    memory.tasks.push(task);
    return `📌 Task added: "${task}"`;
  }

  if (t.includes("show task")) return memory.tasks.length ? `✅ Tasks:\n- ${memory.tasks.join('\n- ')}` : "No tasks.";
  if (t.includes("delete task")) {
    memory.tasks = [];
    return "🗑️ Tasks deleted.";
  }

  if (t.includes("store id") || t.includes("save important details")) {
    memory.importantDetails = text.split("details").pop().trim();
    return "🔐 Important details stored securely.";
  }

  if (t.includes("show id")) return memory.importantDetails ? `📎 Stored Details: ${memory.importantDetails}` : "No stored details found.";
  if (t.includes("delete id")) {
    memory.importantDetails = '';
    return "🗑️ Important details deleted.";
  }

  if (/\d+\s*[\+\-\*\/]\s*\d+/.test(t)) {
    try {
      return `🧮 Result: ${eval(t)}`;
    } catch {
      return "Couldn't calculate that.";
    }
  }

  if (t.includes("joke")) return "😂 Why don’t scientists trust atoms? Because they make up everything!";
  if (t.includes("fact")) return "🌍 Did you know? Honey never spoils.";

  return `You said: "${text}". I'm still learning, but I'm here to help!`;
}

function handleSend() {
  const message = userInput.value.trim();
  if (!message) return;
  appendMessage('user', message);
  const response = getSCAARResponse(message);
  appendMessage('scaar', response);
  userInput.value = '';
}

sendBtn.onclick = handleSend;
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSend();
});

window.onload = () => {
  appendMessage('scaar', `Hello Azlan, I'm ${memory.scaarName}. How can I assist you today?`);
};
