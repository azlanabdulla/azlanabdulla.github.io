import screen_brightness_control as sbc
import re

class BrightnessControl:
    def __init__(self):
        pass  # No initialization needed for brightness control

    def set_brightness(self, level):
        """Set screen brightness to a specific level (0 to 100)."""
        if 0 <= level <= 100:
            sbc.set_brightness(level)
            return(f"Brightness set to {level}%.")
        else:
            return("Brightness level must be between 0 and 100.")

    def change_brightness(self, direction, amount=10):
        """Increase or decrease screen brightness by a specific amount."""
        current_brightness = sbc.get_brightness(display=0)
        
        if direction == "increase":
            new_brightness = min(current_brightness[0] + amount, 100)
        elif direction == "decrease":
            new_brightness = max(current_brightness[0] - amount, 0)
        else:
            return("Invalid direction. Use 'increase' or 'decrease'.")
            return

        self.set_brightness(new_brightness)

    def handle_command(self, command):
        """Parse the user command and adjust brightness accordingly."""
        command = command.lower()

        # Check for specific percentage command
        match = re.search(r'(increase|decrease|set|up|down) (?:brightness|light)?(?: to )?(\d+)%', command)
        if match:
            level = int(match.group(2))
            self.set_brightness(level)
            return

        # Check for simple increase or decrease command
        if any(phrase in command for phrase in ["increase brightness", "brightness up", "light up", "increase light"]):
            self.change_brightness("increase")
            return "brightness increased"
        elif any(phrase in command for phrase in ["decrease brightness", "brightness down", "light down", "decrease light"]):
            self.change_brightness("decrease")
            return "brightness decreased"

        else:
            return("I don't understand the brightness command. Please specify 'increase brightness', 'decrease brightness', or 'set brightness to X%'.")

if __name__ == "__main__":
    bc = BrightnessControl()

    # Example usage
    bc.handle_command("increase brightness")
    bc.handle_command("decrease brightness")
    bc.handle_command("set brightness to 50%")
    bc.handle_command("brightness up")
    bc.handle_command("light down")
    bc.handle_command("set light to 70%")
