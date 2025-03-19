import json
import os

class Memory:
    def __init__(self, memory_file="memory.json"):
        self.memory_file = memory_file
        self.data = self.load_memory()

    def load_memory(self):
        if os.path.exists(self.memory_file):
            with open(self.memory_file, "r") as file:
                return json.load(file)
        return {}

    def save_memory(self):
        with open(self.memory_file, "w") as file:
            json.dump(self.data, file, indent=4)

    def remember(self, text):
        _, key, *value = text.split()
        value = " ".join(value)
        self.data[key] = value
        self.save_memory()
        return f"Got it! I'll remember that {key} means '{value}'."

    def recall(self, text):
        key = text[8:].strip()
        return self.data.get(key, "I don't remember that yet.")

    def forget(self, key):
        if key in self.data:
            del self.data[key]
            self.save_memory()
            return f"I've forgotten what {key} means."
        return "I don't remember that yet."

    def process_input(self, text):
        if "learn" in text:
            return self.remember(text)
        elif text.startswith("what is"):
            return self.recall(text)
        return "I don't understand"
