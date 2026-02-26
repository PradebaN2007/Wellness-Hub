from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# User Model — extended with bio + avatar_color for profile editing
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(200))
    bio = db.Column(db.Text, default='')                    # ✨ new
    avatar_color = db.Column(db.String(30), default='blue') # ✨ new


# Mood Model
class Mood(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    mood = db.Column(db.String(50))
    note = db.Column(db.Text)
    date = db.Column(db.DateTime)


# Activity Model
class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    activity = db.Column(db.String(100))
    duration = db.Column(db.Integer)
    date = db.Column(db.DateTime)


# Exercise Model
class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    exercise_type = db.Column(db.String(100))
    duration = db.Column(db.Integer)
    calories = db.Column(db.Integer)
    notes = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)


# Sleep Model
class SleepLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    duration = db.Column(db.Float)
    quality = db.Column(db.String(20))
    bedtime = db.Column(db.String(10))
    wake_time = db.Column(db.String(10))
    notes = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)


# Meditation Model
class Meditation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    duration = db.Column(db.Integer)
    meditation_type = db.Column(db.String(100))
    mood_before = db.Column(db.String(50))
    mood_after = db.Column(db.String(50))
    notes = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)


# Journal Model
class Journal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    content = db.Column(db.Text)
    mood = db.Column(db.String(50))
    date = db.Column(db.DateTime, default=datetime.utcnow)


# Feedback Model
class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    category = db.Column(db.String(100))
    rating = db.Column(db.Integer)
    message = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)
