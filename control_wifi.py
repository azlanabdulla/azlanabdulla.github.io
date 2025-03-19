import os
import subprocess
import re

class WifiControl:
    def __init__(self):
        self.interface_name = self.get_wifi_interface_name()

    def get_wifi_interface_name(self):
        """Automatically detect the Wi-Fi interface name."""
        result = subprocess.run(['netsh', 'wlan', 'show', 'interfaces'], capture_output=True, text=True)
        match = re.search(r'\s*SSID\s+:\s+(.*)', result.stdout)
        if match:
            return(f"Detected Wi-Fi network: {match.group(1)}")
        return("No Wi-Fi interface detected.")


    def toggle_wifi(self, state):
        """Connect or disconnect Wi-Fi without admin rights."""
        if not self.interface_name:
            return("No Wi-Fi network detected. Please connect to a Wi-Fi network first.")
            

        if state == "on":
            command = f'netsh wlan connect name="{self.interface_name}"'
            result = os.system(command)
            if result == 0:
                return(f"Wi-Fi connected to {self.interface_name}.")
            else:
                return(f"Failed to connect to {self.interface_name}.")
        elif state == "off":
            command = 'netsh wlan disconnect'
            result = os.system(command)
            if result == 0:
                return(f"Wi-Fi disconnected from {self.interface_name}.")
            else:
                return(f"Failed to disconnect from Wi-Fi.")
        else:
            return("Invalid command. Say 'turn Wi-Fi on' or 'turn Wi-Fi off'.")

    def handle_command(self, command):
        """Parse the user command and toggle Wi-Fi accordingly."""
        command = command.lower()

        # Check for turning Wi-Fi on
        if any(phrase in command for phrase in ["turn wifi on", "enable wifi", "wifi on", "connect to wifi", "turn on wifi"]):
            self.toggle_wifi("on")
            return "Wi-Fi turned on."
        # Check for turning Wi-Fi off
        elif any(phrase in command for phrase in ["turn wifi off", "disable wifi", "wifi off", "disconnect wifi", "turn off wifi"]):
            self.toggle_wifi("off")
            return "Wi-Fi turned off."
        else:
            return("I don't understand the Wi-Fi command. Please specify 'turn Wi-Fi on' or 'turn Wi-Fi off'.")

if __name__ == "__main__":
    wc = WifiControl()

    # Example usage
    wc.handle_command("wifi on")
    wc.handle_command("wifi off")
