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

function getSCAARResponse(text) {
  memory.history.push({ user: text });

  const t = text.toLowerCase();

  // GREETINGS
  if (["hi", "hello"].includes(t)) return `Hello, ${memory.username}`;
  if (["okey"].includes(t)) return "👍";
  if (t.includes("your name")) return `I'm ${memory.scaarName}, your assistant.`;
  if (t.includes("my name")) return `Your name is ${memory.username}.`;
  if (t.includes("how are you")) return "I'm fine, thank you.";
  if (["bye", "exit", "quit"].includes(t)) return "Goodbye 👋";
  if (t.includes("are you there")) return `At your service, ${memory.username}!`;

  // TIME & DATE
  if (t.includes("time")) return `⏰ The current time is ${new Date().toLocaleTimeString()}`;
  if (t.includes("date")) return `📅 Today's date is ${new Date().toLocaleDateString()}`;

  // TIMER
  if (t.includes("start timer") || t.includes("set timer")) {
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

  // NOTES
  if (t.includes("create note") || t.includes("add note")) {
    const note = text.split("note").pop().trim();
    memory.notes.push(note);
    return `📝 Note saved: "${note}"`;
  }
  if (t.includes("view note")) return memory.notes.length ? `📋 Notes:\n- ${memory.notes.join('\n- ')}` : "No notes.";
  if (t.includes("clear my note")) {
    memory.notes = [];
    return "🧹 Notes cleared.";
  }

  // REMINDERS
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

  // TASKS
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

  // IMPORTANT DETAILS
  if (t.includes("store id") || t.includes("save important details")) {
    memory.importantDetails = text.split("details").pop().trim();
    return "🔐 Important details stored.";
  }
  if (t.includes("show id")) return memory.importantDetails ? `📎 Stored Details: ${memory.importantDetails}` : "No stored details.";
  if (t.includes("delete id")) {
    memory.importantDetails = '';
    return "🗑️ Important details deleted.";
  }

  // MATH
  if (/\d+\s*[\+\-\*\/]\s*\d+/.test(t)) {
    try {
      return `🧮 Result: ${eval(t)}`;
    } catch {
      return "Couldn't calculate.";
    }
  }

  // JOKE
  if (t.includes("joke")) return "😂 Why don’t scientists trust atoms? Because they make up everything!";
  if (t.includes("story")) return "📖 Once upon a time, a curious coder created SCAAR, and it changed everything...";

  // MUSIC
  if (t.includes("play music")) {
    const audio = new Audio('music.mp3'); // Add your own file
    audio.play();
    return "🎵 Playing music...";
  }

  // LOCK DEVICE (simulated)
  if (t.includes("lock my device")) {
    return "🔒 Locking... (simulated; not real lock)";
  }

  // SEARCH ON GOOGLE
  if (t.includes("search") || t.includes("google")) {
    const query = text.split("search").pop().trim();
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    return `🔎 Searching Google for "${query}"...`;
  }

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
  appendMessage('scaar', "Hello Azlan, I'm SCAAR. How can I assist you today?");
};
