from flask import Flask, jsonify, request, session, redirect
import uuid
from passlib.hash import pbkdf2_sha256
from app import db

pepper = "This is nice, but not important"

class User:

  def login(self):
    user = db.users.find_one({ "email": request.form.get('email') })

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
    if db.users.find_one({ "email": user["email"]}):
      return jsonify({ "error": "E-mail address already in use"}), 400

    if db.users.insert_one(user):
      return self.start_session(user)

    return jsonify({ "error": "Signup failed" }), 400