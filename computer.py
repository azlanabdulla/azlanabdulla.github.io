import os
import re
import subprocess

def pc_automation(text):
    text = text.lower()

    # Shutdown
    if "shutdown" in text:
        os.system("shutdown /s /t 1")  # Windows
        return "Shutting down the PC..."

    # Restart
    elif "restart" in text:
        os.system("shutdown /r /t 1")  # Windows
        return "Restarting the PC..."

    # Lock Screen
    elif "lock" in text:
        os.system("rundll32.exe user32.dll,LockWorkStation")  # Windows
        return "Locking the PC..."

    # Open an Application (Extracts app name from the sentence)
    match = re.search(r"open (.+)", text)
    if match:
        app_name = match.group(1).strip()
        
        try:
            subprocess.Popen(app_name, shell=True)  # Open app
            return f"Opening {app_name}..."
        except Exception as e:
            return f"Error opening {app_name}: {str(e)}"

    return "Command not recognized."

