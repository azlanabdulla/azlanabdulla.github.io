import time
import threading
from datetime import datetime, timedelta
import sys


timer_active = False
timer_thread = None  
stop_event = threading.Event()  


def start_timer():
    global timer_active, timer_thread, stop_event  
    if timer_active:  
        return "Timer is already running."
        return

    stop_event.clear()

    timer_input = input("Enter the time in HH:MM format to set the timer: ")

    try:
        user_time = datetime.strptime(timer_input, "%H:%M").time()
        now = datetime.now()
        target_time = datetime.combine(now.date(), user_time)

        if target_time < now:
            target_time = datetime.combine(now.date(), user_time) + timedelta(days=1)

        return f"Timer has been set for {target_time.strftime('%H:%M')}. You can continue your work."
        
        timer_active = True  

        timer_thread = threading.Thread(target=run_timer, args=(target_time,))
        timer_thread.daemon = True  
        timer_thread.start()

    except ValueError:
        return "❌ Invalid time format. Please enter time in HH:MM format."

def run_timer(target_time):
    global timer_active, stop_event
    while datetime.now() < target_time and timer_active:
        if stop_event.is_set():  
            
            return "\n⏹️ Timer stopped manually."
            sys.stdout.flush()
            reset_timer() 
            return
        time.sleep(1)  

    if timer_active and not stop_event.is_set():
        
        return "\n⏰ Time's up!"
        sys.stdout.flush()
        reset_timer()  


def stop_timer():
    global timer_active, stop_event
    if not timer_active:
        return ("No timer is running.")
        return

    stop_event.set() 
    timer_active = False 
    return ("Timer stopped⏹️.")
    sys.stdout.flush()  

def reset_timer():
    global timer_active
    timer_active = False 
