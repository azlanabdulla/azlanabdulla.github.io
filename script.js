// === Permissions Setup on Page Load ===
(async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      localStorage.setItem("scaar_lat", latitude);
      localStorage.setItem("scaar_lon", longitude);
    });
  } catch {
    alert("Microphone and location access are required for SCAAR to work properly.");
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
let speaking = false;

function saveData() {
  localStorage.setItem("scaar_notes", JSON.stringify(notes));
  localStorage.setItem("scaar_reminders", JSON.stringify(reminders));
  localStorage.setItem("scaar_todos", JSON.stringify(todos));
}

function updateTranscriptDisplay(extra = "") {
  let noteText = notes.length ? "\n📝 Notes:\n- " + notes.join("\n- ") : "";
  let reminderText = reminders.length ? "\n⏰ Reminders:\n- " + reminders.map(r => r.text).join("\n- ") : "";
  let todoText = todos.length ? "\n✅ To-Do:\n- " + todos.join("\n- ") : "";
  transcriptEl.textContent = extra + noteText + reminderText + todoText;
}

function checkReminders() {
  const now = Date.now();
  const due = reminders.filter(r => now >= r.time);
  due.forEach(r => speak("⏰ Reminder: " + r.text));
  reminders.splice(0, reminders.length, ...reminders.filter(r => now < r.time));
  if (due.length > 0) saveData();
}
setInterval(checkReminders, 5000);

function speak(message, callback) {
  if (Synth.speaking) Synth.cancel();
  const utter = new SpeechSynthesisUtterance(message);
  utter.rate = 0.9;
  utter.pitch = 1.1;
  utter.onstart = () => {
    speaking = true;
    updateTranscriptDisplay(` SCAAR: ${message}\n\n`);
  };
  utter.onend = () => {
    speaking = false;
    callback?.();
  };
  Synth.speak(utter);
}

// Enhanced command matching with multiple variations
function matchesPattern(text, patterns) {
  return patterns.some(pattern => {
    if (typeof pattern === 'string') {
      return text.includes(pattern);
    } else if (pattern instanceof RegExp) {
      return pattern.test(text);
    }
    return false;
  });
}

function parseMath(text) {
  let expr = text.toLowerCase()
    .replace(/\bplus\b|\band\b/g, "+")
    .replace(/\bminus\b|\bsubtract\b/g, "-")
    .replace(/\btimes\b|\bmultiplied by\b|\bmultiply\b/g, "*")
    .replace(/\bdivided by\b|\bdivide\b|\bover\b/g, "/")
    .replace(/\bsquared\b/g, "**2")
    .replace(/\bcubed\b/g, "**3")
    .replace(/[^\d+\-*/.()]/g, "");
  
  if (/^[0-9+\-*/.()]+$/.test(expr) && expr.trim() !== '') {
    try {
      return Function(`"use strict"; return (${expr})`)();
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
    return data.address?.city || data.address?.town || data.address?.village || data.address?.county || "your current location";
  } catch {
    return "your current location";
  }
}

function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function getLatLonForPlace(place) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    return data.length ? { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) } : null;
  } catch {
    return null;
  }
}

