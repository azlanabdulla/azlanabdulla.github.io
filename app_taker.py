import webbrowser
import os

def open_app_or_website(command):
    command = command.lower()

    # Define common apps and their executable paths
    apps = {
        "instagram": "https://www.instagram.com",
        "youtube": "https://www.youtube.com",
        "google classroom": "https://classroom.google.com/h",
        "google": "https://www.google.com",
        "chrome": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "spotify": "https://open.spotify.com/",
        "notepad": "notepad.exe",
        "calculator": "calc.exe",
        "yt":"https://www.youtube.com",
        "gl": "https://www.google.com",
        "glc":"https://classroom.google.com/h",
        "chatgpt":"https://chatgpt.com/",
        "github":"https://github.com/azlanabdulla/azlanabdulla.github.io"


    }

    # Check if the command matches any known app or website
    for app in apps:
        if f"open {app}" in command:
            if apps[app].startswith("http"):
                webbrowser.open(apps[app])
                return(f"Opening {app} in your web browser.")
            else:
                try:
                    os.startfile(apps[app])
                    return(f"Opening {app} application.")
                except Exception as e:
                    return(f"Could not open {app}. Error: {e}")
            return

    return("App or website not recognized.")

# Example usage
if __name__ == "__main__":
    user_command = input("Enter your command: ")
    open_app_or_website(user_command)
