import psutil
import platform
import subprocess
import re
import socket
from tabulate import tabulate


def system():
    cpu = psutil.cpu_percent()
    ram = psutil.virtual_memory().percent
    return f"CPU at {cpu}%, RAM at {ram}%. All systems nominal."
system()



def battery_status():
    battery = psutil.sensors_battery()
    if battery:
        status = "Charging" if battery.power_plugged else "Discharging"
        return(f"Battery: {battery.percent}% | {status}")
    else:
        return("No battery detected")
battery_status()




def hardware_info():
    info = f"""
    [HARDWARE]
    OS: {platform.system()} {platform.release()}
    Processor: {platform.processor()}
    Cores: {psutil.cpu_count(logical=False)} physical, {psutil.cpu_count()} logical
    """
    return info

# Command: "hardware specifications"
hardware_info()



def check_open_ports():
    connections = psutil.net_connections()
    suspicious = [conn for conn in connections if conn.status == 'LISTEN' and conn.laddr.port > 49152]
    if suspicious:
        return(f"Alert: {len(suspicious)} suspicious open ports detected")
    else:
        return("Network status: Secure")

# Command: "scan network security"
check_open_ports()





def scan_wifi():
    """Scans for available WiFi networks and displays SSID, Security, and Signal Strength (%)"""
    try:
        result = subprocess.run(['netsh', 'wlan', 'show', 'network', 'mode=bssid'], capture_output=True, text=True)
        output = result.stdout

        # Extract SSID, Signal Strength, and Security type
        networks = re.findall(r"SSID\s+\d+\s+:\s(.+)", output)
        signal_strengths = re.findall(r"Signal\s*:\s(\d+)%", output)
        securities = re.findall(r"Authentication\s*:\s(.+)", output)

        wifi_info = []
        for i in range(len(networks)):
            ssid = networks[i].strip()
            security = securities[i].strip() if i < len(securities) else "Unknown"
            signal = signal_strengths[i].strip() if i < len(signal_strengths) else "N/A"

            wifi_info.append([ssid, security, f"{signal}%"])

        # Return results in a table format
        return tabulate(wifi_info, headers=["SSID", "Security", "Signal Strength"], tablefmt="grid")

    except Exception as e:
        return f"Error scanning WiFi networks: {e}"




def get_wifi_profiles():
    try:
        # Get the list of Wi-Fi profiles
        profiles_data = subprocess.check_output("netsh wlan show profiles", shell=True, text=True)
        profiles = [line.split(":")[1].strip() for line in profiles_data.splitlines() if "All User Profile" in line]

        wifi_info = []
        for profile in profiles:
            try:
                # Get the password for each profile
                profile_info = subprocess.check_output(f'netsh wlan show profile name="{profile}" key=clear', shell=True, text=True)
                password_lines = [line.split(":")[1].strip() for line in profile_info.splitlines() if "Key Content" in line]
                password = password_lines[0] if password_lines else "No Password Found"
                
                wifi_info.append([profile, password])  # Append as a list (for tabulate)
            except subprocess.CalledProcessError:
                wifi_info.append([profile, "Error retrieving password"])

        # Return table output
        return tabulate(wifi_info, headers=["SSID", "Password"], tablefmt="grid")
    
    except subprocess.CalledProcessError as e:
        return f"Error: {str(e)}"
