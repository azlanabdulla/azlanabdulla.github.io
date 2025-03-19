import random

def random_fact():
    facts = [
        "Did you know? Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old!",
        "A single strand of spaghetti is called a 'spaghetto'.",
        "Bananas are berries, but strawberries aren't.",
        "Octopuses have three hearts and blue blood."
    ]
    return random.choice(facts)
