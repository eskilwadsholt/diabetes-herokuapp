from flask import Flask
from app import app, login_required
from user.models import User, Data

@app.route('/user/signup', methods = ['POST'])
def signup():
  return User().signup()

@app.route('/user/signout', methods = ['GET'])
def signout():
  return User().signout()

@app.route('/user/login', methods = ['POST'])
def login():
  return User().login()

@app.route('/data/BG', methods = ['POST'])
@login_required
def submitBG():
  return Data().submitBG();