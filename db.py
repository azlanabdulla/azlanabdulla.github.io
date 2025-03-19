import mysql.connector as con

def get_db_cursor():
    db = con.connect(host="localhost", user="root", password="az1la2n3", database="chatbot")
    cur = db.cursor()
    return db, cur
def user():
    db, cur = get_db_cursor()
    cur.execute("SELECT * FROM user_info1")
    user_data = cur.fetchall()  
    cur.close()  
    db.close()  
    return user_data
