import random

def tell_joke():
    jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "I told my computer I needed a break, and now it won’t stop sending me KitKat ads.",
        "Parallel lines have so much in common. It’s a shame they’ll never meet."
    ]
    return random.choice(jokes)