async function getSearchSummary(query) {
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&skip_disambig=1`);
    const data = await res.json();
    const text = data.AbstractText || data.RelatedTopics?.[0]?.Text || "No result found.";
    return text.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
  } catch {
    return "Search is currently unavailable.";
  }
}

async function handleCommand(text) {
  const originalText = text;
  text = text.toLowerCase().trim();

  // Stop/Cancel commands
  if (matchesPattern(text, ['scaar']) && speaking) {
    Synth.cancel();
    speaking = false;
    return "Okay, I stopped talking.";
  }

  // Exit commands
  if (matchesPattern(text, [/\b(goodbye|exit|stop listening|quit|shut down|turn off)\b/])) {
    speak("Goodbye! Shutting down SCAAR.");
    recognition?.stop();
    listening = false;
    return null;
  }

  // Greeting variations
  if (matchesPattern(text, [/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/])) {
    const greetings = [
      "Hello there! I'm SCAAR, your voice assistant.",
      "Hi! SCAAR at your service.",
      "Hey! How can I help you today?",
      "Hello! Ready to assist you."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Identity questions - multiple variations
  if (matchesPattern(text, [
    /\b(who are you|what are you|your name|what's your name|whats your name|tell me about yourself)\b/
  ])) {
    return "I'm SCAAR - Smart Conversational AI Assistant and Responder. I was built by Azlan to be your personal voice assistant and companion.";
  }

  // Presence check
  if (matchesPattern(text, [/\b(are you there|are you listening|can you hear me)\b/])) {
    return "Yes, I'm here and listening. At your service!";
  }

  // Time variations
  if (matchesPattern(text, [
    /\b(time|what time|current time|what's the time|whats the time)\b/
  ])) {
    return `The current time is ${new Date().toLocaleTimeString()}`;
  }

  // Date variations
  if (matchesPattern(text, [
    /\b(date|what date|current date|what's the date|whats the date|today|what day)\b/
  ])) {
    const now = new Date();
    return `Today is ${now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`;
  }

  // Location variations
  if (matchesPattern(text, [
    /\b(where am i|my location|current location|where are we)\b/
  ])) {
    const lat = parseFloat(localStorage.getItem("scaar_lat"));
    const lon = parseFloat(localStorage.getItem("scaar_lon"));
    if (lat && lon) {
      const cityName = await getCityName(lat, lon);
      return `You are currently in ${cityName}`;
    }
    return "I don't have access to your location. Please enable location services.";
  }

  // Distance calculation
  const distanceMatch = text.match(/how far is (.*?) (?:from here|away)/);
  if (distanceMatch) {
    const target = distanceMatch[1];
    const lat = parseFloat(localStorage.getItem("scaar_lat"));
    const lon = parseFloat(localStorage.getItem("scaar_lon"));
    
    if (lat && lon) {
      const targetCoords = await getLatLonForPlace(target);
      if (targetCoords) {
        const dist = getDistanceFromLatLon(lat, lon, targetCoords.lat, targetCoords.lon);
        return `${target} is approximately ${dist.toFixed(1)} kilometers away from your current location.`;
      } else {
        return `Sorry, I couldn't find the location "${target}".`;
      }
    }
    return "I need your location first to calculate distances.";
  }

  // Timer variations
  const timerMatch = text.match(/(?:set )?timer (?:for )?(\d+) (second|minute)s?/) ||
                   text.match(/(?:start|begin) (?:a )?(\d+) (second|minute) timer/);
  if (timerMatch) {
    const num = parseInt(timerMatch[1]);
    const unit = timerMatch[2];
    const ms = unit.startsWith("minute") ? num * 60000 : num * 1000;
    setTimeout(() => speak("⏰ Time's up! Your timer has finished."), ms);
    return `Timer set for ${num} ${unit}${num > 1 ? 's' : ''}. I'll let you know when it's done.`;
  }

  // Website opening
  if (matchesPattern(text, [/\b(open google|go to google)\b/])) { 
    window.open("https://www.google.com", "_blank"); 
    return "Opening Google for you."; 
  }
  if (matchesPattern(text, [/\b(open youtube|go to youtube)\b/])) { 
    window.open("https://www.youtube.com", "_blank"); 
    return "Opening YouTube for you."; 
  }

  // Jokes
  if (matchesPattern(text, [/\b(joke|tell me a joke|say a joke|funny)\b/])) {
    const jokes = [
      "Why don't skeletons fight each other? They don't have the guts!",
      "Why was the math book sad? Because it had too many problems!",
      "What do you call a fake noodle? An impasta!",
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus!"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Notes - multiple variations
  if (matchesPattern(text, [/\b(remember|note|write down|save)\b/])) {
    const notePatterns = [
      /(?:remember|note|write down|save) (?:that |to )?(.+)/,
      /(?:make a note|take a note) (?:that |to )?(.+)/
    ];
    
    for (let pattern of notePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const note = match[1].trim();
        notes.push(note);
        saveData();
        return `Got it! I've remembered: ${note}`;
      }
    }
    return "What would you like me to remember?";
  }

  if (matchesPattern(text, [/\b(delete notes|clear notes|remove notes)\b/])) { 
    notes.length = 0; 
    saveData(); 
    return "All notes have been cleared."; 
  }

  // Capabilities
  if (matchesPattern(text, [
    /\b(what can you do|your capabilities|help|commands|features)\b/
  ])) {
    return "I can help you with many things! I can tell you the time and date, set timers, remember notes, manage reminders and tasks, tell jokes, do math calculations, get weather information, share your location, calculate distances, play music, open websites, and answer general questions. Just speak naturally to me!";
  }

  // Reminders
  const reminderMatch = text.match(/remind me (?:to )?(.+?) in (\d+) (second|minute)s?/);
  if (reminderMatch) {
    const task = reminderMatch[1].trim();
    const num = parseInt(reminderMatch[2]);
    const unit = reminderMatch[3];
    const ms = unit.startsWith("minute") ? num * 60000 : num * 1000;
    
    reminders.push({ text: task, time: Date.now() + ms });
    saveData();
    return `Reminder set! I'll remind you to ${task} in ${num} ${unit}${num > 1 ? 's' : ''}.`;
  }

  if (matchesPattern(text, [/\b(delete reminders|clear reminders|remove reminders)\b/])) { 
    reminders.length = 0; 
    saveData(); 
    return "All reminders have been cleared."; 
  }

  // Tasks/Todo
  const taskMatch = text.match(/(?:add task|new task|create task) (.+)/) ||
                   text.match(/(?:add|create) (?:a )?(?:task|todo) (.+)/);
  if (taskMatch && taskMatch[1]) {
    const task = taskMatch[1].trim();
    todos.push(task);
    saveData();
    return `Task added to your list: ${task}`;
  }

  if (matchesPattern(text, [/\b(show tasks|list tasks|my tasks|todo list)\b/])) {
    return todos.length ? `Here are your tasks: ${todos.join(", ")}` : "You don't have any tasks yet.";
  }

  if (matchesPattern(text, [/\b(delete all tasks|clear tasks|remove all tasks)\b/])) { 
    todos.length = 0; 
    saveData(); 
    return "All tasks have been cleared."; 
  }

  // Math calculation
  const mathResult = parseMath(text);
  if (mathResult !== null) {
    return `The result is ${mathResult}`;
  }

  // Weather
  const weatherMatch = text.match(/weather (?:in |for )?(.+)/);
  if (weatherMatch && weatherMatch[1]) {
    const city = weatherMatch[1].trim();
    try {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=3`);
      const weatherData = await res.text();
      return weatherData || `Sorry, I couldn't get weather information for ${city}.`;
    } catch {
      return `Sorry, weather service is currently unavailable.`;
    }
  }

  // Fun facts
  if (matchesPattern(text, [/\b(fun fact|random fact|tell me a fact|interesting fact)\b/])) {
    const facts = [
      "A group of flamingos is called a 'flamboyance'.",
      "Bananas are berries, but strawberries aren't.",
      "A day on Venus is longer than its year.",
      "Octopuses have three hearts and blue blood.",
      "The shortest war in history lasted only 38-45 minutes."
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  }

  // Music controls
  if (matchesPattern(text, [/\b(play music|start music)\b/])) { 
    try {
      music?.play();
      return "Playing music for you.";
    } catch {
      return "Music playback isn't available right now.";
    }
  }

  if (matchesPattern(text, [/\b(pause music|stop music)\b/])) { 
    music?.pause(); 
    return "Music paused."; 
  }

  // General questions (search)
  if (matchesPattern(text, [/^(what|who|when|where|why|how)/])) {
    return await getSearchSummary(originalText);
  }

  // Default response
  return "I'm not sure I understood that. Could you please repeat ?";
}

function startRecognition() {
  if (!SpeechRecognition) {
    transcriptEl.textContent = "Speech recognition is not supported in this browser.";
    return;
  }
  if (listening) return;

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = async (event) => {
    const text = event.results[event.results.length - 1][0].transcript.trim();
    updateTranscriptDisplay(`You: ${text}\n\n`);
    
    const reply = await handleCommand(text);
    if (reply !== null) {
      speak(reply, () => {
        if (listening) {
          setTimeout(() => recognition?.start(), 100);
        }
      });
    }
  };

  recognition.onerror = (e) => {
    console.error("Speech recognition error:", e.error);
    
    if (["not-allowed", "service-not-allowed"].includes(e.error)) {
      speak("I need microphone access to work properly. Please allow microphone permissions.");
    } else if (e.error === "no-speech") {
      setTimeout(() => {
        if (listening) recognition?.start();
      }, 1000);
    }
  };

  recognition.onend = () => { 
    if (listening && !speaking) {
      setTimeout(() => recognition?.start(), 100);
    }
  };

  listening = true;
  recognition.start();
  speak("SCAAR activated and ready! I'm listening for your commands.", () => {
    if (listening) recognition?.start();
  });
}

// Start listening on first click
document.body.addEventListener("click", () => {
  if (!listening) startRecognition();
}, { once: true });

// Initialize display
updateTranscriptDisplay(" SCAAR is ready! Click anywhere to start...\n\n");
checkReminders();
