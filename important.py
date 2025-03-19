from authorize import user_code
import os

def get_file_path():
    """Generate a file path based on the user's access code."""
    access_code = user_code()
    return f"important_details_{access_code}.txt"

def set_password():
    """Set a password for accessing important details."""
    file_path = get_file_path()
    if os.path.exists(file_path):
        print("🔒 Password is already set for your important details.")
        return
    
    password = input("Set a password for your important details: ")
    with open(file_path, "w") as file:
        file.write(f"Password: {password}\n")
    print("✅ Password set successfully.")

def validate_password():
    """Validate the user's password before accessing important details."""
    file_path = get_file_path()
    if not os.path.exists(file_path):
        print("⚠️ No important details found. Please set your details first.")
        return False

    with open(file_path, "r") as file:
        lines = file.readlines()
        if lines and lines[0].startswith("Password: "):
            stored_password = lines[0].split("Password: ")[1].strip()
        else:
            print("⚠️ No password found. Please set your password first.")
            return False

    entered_password = input("🔑 Enter your password: ")
    if entered_password == stored_password:
        return True
    else:
        print("❌ Incorrect password. Access denied.")
        return False

def store_important_details():
    """Store important details in a password-protected file."""
    file_path = get_file_path()
    if not os.path.exists(file_path):
        set_password()

    details = input("📝 Enter the important details you want to store: ")
    with open(file_path, "a") as file:
        file.write(details + "\n")
    print("✅ Your important details have been stored.")

def view_important_details():
    """View stored important details after password verification."""
    if not validate_password():
        return
    
    file_path = get_file_path()
    with open(file_path, "r") as file:
        lines = file.readlines()
        details = "".join(lines[1:])  # Skip the password line
    
    if details.strip():
        print("\n📄 Important Details:\n")
        print(details)
    else:
        print("\n⚠️ No important details found.")

def delete_important_details():
    """Delete all stored important details after password verification."""
    if not validate_password():
        return

    file_path = get_file_path()
    if os.path.exists(file_path):
        confirmation = input("⚠️ Are you sure you want to delete all important details? (yes/no): ").lower()
        if confirmation == 'yes':
            os.remove(file_path)
            print("✅ All important details have been deleted successfully.")
        else:
            print("❌ Deletion canceled.")
    else:
        print("⚠️ No important details file found to delete.")
