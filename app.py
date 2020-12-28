from flask import Flask, render_template, redirect, session
from functools import wraps
from pymongo import MongoClient

app = Flask(__name__)

app.secret_key = b'\x13\x8b\x8eF&!{\xcb\xae\x90\x84\x17nI\x80\x9a'

# Database
connection_string = "mongodb+srv://eskil-diabetes:kodenSpass!@diabetes-testdb.47dt3.azure.mongodb.net/<dbname>?retryWrites=true&w=majority"
client = MongoClient(connection_string)
db = client.user_login_system

# Decorators
def login_required(f):
  @wraps(f)
  def wrap(*args, **kwargs):
    if 'logged_in' in session:
        return f(*args, **kwargs)
    return redirect('/')
  return wrap

def forward_if_logged_in(f):
  @wraps(f)
  def wrap(*args, **kwargs):
    if 'logged_in' in session:
        return redirect('/dashboard')
    return f(*args, **kwargs)
  return wrap

# Routes
from user import routes

@app.route('/')
@forward_if_logged_in
def loginpage():
  return render_template("/login/login.html")

@app.route('/signup/')
@forward_if_logged_in
def signuppage():
  return render_template("/login/signup.html")

@app.route('/dashboard/')
@login_required
def dashboard():
  return render_template("dashboard.html")

