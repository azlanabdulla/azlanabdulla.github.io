// SCAAR Assistant script.js

const transcriptEl = document.getElementById("transcript");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const Synth = window.speechSynthesis;

const notes = JSON.parse(localStorage.getItem("scaar_notes")) || [];
const reminders = JSON.parse(localStorage.getItem("scaar_reminders")) || [];

function saveData() {
  localStorage.setItem("scaar_notes", JSON.stringify(notes));
  localStorage.setItem("scaar_reminders", JSON.stringify(reminders));
}

function updateTranscriptDisplay(extra = "") {
  let noteText = notes.length ? "\nNotes:\n- " + notes.join("\n- ") : "";
  let reminderText = reminders.length ? "\nReminders:\n- " + reminders.map(r => r.text).join("\n- ") : "";
  transcriptEl.textContent += extra + noteText + reminderText;
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

if (!SpeechRecognition || !Synth) {
  transcriptEl.textContent = "Your browser does not support speech recognition or synthesis.";
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = true;

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

  function handleCommand(text) {
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
      return "Opening Google.";
    }
    if (text.includes("open youtube")) {
      window.open("https://www.youtube.com", "_blank");
      return "Opening YouTube.";
    }
    if (text.includes("joke")) {
      return "Why don’t skeletons fight each other? Because they don’t have the guts!";
    }
    if (text.includes("vibrate") && navigator.vibrate) {
      navigator.vibrate(500);
      return "Vibrating now.";
    }
    if (text.includes("battery") && navigator.getBattery) {
      navigator.getBattery().then(b => speak(`Battery is at ${Math.round(b.level * 100)} percent.`));
      return "Checking battery status...";
    }
    if (text.includes("location") && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        speak(`Your location is latitude ${latitude.toFixed(2)}, longitude ${longitude.toFixed(2)}.`);
      });
      return "Checking your location...";
    }
    if (text.includes("remember")) {
      const note = text.split("remember")[1]?.trim();
      if (note) {
        notes.push(note);
        saveData();
        return `Okay, I'll remember: ${note}`;
      }
    }
    if (text.includes("remind me to") && text.includes("in")) {
      const task = text.split("remind me to")[1].split("in")[0].trim();
      const seconds = parseInt(text.split("in")[1]);
      if (task && !isNaN(seconds)) {
        const time = Date.now() + seconds * 1000;
        reminders.push({ text: task, time });
        saveData();
        return `Reminder set to: ${task} in ${seconds} seconds.`;
      }
    }
    if (text.match(/\d+[+\-*/]\d+/)) {
      try {
        return `Result is ${eval(text)}`;
      } catch {
        return "Sorry, couldn't calculate that.";
      }
    }
    return "Sorry, I didn't understand. Can you say that again?";
  }

  function startRecognition() {
    try {
      recognition.start();
    } catch (err) {
      // Prevent multiple starts
    }
  }

  recognition.onresult = (event) => {
    const text = event.results[event.results.length - 1][0].transcript.toLowerCase();
    transcriptEl.textContent = `You: ${text}`;
    const reply = handleCommand(text);
    if (reply) speak(reply);
  };

  recognition.onerror = (e) => {
    transcriptEl.textContent = `Error: ${e.error}`;
  };

  recognition.onend = () => {
    startRecognition();
  };

  document.body.addEventListener("click", () => {
    speak("SCAAR activated. Listening for your command.");
    startRecognition();
  }, { once: true });

  updateTranscriptDisplay();
  checkReminders();
}
