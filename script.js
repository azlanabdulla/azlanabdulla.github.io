const transcriptEl = document.getElementById("transcript");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const Synth = window.speechSynthesis;

const notes = JSON.parse(localStorage.getItem("scaar_notes")) || [];
const reminders = JSON.parse(localStorage.getItem("scaar_reminders")) || [];

let recognition, listening = false;

function saveData() {
  localStorage.setItem("scaar_notes", JSON.stringify(notes));
  localStorage.setItem("scaar_reminders", JSON.stringify(reminders));
}

function updateTranscriptDisplay(extra = "") {
  let noteText = notes.length ? "\nNotes:\n- " + notes.join("\n- ") : "";
  let reminderText = reminders.length ? "\nReminders:\n- " + reminders.map(r => r.text).join("\n- ") : "";
  transcriptEl.textContent = extra + noteText + reminderText;
}

function checkReminders() {
  const now = Date.now();
  const due = reminders.filter(r => now >= r.time);
  due.forEach(r => speak("Reminder: " + r.text));
  const remaining = reminders.filter(r => now < r.time);
  reminders.length = 0;
  reminders.push(...remaining);
  saveData();
}
setInterval(checkReminders, 5000);

function speak(message, callback) {
  const utter = new SpeechSynthesisUtterance(message);
  utter.onstart = () => {
    transcriptEl.textContent = `SCAAR: ${message}`;
    updateTranscriptDisplay();
  };
  utter.onend = () => {
    if (callback) callback();
  };
  Synth.cancel();
  Synth.speak(utter);
}

// Simple math parser for basic operations
function parseMath(text) {
  // Normalize text operators to symbols
  let expr = text.toLowerCase()
    .replace(/plus/g, "+")
    .replace(/minus/g, "-")
    .replace(/times|multiplied by/g, "*")
    .replace(/divided by|over/g, "/")
    .replace(/ /g, "");

  // Check for valid math expression (digits and +-*/)
  if (/^[0-9+\-*/.]+$/.test(expr)) {
    try {
      // Use Function constructor for safer eval
      // (you can extend with a math lib if needed)
      return Function(`"use strict";return (${expr})`)();
    } catch {
      return null;
    }
  }
  return null;
}

// Get city name from lat/lon using OpenStreetMap reverse geocode
async function getCityName(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await res.json();
    return data.address.city || data.address.town || data.address.village || data.address.county || "your location";
  } catch {
    return "your location";
  }
}

// Fetch summary from DuckDuckGo Instant Answer API (no key required)
async function getSearchSummary(query) {
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&skip_disambig=1`);
    const data = await res.json();
    if (data.AbstractText) return data.AbstractText;
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      if (data.RelatedTopics[0].Text) return data.RelatedTopics[0].Text;
    }
    return "Sorry, I couldn't find an answer to that.";
  } catch {
    return "Sorry, I had trouble searching right now.";
  }
}

async function handleCommand(text) {
  text = text.toLowerCase();
  // Exit commands
  if (/(goodbye|exit|stop listening|quit)/.test(text)) {
    speak("Goodbye! Shutting down SCAAR. See you later.");
    if (recognition) {
      recognition.stop();
      listening = false;
    }
    return null;
  }
  if (text.includes("time")) {
    return `The time is ${new Date().toLocaleTimeString()}`;
  }
  if (text.includes("date")) {
    return `Today is ${new Date().toLocaleDateString()}`;
  }
  if (text.includes("hello") || text.includes("hi")) {
    return "Hello Azlan, I'm SCAAR. How can I assist you today?";
  }
  if (text.includes("open google")) {
    window.open("https://www.google.com", "_blank");
    return "Opening Google for you.";
  }
  if (text.includes("open youtube")) {
    window.open("https://www.youtube.com", "_blank");
    return "Opening YouTube.";
  }
  if (text.includes("joke")) {
    const jokes = [
      "Why don’t skeletons fight each other? Because they don’t have the guts!",
      "I told my computer I needed a break, and now it won’t stop sending me Kit-Kats.",
      "Why was the math book sad? Because it had too many problems.",
      "What do you call fake spaghetti? An impasta.",
      "Why don’t programmers like nature? It has too many bugs."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  if (text.includes("vibrate") && navigator.vibrate) {
    navigator.vibrate(10000);
    return "Vibrating for 10 seconds.";
  }
  if (text.includes("battery") && navigator.getBattery) {
    try {
      const b = await navigator.getBattery();
      return `Battery is at ${Math.round(b.level * 100)} percent.`;
    } catch {
      return "Sorry, I couldn't get your battery status.";
    }
  }
  if (text.includes("where am i") || text.includes("my location") || text.includes("current location") || text.includes("location")) {
    if (!navigator.geolocation) return "Geolocation is not supported on your device.";
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const city = await getCityName(pos.coords.latitude, pos.coords.longitude);
        resolve(`You are currently near ${city}.`);
      }, () => {
        resolve("Sorry, I couldn't get your location.");
      });
    });
  }
  if (text.includes("remember")) {
    const note = text.split("remember")[1]?.trim();
    if (note) {
      notes.push(note);
      saveData();
      return `Okay, I'll remember: ${note}`;
    }
  }
  if ((text.includes("delete note") || text.includes("delete notes")) && notes.length) {
    notes.length = 0;
    saveData();
    return "All your notes have been deleted.";
  }
  if (text.includes("remind me to") && text.includes("in")) {
    const task = text.split("remind me to")[1].split("in")[0].trim();
    const seconds = parseInt(text.split("in")[1]);
    if (task && !isNaN(seconds)) {
      const time = Date.now() + seconds * 1000;
      reminders.push({ text: task, time });
      saveData();
      return `Reminder set: ${task} in ${seconds} seconds.`;
    }
  }
  if ((text.includes("delete reminder") || text.includes("delete reminders") || text.includes("delete all reminders")) && reminders.length) {
    reminders.length = 0;
    saveData();
    return "All your reminders have been deleted.";
  }
  // Math detection & answer
  const mathResult = parseMath(text);
  if (mathResult !== null) {
    return `The result is ${mathResult}`;
  }
  // Search general question (async)
  if (/^(what|who|when|where|why|how)/.test(text)) {
    const summary = await getSearchSummary(text);
    return summary;
  }
  return "Sorry, I didn't understand that. Could you say it differently?";
}

function startRecognition() {
  if (!SpeechRecognition) {
    transcriptEl.textContent = "Speech recognition not supported in your browser.";
    return;
  }
  if (listening) return; // already listening

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = true;

  recognition.onresult = async (event) => {
    const last = event.results.length - 1;
    const text = event.results[last][0].transcript.trim();
    transcriptEl.textContent = `You: ${text}`;
    const reply = await handleCommand(text);
    if (reply !== null) {
      speak(reply, () => {
        if (listening) recognition.start();
      });
    }
  };

  recognition.onerror = (e) => {
    transcriptEl.textContent = `Error: ${e.error}`;
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
      speak("Microphone permission denied. Please allow microphone access.");
    }
  };

  recognition.onend = () => {
    if (listening) recognition.start();
  };

  listening = true;
  recognition.start();
  speak("SCAAR activated. Listening for your command.");
}

// Start on user interaction (click)
document.body.addEventListener("click", () => {
  if (!listening) startRecognition();
}, { once: true });

updateTranscriptDisplay();
checkReminders();
