import re

def process_input(expression):
    try:
        expression = expression.lower().replace("plus", "+").replace("minus", "-").replace("times", "*").replace("divided by", "/")
        
        result = eval(expression)
        return result
    except Exception as e:
        return f"Error: {e}"

def calculator(text):
    text = text.lower()
    
    if "calculate" in text:
        text = text.replace("calculate", "").strip()
    
    elif "what is" in text:
        text = text.replace("what is", "").strip()
    
    if re.search(r'(\d+\s*[\+\-\*/]\s*\d+)', text):
        result = process_input(text)
        return f"{result}"
    
    else:
        return "I didn't understand that. Please provide a valid arithmetic expression."
