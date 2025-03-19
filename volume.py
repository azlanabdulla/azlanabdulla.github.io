from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from comtypes import CLSCTX_ALL
import re
import ctypes

class VolumeControl:
    def __init__(self):
        devices = AudioUtilities.GetSpeakers()
        interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
        self.volume = interface.QueryInterface(IAudioEndpointVolume)

    def set_volume(self, level):
        """Set volume to a specific level (0 to 100)."""
        if 0 <= level <= 100:
            self.volume.SetMasterVolumeLevelScalar(level / 100, None)
        else:
            return("Volume level must be between 0 and 100.")

    def change_volume(self, direction, amount=10):
        """Increase or decrease volume by a specific amount."""
        current_volume = self.volume.GetMasterVolumeLevelScalar() * 100
        
        if direction == "increase":
            new_volume = min(current_volume + amount, 100)
        elif direction == "decrease":
            new_volume = max(current_volume - amount, 0)
        else:
            return("Invalid direction. Use 'increase' or 'decrease'.")

        self.set_volume(new_volume)

    def handle_command(self, command):
        """Parse the user command and adjust volume accordingly."""
        command = command.lower()

        # Check for specific percentage command
        match = re.search(r'(increase|decrease|set) (?:volume )?(?:to )?(\d+)%', command)
        if match:
            level = int(match.group(2))
            self.set_volume(level)
            return(f"Volume set to {level}%.")

        # Check for simple increase or decrease command
        elif "increase volume" in command or "volume up" in command:
            self.change_volume("increase")
            return("Volume increased by 10%.")
        elif "decrease volume" in command or "volume down" in command:
            self.change_volume("decrease")
            return("Volume decreased by 10%.")
        else:
            return("I don't understand the volume command. Please specify 'increase volume', 'decrease volume', or 'set volume to X%'.")

if __name__ == "__main__":
    vc = VolumeControl()
    
    # Example usage
    vc.handle_command("increase volume")
    vc.handle_command("decrease volume")
    vc.handle_command("increase volume to 50%")
    vc.handle_command("decrease volume to 50%")
    vc.handle_command("set volume to 70%")
    vc.handle_command("set volume to 85%")





def mute_system_sound():
    devices = AudioUtilities.GetSpeakers()
    interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
    volume = ctypes.cast(interface, ctypes.POINTER(IAudioEndpointVolume))
    
    # Mute the system sound
    volume.SetMute(1, None)
    return("System sound muted.")

def unmute_system_sound():
    devices = AudioUtilities.GetSpeakers()
    interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
    volume = ctypes.cast(interface, ctypes.POINTER(IAudioEndpointVolume))
    
    # Unmute the system sound
    volume.SetMute(0, None)
    return("System sound unmuted.")
