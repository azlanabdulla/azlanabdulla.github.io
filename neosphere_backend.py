from fastapi import FastAPI, Query
import json
import os

app = FastAPI()
MEMORY_FILE = "memory.json"

def load_memory():
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r") as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return {}
    return {}

def save_memory(data):
    with open(MEMORY_FILE, "w") as file:
        json.dump(data, file, indent=4)

memory = load_memory()

@app.get("/ask/")
def ask(question: str = Query(..., description="Enter your question")):
    question_lower = question.lower()
    
    if question_lower in memory:
        return {"answer": memory[question_lower]}
    else:
        memory[question_lower] = "I don't know that yet."
        save_memory(memory)
        return {"answer": "I don't know that yet."}

@app.post("/learn/")
def learn(question: str, answer: str):
    memory[question.lower()] = answer
    save_memory(memory)
    return {"message": "Learned successfully!"}
