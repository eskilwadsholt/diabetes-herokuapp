from flask import Flask, jsonify, request, session, redirect
import uuid
from passlib.hash import pbkdf2_sha256
from app import user_db, data_db

pepper = "This is nice, but not important"

class Data:
  def submitBolus(self):
    data = request.json
    email = session["user"]["email"].replace('.', '+')
    coll = data_db["bolus: " + email]
    try:
      coll.insert_one(request.json)
    except:
      return jsonify({ "error": "Request to submit bolus to DB failed" }), 400
    return "success", 200

  def submitBG(self):
    data = request.json
    email = session["user"]["email"].replace('.', '+')
    coll = data_db["BG: " + email]
    try:
      coll.insert_one(request.json)
    except:
      return jsonify({ "error": "Request to submit BG to DB failed" }), 400
    return "success", 200

class User:

  def login(self):
    user = user_db.users.find_one({ "email": request.form.get('email') })

    if user and pbkdf2_sha256.verify(user['salt'] + request.form.get('password') + pepper, user['password']):
        return self.start_session(user)
    
    return jsonify({ "error": "Invalid login credentials"}), 401

  def signout(self):
    session.clear()
    return redirect('/')

  def start_session(self, user):
    del user['password'], user['salt']
    session['logged_in'] = True
    session['user'] = user
    return jsonify(user), 200

  def signup(self):
    print(request.form)

    # Create the user object
    user = {
      "_id": uuid.uuid4().hex,
      "salt": uuid.uuid4().hex,
      "name": request.form.get('name'),
      "email": request.form.get('email'),
      "password": request.form.get('password'),
    }

    # Encrypt the password
    user['password'] = pbkdf2_sha256.encrypt(user['salt'] + user['password'] + pepper)


    # Check for existing email address
    if user_db.users.find_one({ "email": user["email"]}):
      return jsonify({ "error": "E-mail address already in use"}), 400

    if user_db.users.insert_one(user):
      return self.start_session(user)

    return jsonify({ "error": "Signup failed" }), 400