import os
import re

def create_file_from_text(text):
    # Regular expression to extract filename (supports .py, .txt, .csv, etc.)
    match = re.search(r" (\w+\.\w+)", text, re.IGNORECASE)
    
    if match:
        filename = match.group(1)  # Extracted filename
        with open(filename, "w") as file:
            file.write("")  # Create an empty file
        return f"File '{filename}' has been created successfully!"
    else:
        return "Could not detect a valid filename. Try: 'Make a file and name it as example.py'"

# Example usage
