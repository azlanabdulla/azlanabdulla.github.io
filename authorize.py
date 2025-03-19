# from db import user  used if more than one user

def authorize():
    authorize_code_in ="101"

    # Set predefined user data
    global name
    name = "Azlan"
    global access_code
    access_code = "101"
    gender = "M"  # Change this if needed to 'F' for female or other for no specific title

    # Check if the input matches the access code
    if authorize_code_in == access_code:
        global respect
        respect = "Sir"
        
        print(f"Welcome {name}, {respect}")
        access_granted = True
    else:
        access_granted = False
    

        if not access_granted:
            print("Access Denied: Invalid Code")
            quit()



def user_name():
    return name
def user_code():
    return access_code
def respect():
    return respect
