import os  
from datetime import datetime  
from authorize import user_code  

# File path for storing reminders based on user code  
def get_file_path():  
    return f"reminders_{user_code()}.txt"  

# Add a new reminder  
def add_reminder():  
    reminder = input("Enter your reminder: ")  
    time = input("Enter the time for the reminder (HH:MM): ")  
    try:  
        datetime.strptime(time, "%H:%M")  
        with open(get_file_path(), "a") as file:  
            file.write(f"{time} - {reminder}\n")  
        return("✅ Reminder added successfully.")  
    except ValueError:  
        return("❌ Invalid time format. Please use HH:MM.")  

# View all reminders  
def view_reminders():  
    if os.path.exists(get_file_path()):  
        with open(get_file_path(), "r") as file:  
            content = file.read()  
            if content.strip():  
                return f"\n📅 Your Reminders: \n {content}"  
            else:  
                return("No reminders found.")  
    else:  
        return("No reminders set.")  

# Delete all reminders  
def delete_reminders():  
    password = int(input("Enter your password to delete reminders: ")) 
    if password == user_code():  
        if os.path.exists(get_file_path()):  
            os.remove(get_file_path())  
            return("🗑️ All reminders deleted successfully.")  
        else:  
            return("No reminders found to delete.")  
    else:  
        return("❌ Incorrect password.")  
