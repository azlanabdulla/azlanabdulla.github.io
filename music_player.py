import os
import random
import vlc
import time

# Path to the directory where your music files are stored
MUSIC_DIR = r'C:\Users\AZLAN\PYTHON\NOVA_WEB\music'  # Update this with the correct path

# Create a VLC instance
player = vlc.MediaPlayer()

# Keep track of the current song
current_song = None

def list_music():
    """List available music in the directory."""
    try:
        music_files = [f for f in os.listdir(MUSIC_DIR) if f.endswith(('.mp3'))]
        if music_files:
            return "Available music files:"
            for file in music_files:
                return file
        else:
            return "No music files found."
    except FileNotFoundError:
        return "Music directory not found."

def play_music(song):
    """Play the specified song."""
    global current_song
    try:
        song_path = os.path.join(MUSIC_DIR, song)
        if os.path.exists(song_path):
            media = vlc.Media(song_path)
            player.set_media(media)
            player.play()
            current_song = song
            return "Playing:"+ song
            time.sleep(1)  # Sleep for 1 second to ensure the song starts playing
        else:
            return  f"Song {song} not found in the music directory."
    except Exception as e:
        return  f"Error while trying to play the song: {e}"

def pause_music():
    """Pause the current song."""
    if player.is_playing():
        player.pause()
        return f"Paused: {current_song}"
    else:
        return "No music is playing."

def resume_music():
    """Resume the current song."""
    global current_song
    if not player.is_playing() and current_song:
        player.play()
        return f"Resumed: {current_song}"
    else:
        return "Music is already playing or no song selected."

def stop_music():
    """Stop the current song."""
    global current_song
    player.stop()
    return "Stopped:"+current_song
    current_song = None
def next_music():
    """Play the next song in the directory."""
    global current_song
    if current_song:
        current_song = get_random_song()
        play_music(current_song)
        return "Playing:"+ current_song
    else:
        return "No song is currently playing."
def get_random_song():
    """Get a random song from the music directory."""
    try:
        music_files = [f for f in os.listdir(MUSIC_DIR) if f.endswith(('.mp3', '.wav', '.flac'))]
        if music_files:
            return random.choice(music_files)
        else:
            return "No music files found."
            return None
    except FileNotFoundError:
        return "Music directory not found."
        return None
