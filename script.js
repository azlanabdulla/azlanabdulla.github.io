// === Permissions Setup on Page Load ===
(async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    alert("Microphone access is required for SCAAR to work.");
  }
})();

// === Voice Command Engine ===
const transcriptEl = document.getElementById("transcript");
const music = document.getElementById("musicPlayer");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const Synth = window.speechSynthesis;

const notes = JSON.parse(localStorage.getItem("scaar_notes")) || [];
const reminders = JSON.parse(localStorage.getItem("scaar_reminders")) || [];
const todos = JSON.parse(localStorage.getItem("scaar_todos")) || [];

let recognition, listening = false;

function saveData() {
  localStorage.setItem("scaar_notes", JSON.stringify(notes));
  localStorage.setItem("scaar_reminders", JSON.stringify(reminders));
  localStorage.setItem("scaar_todos", JSON.stringify(todos));
}

function updateTranscriptDisplay(extra = "") {
  let noteText = notes.length ? "\nNotes:\n- " + notes.join("\n- ") : "";
  let reminderText = reminders.length ? "\nReminders:\n- " + reminders.map(r => r.text).join("\n- ") : "";
  let todoText = todos.length ? "\nTo-Do:\n- " + todos.join("\n- ") : "";
  transcriptEl.textContent = extra + noteText + reminderText + todoText;
}

function checkReminders() {
  const now = Date.now();
  const due = reminders.filter(r => now >= r.time);
  due.forEach(r => speak("Reminder: " + r.text));
  reminders.splice(0, reminders.length, ...reminders.filter(r => now < r.time));
  saveData();
}
setInterval(checkReminders, 5000);

function speak(message, callback) {
  const utter = new SpeechSynthesisUtterance(message);
  utter.onstart = () => updateTranscriptDisplay(`SCAAR: ${message}\n`);
  utter.onend = () => callback?.();
  Synth.cancel();
  Synth.speak(utter);
}

function parseMath(text) {
  let expr = text.toLowerCase().replace(/plus/g, "+").replace(/minus/g, "-").replace(/times|multiplied by/g, "*").replace(/divided by|over/g, "/").replace(/ /g, "");
  if (/^[0-9+\-*/.]+$/.test(expr)) {
    try {
      return Function(`"use strict";return (${expr})`)();
    } catch {
      return null;
    }
  }
  return null;
}

async function getCityName(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await res.json();
    return data.address.city || data.address.town || data.address.village || data.address.county || "your location";
  } catch {
    return "your location";
  }
}

async function getSearchSummary(query) {
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&skip_disambig=1`);
    const data = await res.json();
    return data.AbstractText || data.RelatedTopics?.[0]?.Text || "No result found.";
  } catch {
    return "Search unavailable now.";
  }
}

async function handleCommand(text) {
  text = text.toLowerCase();

  if (/(goodbye|exit|stop listening|quit)/.test(text)) {
    speak("Goodbye! Shutting down SCAAR.");
    recognition?.stop();
    listening = false;
    return null;
  }

  if (text.includes("are you there") || text.includes("are you there")) {
    return "At your service, sir.";
  }

  if (text.includes("time")) return `The time is ${new Date().toLocaleTimeString()}`;
  if (text.includes("date")) return `Today is ${new Date().toLocaleDateString()}`;
  if (text.includes("hello") || text.includes("hi")) return "Hello Azlan, I'm SCAAR.";

  if (text.includes("set timer for")) {
    const match = text.match(/set timer for (\d+) (second|minute)s?/);
    if (match) {
      const num = parseInt(match[1]);
      const ms = match[2].startsWith("minute") ? num * 60000 : num * 1000;
      setTimeout(() => speak("Time's up!"), ms);
      return `Timer set for ${num} ${match[2]}${num > 1 ? 's' : ''}.`;
    }
  }

  if (text.includes("open google")) { window.open("https://www.google.com", "_blank"); return "Opening Google."; }
  if (text.includes("open youtube")) { window.open("https://www.youtube.com", "_blank"); return "Opening YouTube."; }

  if (text.includes("joke")) {
    const jokes = ["Why don’t skeletons fight each other? They don’t have the guts!", "Why was the math book sad? Too many problems."];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  if (text.includes("remember")) {
    const note = text.split("remember")[1]?.trim();
    if (note) { notes.push(note); saveData(); return `Remembered: ${note}`; }
  }
  if (text.includes("delete notes")) { notes.length = 0; saveData(); return "Notes cleared."; }

  if (text.includes("remind me to") && text.includes("in")) {
    const task = text.split("remind me to")[1].split("in")[0].trim();
    const seconds = parseInt(text.split("in")[1]);
    if (task && !isNaN(seconds)) {
      reminders.push({ text: task, time: Date.now() + seconds * 1000 });
      saveData();
      return `Reminder set: ${task} in ${seconds} seconds.`;
    }
  }
  if (text.includes("delete reminders")) { reminders.length = 0; saveData(); return "Reminders cleared."; }

  if (text.startsWith("add task")) {
    const task = text.replace("add task", "").trim();
    if (task) { todos.push(task); saveData(); return `Task added: ${task}`; }
  }
  if (text.includes("show tasks")) return todos.length ? "Tasks: " + todos.join(", ") : "No tasks yet.";
  if (text.includes("delete all tasks")) { todos.length = 0; saveData(); return "Tasks cleared."; }

  const mathResult = parseMath(text);
  if (mathResult !== null) return `The result is ${mathResult}`;

  if (text.includes("weather in")) {
    const city = text.split("weather in")[1].trim();
    if (city) {
      const res = await fetch(`https://wttr.in/${city}?format=3`);
      return await res.text();
    }
  }

  if (text.includes("fun fact")) {
    const res = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
    const data = await res.json();
    return data.text || "No fact available.";
  }

  if (text.includes("play music")) { music?.play(); return "Playing music."; }
  if (text.includes("pause music")) { music?.pause(); return "Paused."; }

  if (text.includes("who are you")) return "I'm SCAAR, built by Azlan. Your assistant and companion.";

  if (/^(what|who|when|where|why|how)/.test(text)) return await getSearchSummary(text);

  return "Didn't catch that. Try again.";
}

function startRecognition() {
  if (!SpeechRecognition) return transcriptEl.textContent = "Speech recognition not supported.";
  if (listening) return;

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = true;

  recognition.onresult = async (event) => {
    const text = event.results[event.results.length - 1][0].transcript.trim();
    transcriptEl.textContent = `You: ${text}`;
    const reply = await handleCommand(text);
    if (reply !== null) speak(reply, () => recognition?.start());
  };

  recognition.onerror = (e) => {
    transcriptEl.textContent = `Error: ${e.error}`;
    if (['not-allowed', 'service-not-allowed'].includes(e.error)) speak("Microphone access is required.");
  };

  recognition.onend = () => { if (listening) recognition.start(); };

  listening = true;
  recognition.start();
  speak("SCAAR activated. Listening.");
}

document.body.addEventListener("click", () => {
  if (!listening) startRecognition();
}, { once: true });

updateTranscriptDisplay();
checkReminders();
