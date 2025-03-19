from datetime import datetime
def time():
    now = datetime.now()
    current_time = now.strftime("%I:%M%p").upper()  # Formats time like 2:33pm
    return current_time
time()
def date():
    now = datetime.now()
    current_date = now.strftime("%d/%m/%Y")
    return current_date
date()
