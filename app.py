from flask import Flask, render_template, request
from fuzzywuzzy import fuzz
from date_time import date, time
from authorize import authorize, user_name, respect
from timer import start_timer, stop_timer
from personal_details import update_details, display_details, clear_details
from calculator import calculator
import re
from note_taking import create_note, add_note, view_notes, clear_notes
from important import store_important_details, view_important_details, delete_important_details
from greeting import greet_user
from reminder import add_reminder, view_reminders, delete_reminders
from to_do import add_task, view_tasks, delete_tasks
from music_player import play_music, pause_music, resume_music, stop_music, list_music, get_random_song, next_music
from summarizer import summarize
from system_status import system, battery_status, hardware_info, check_open_ports, scan_wifi, get_wifi_profiles
from file_maker import create_file_from_text
from computer import pc_automation
from memory import Memory
from jokes import tell_joke
from facts import random_fact
from app_taker import open_app_or_website
from volume import VolumeControl, unmute_system_sound, mute_system_sound
from brightness import BrightnessControl
from control_wifi import WifiControl
from search_on_gyt import search_on_google_youtube

app = Flask(__name__, template_folder='.')
chat_history = []
# Function to determine chatbot model
def model(text):
    return "SCAR CHATBOT" if "model" in text else "MARK-2"

# Check user authorization
def user():
    return authorize()
user()

# Fuzzy command matching
def cmd(text, keyword, percentage=85):
    return fuzz.ratio(text.lower(), keyword.lower()) > percentage

# Command processing function
def run(text):
    text = text.lower()



    match text:
        case _ if cmd(text, "hello") or cmd(text, "hi"):
            return f"Hello, {user_name()}"

        case _ if cmd(text, "okey"):
            return "👍"
        
        case _ if "what is your name" in text or "whats your name" in text or "who are you" in text:
            return "My name is SCAR."

        case _ if cmd(text, "how are you") or cmd(text, "how are you doing") or "how r u" in text or "how are u" in text:
            return "I'm fine, thank you."

        

        case _ if "what is my name" in text or "whats my name" in text:
            return f"Your name is {user_name()}."

        case _ if text in ["quit", "exit", "thankyou", "bye", "goodbye", "thank you", "q"]:
            return "Goodbye 👋"

        case _ if "are you there" in text:
            return f"At Your Service {respect()}!!!"

        case _ if cmd(text, "date"):
            return date()

        case _ if "whats the time" in text or "what is the time" in text or "time now" in text:
            return time()

        case _ if "set timer" in text or "timer" in text:
            start_timer()
            return "Timer started."

        case _ if cmd(text, "stop timer"):
            stop_timer()
            return "Timer stopped."

        case _ if "update my details" in text:
            update_details()
            return "Details updated."

        case _ if "show my details" in text:
            return display_details()

        case _ if "clear my details" in text:
            clear_details()
            return "Details cleared."

        case _ if re.search(r'(\d+\s*[\+\-\*/]\s*\d+)', text) or "calculate" in text:
            return f"{calculator(text)}"

        case _ if "create note" in text:
            create_note()
            return "Note created."

        case _ if "add note" in text:
            add_note()
            return "Note added."

        case _ if "view note" in text:
            return view_notes()

        case _ if "clear my note" in text:
            clear_notes()
            return "Notes cleared."

        case _ if "store id" in text or "save important details" in text:
            store_important_details()
            return "Important details stored."

        case _ if "show id" in text:
            return view_important_details()

        case _ if "delete id" in text:
            delete_important_details()
            return "Important details deleted."

        case _ if "greet me" in text:
            return greet_user()

        case _ if "good night" in text:
            return f"Good night, {user_name()} 👋"

        case _ if "add reminder" in text:
            add_reminder()
            return "Reminder added."

        case _ if "show reminder" in text:
            return view_reminders()

        case _ if "delete reminder" in text:
            delete_reminders()
            return "Reminder deleted."

        case _ if "add task" in text:
            add_task()
            return "Task added."

        case _ if "show task" in text:
            return view_tasks()

        case _ if "delete task" in text:
            delete_tasks()
            return "Task deleted."

        case _ if "list" in text and "music" in text:
            return list_music()

        case _ if "play" in text and "music" in text:
            song = get_random_song()
            return play_music(song) if song else "No songs available."

        case _ if "pause" in text and "music" in text:
            pause_music()
            return "Music paused."

        case _ if "resume" in text and "music" in text:
            resume_music()
            return "Music resumed."

        case _ if "stop" in text and "music" in text:
            stop_music()
            return "Music stopped."

        case _ if "next" in text and "music" in text:
            next_music()
            return "Playing next song."

        case _ if "summarize" in text:
            return summarize()

        case _ if "system status" in text:
            return system()

        case _ if "battery status" in text:
            return battery_status()

        case _ if "hardware info" in text:
            return hardware_info()

        case _ if "network scan" in text:
            return check_open_ports()

        case _ if "scan wifi" in text:
            return scan_wifi()

        case _ if "wifi password" in text:
            return get_wifi_profiles()

        case _ if "make a file" in text:
            return create_file_from_text(text)

        case _ if ("shutdown" in text or "restart" in text or "lock" in text) and "pc" in text:
            return pc_automation(text)

        case _ if "learn" in text:
            memory = Memory()
            return memory.process_input(text)
        
        case _ if text.startswith("what is"):
            memory = Memory()
            return memory.process_input(text)

        case _ if "tell me a joke" in text:
            return tell_joke()

        case _ if "tell me a fact" in text:
            return random_fact()

        case _ if "open" in text:
            return open_app_or_website(text)

        case _ if "volume" in text:
            volume_control = VolumeControl()
            return volume_control.handle_command(text)

        case _ if "brightness" in text:
            brightness_control = BrightnessControl()
            return brightness_control.handle_command(text)

        case _ if "wifi" in text:
            wifi_control = WifiControl()
            return wifi_control.handle_command(text)

        case _ if "unmute" in text:
            return unmute_system_sound()

        case _ if "mute" in text:
            return mute_system_sound()

        case _ if "search" in text:
            search_on_google_youtube(text)
            return "Searching..."

        case _:
            return "I don't understand."

@app.route("/", methods=["GET", "POST"])
def chat():
    global chat_history

    if request.method == "POST":
        user_input = request.form["user_input"]
        response = run(user_input)

        chat_history.insert(0, {"sender": "user", "text": user_input})
        chat_history.insert(0, {"sender": "SCAR", "text": response})

    return render_template("index.html", chat_history=chat_history)

if __name__ == "__main__":
    app.run(debug=True)
    app.run(debug=True)
