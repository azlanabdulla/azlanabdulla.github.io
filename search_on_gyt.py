import re
import webbrowser

def search_on_google_youtube(text):
    text = text.lower()

    # Improved regex to capture full multi-word queries
    match = re.search(r"search (.+?) on (google|youtube)", text)

    if match:
        query = match.group(1).strip().replace(" ", "+")  # Format query for URL
        platform = match.group(2)

        # Determine search URL
        url = f"https://www.google.com/search?q={query}" if platform == "google" else f"https://www.youtube.com/results?search_query={query}"

        # Open the URL in browser
        webbrowser.open(url)
        print(f"Searching for '{query.replace('+', ' ')}' on {platform.capitalize()}...")
    else:
        print("I didn't understand. Try: 'Search <query> on Google' or 'Search <query> on YouTube'.")
