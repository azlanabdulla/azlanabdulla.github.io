import os
from authorize import user_code 


def get_note_file():
    access_code = user_code()  
    return f"note{access_code}.txt"


def create_note():
    note_file = get_note_file()
    
    if os.path.exists(note_file):
        print(f"Note file for access code {user_code()} already exists.")
    else:
        with open(note_file, 'w') as file:
            file.write("Notes for Access Code: " + str(user_code()) + "\n\n")
        print(f"Note file for access code {user_code()} created successfully.")


def add_note():
    note_file = get_note_file()
    
    if os.path.exists(note_file):
        note = input("Enter your note: ")
        with open(note_file, 'a') as file:
            file.write(note + "\n")
        print("Note added successfully.")
    else:
        print(f"No note file found for access code {user_code()}. Please create a note file first.")


def view_notes():
    note_file = get_note_file()
    
    if os.path.exists(note_file):
        with open(note_file, 'r') as file:
            content = file.read()
            print(content)
    else:
        print(f"No note file found for access code {user_code()}. Please create a note file first.")


def clear_notes():
    note_file = get_note_file()
    
    if os.path.exists(note_file):
        os.remove(note_file)
        print(f"Note file for access code {user_code()} has been cleared.")
    else:
        print(f"No note file found for access code {user_code()}.")
