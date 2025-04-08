const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

const memory = {
  username: 'Azlan',
  scaarName: 'SCAAR',
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

function cmd(text, keyword) {
  return text.trim().toLowerCase() === keyword.toLowerCase();
}

function getSCAARResponse(text) {
  const t = text.toLowerCase();

  // Greetings & Identity
  if (cmd(t, "hello") || cmd(t, "hi")) return `Hello, ${memory.username}`;
  if (t.includes("your name")) return `My name is ${memory.scaarName}, your assistant.`;
  if (t.includes("my name")) return `Your name is ${memory.username}.`;
  if (t.includes("how are you")) return "I'm fine, thank you.";
  if (["bye", "goodbye", "exit"].includes(t)) return "Goodbye 👋";
  if (t.includes("are you there")) return `At your service, ${memory.username}!`;

  // Time & Date
  if (t.includes("time")) return `⏰ The current time is ${new Date().toLocaleTimeString()}`;
  if (t.includes("date")) return `📅 Today's date is ${new Date().toLocaleDateString()}`;

  // Timer
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

  // Notes
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

  // Reminders
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

  // Tasks
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

  // Important Info
  if (t.includes("store id") || t.includes("save important details")) {
    memory.importantDetails = text.split("details").pop().trim();
    return "🔐 Important details stored securely.";
  }
  if (t.includes("show id")) return memory.importantDetails ? `📎 Stored Details: ${memory.importantDetails}` : "No stored details.";
  if (t.includes("delete id")) {
    memory.importantDetails = '';
    return "🗑️ Important details deleted.";
  }

  // Math
  if (/\d+\s*[\+\-\*\/]\s*\d+/.test(t)) {
    try {
      return `🧮 Result: ${eval(t)}`;
    } catch {
      return "Couldn't calculate that.";
    }
  }

  // Joke / Story
  if (t.includes("joke")) return "😂 Why don’t scientists trust atoms? Because they make up everything!";
  if (t.includes("story")) return "📖 Once upon a time, there was a curious coder who built a smart AI assistant. And you're using it right now!";

  // Play music
  if (t.includes("play music")) {
    const audio = new Audio("music.mp3"); // Add music.mp3 in the same folder
    audio.play();
    return "🎵 Playing music...";
  }

  // Lock Device (Windows)
  if (t.includes("lock my device")) {
    if (navigator.userAgent.includes("Windows")) {
      const shell = new ActiveXObject("WScript.Shell");
      shell.Run("rundll32.exe user32.dll,LockWorkStation");
      return "🔒 Locking device...";
    }
    return "🔒 Device lock works only on Windows.";
  }

  // Search fallback
  const searchQuery = encodeURIComponent(text);
  window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
  return `🔍 I wasn't sure, so I searched Google for: "${text}"`;
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
