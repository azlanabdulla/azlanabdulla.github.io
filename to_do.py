import os  
from authorize import user_code  

# File path for storing to-do lists based on user code  
def get_file_path():  
    return f"todo_{user_code()}.txt"  

# Add a new task  
def add_task():  
    task = input("Enter the task you want to add: ")  
    with open(get_file_path(), "a") as file:  
        file.write(f"- {task}\n")  
    return("✅ Task added successfully.")  

# View all tasks  
def view_tasks():  
    if os.path.exists(get_file_path()):  
        with open(get_file_path(), "r") as file:  
            content = file.read()  
            if content.strip():  
                return(f"\n📝 Your To-Do List: \n {content}")  
            else:  
                return("No tasks found.")  
    else:  
        return("No tasks set.")  

# Delete all tasks  
def delete_tasks():  
    password = int(input("Enter your password to delete tasks: "))
    if password == user_code():  
        if os.path.exists(get_file_path()):  
            os.remove(get_file_path())  
            return("🗑️ All tasks deleted successfully.")  
        else:  
            return("No tasks found to delete.")  
    else:  
        return("❌ Incorrect password.")  
