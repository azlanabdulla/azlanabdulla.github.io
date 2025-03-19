import csv
import os
from authorize import user_code  

def get_file_path():
    access_code = user_code()  
    return f'personal_details_{access_code}.csv'  

def read_details():
    file_path = get_file_path()  
    
    if not os.path.exists(file_path):
        with open(file_path, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['Name', 'Age', 'Location', 'Mail ID', 'Phone Number']) 
        return {}
    
    with open(file_path, mode='r') as file:
        reader = csv.DictReader(file)
        details = {}
        for row in reader:
            details = row  
        return details

def write_details(details):
    file_path = get_file_path()  
    with open(file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Name', 'Age', 'Location', 'Mail ID', 'Phone Number'])  
        writer.writerow([details['Name'], details['Age'], details['Location'], details['Mail ID'], details['Phone Number']])

def clear_details():
    file_path = get_file_path()  
    if os.path.exists(file_path):
        with open(file_path, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['Name', 'Age', 'Location', 'Mail ID', 'Phone Number'])  
    return "All details have been cleared."

def update_details(name, age, location, mail_id, phone):
    details = {
        'Name': name,
        'Age': age,
        'Location': location,
        'Mail ID': mail_id,
        'Phone Number': phone
    }
    
    write_details(details)
    return "Your details have been updated."

def display_details():
    details = read_details()
    if details:
        return f"""
        Personal Details:
        Name: {details['Name']}
        Age: {details['Age']}
        Location: {details['Location']}
        Mail ID: {details['Mail ID']}
        Phone Number: {details['Phone Number']}
        """
    else:
        return "No personal details found."
