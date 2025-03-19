from datetime import datetime
from authorize import user_name


def get_greeting():
    current_hour = datetime.now().hour

    if 5 <= current_hour < 12:
        return "Good Morning"
    elif 12 <= current_hour < 17:
        return "Good Afternoon"
    elif 17 <= current_hour < 21:
        return "Good Evening"
    else:
        return "Good Night"


def greet_user():
    name = user_name()
    greeting = get_greeting()
    return(f"{greeting}, {name}! 👋")
