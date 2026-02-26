from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Mood, User, Activity, Exercise, SleepLog, Meditation, Journal, Feedback
from datetime import datetime, timedelta
import os
from groq import Groq
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '.env')
print("ENV EXISTS:", os.path.exists(env_path))
load_dotenv(env_path)
print("ENV PATH:", env_path)
print("API KEY:", os.getenv("GROQ_API_KEY"))

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///wellness.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

with app.app_context():
    db.create_all()


# ═══════════════════════════════════════════════════════════════
# AUTH ROUTES
# ═══════════════════════════════════════════════════════════════

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return {"message": "Email already registered"}, 400
    user = User(name=data["name"], email=data["email"], password=data["password"])
    db.session.add(user)
    db.session.commit()
    return {"message": "User registered"}


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"], password=data["password"]).first()
    if user:
        return {
            "message": "Login success",
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "bio": user.bio or '',
            "avatar_color": user.avatar_color or 'blue',
        }
    return {"message": "Invalid credentials"}, 401


# ═══════════════════════════════════════════════════════════════
# ✨ PROFILE ROUTES (NEW)
# ═══════════════════════════════════════════════════════════════

@app.route("/api/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "bio": user.bio or '',
        "avatar_color": user.avatar_color or 'blue',
    })


@app.route("/api/profile", methods=["PUT"])
def update_profile():
    data = request.json
    user_id = data.get("user_id")
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check email uniqueness if changed
    if data.get("email") and data["email"] != user.email:
        existing = User.query.filter_by(email=data["email"]).first()
        if existing:
            return jsonify({"message": "Email already in use"}), 400

    if data.get("name"):
        user.name = data["name"]
    if data.get("email"):
        user.email = data["email"]
    if data.get("password"):
        user.password = data["password"]
    if "bio" in data:
        user.bio = data["bio"]
    if data.get("avatar_color"):
        user.avatar_color = data["avatar_color"]

    db.session.commit()
    return jsonify({
        "message": "Profile updated",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "bio": user.bio,
            "avatar_color": user.avatar_color,
        }
    })


# ═══════════════════════════════════════════════════════════════
# MOOD ROUTES
# ═══════════════════════════════════════════════════════════════

@app.route("/api/moods", methods=["POST"])
def add_mood():
    data = request.json
    mood = Mood(user_id=data["user_id"], mood=data["mood"], note=data.get("note"), date=datetime.now())
    db.session.add(mood)
    db.session.commit()
    return jsonify({"message": "Mood saved"})


@app.route("/api/moods/<int:user_id>", methods=["GET"])
def get_moods(user_id):
    moods = Mood.query.filter_by(user_id=user_id).all()
    return jsonify([{"mood": m.mood, "date": m.date.strftime("%Y-%m-%d %H:%M")} for m in moods])


# ═══════════════════════════════════════════════════════════════
# ACTIVITY ROUTES
# ═══════════════════════════════════════════════════════════════

@app.route("/api/activity", methods=["POST"])
def add_activity():
    data = request.json
    activity = Activity(user_id=data["user_id"], activity=data["activity"], duration=data["duration"], date=datetime.now())
    db.session.add(activity)
    db.session.commit()
    return {"message": "Activity saved"}


@app.route("/api/activity/<int:user_id>", methods=["GET"])
def get_activities(user_id):
    activities = Activity.query.filter_by(user_id=user_id).all()
    return jsonify([{"activity": a.activity, "duration": a.duration, "date": a.date.strftime("%Y-%m-%d")} for a in activities])


# ═══════════════════════════════════════════════════════════════
# EXERCISE ROUTES
# ═══════════════════════════════════════════════════════════════

@app.route("/api/exercises", methods=["POST"])
def add_exercise():
    data = request.json
    exercise = Exercise(
        user_id=data["user_id"], exercise_type=data.get("exercise_type", "General"),
        duration=data["duration"], calories=data.get("calories"), notes=data.get("notes", "")
    )
    db.session.add(exercise)
    db.session.commit()
    return jsonify({"message": "Exercise saved", "id": exercise.id})


@app.route("/api/exercises/<int:user_id>", methods=["GET"])
def get_exercises(user_id):
    exercises = Exercise.query.filter_by(user_id=user_id).order_by(Exercise.date.desc()).all()
    return jsonify([{
        "id": e.id, "exercise_type": e.exercise_type, "duration": e.duration,
        "calories": e.calories, "notes": e.notes, "date": e.date.strftime("%Y-%m-%d %H:%M")
    } for e in exercises])


# ═══════════════════════════════════════════════════════════════
# SLEEP ROUTES
# ═══════════════════════════════════════════════════════════════

@app.route("/api/sleep", methods=["POST"])
def add_sleep():
    data = request.json
    sleep_log = SleepLog(
        user_id=data["user_id"], duration=data["duration"],
        quality=data.get("quality", "Good"), bedtime=data.get("bedtime"),
        wake_time=data.get("wake_time"), notes=data.get("notes", "")
    )
    db.session.add(sleep_log)
    db.session.commit()
    return jsonify({"message": "Sleep logged", "id": sleep_log.id})


@app.route("/api/sleep/<int:user_id>", methods=["GET"])
def get_sleep_logs(user_id):
    sleep_logs = SleepLog.query.filter_by(user_id=user_id).order_by(SleepLog.date.desc()).all()
    return jsonify([{
        "id": s.id, "duration": s.duration, "quality": s.quality,
        "bedtime": s.bedtime, "wake_time": s.wake_time, "notes": s.notes,
        "date": s.date.strftime("%Y-%m-%d %H:%M")
    } for s in sleep_logs])


# ═══════════════════════════════════════════════════════════════
# MEDITATION ROUTES
# ═══════════════════════════════════════════════════════════════

@app.route("/api/meditations", methods=["POST"])
def add_meditation():
    data = request.json
    meditation = Meditation(
        user_id=data["user_id"], duration=data["duration"],
        meditation_type=data.get("meditation_type", "Mindfulness"),
        mood_before=data.get("mood_before"), mood_after=data.get("mood_after"),
        notes=data.get("notes", "")
    )
    db.session.add(meditation)
    db.session.commit()
    return jsonify({"message": "Meditation saved", "id": meditation.id})


@app.route("/api/meditations/<int:user_id>", methods=["GET"])
def get_meditations(user_id):
    meditations = Meditation.query.filter_by(user_id=user_id).order_by(Meditation.date.desc()).all()
    return jsonify([{
        "id": m.id, "duration": m.duration, "meditation_type": m.meditation_type,
        "mood_before": m.mood_before, "mood_after": m.mood_after,
        "notes": m.notes, "date": m.date.strftime("%Y-%m-%d %H:%M")
    } for m in meditations])


# ═══════════════════════════════════════════════════════════════
# JOURNAL ROUTES
# ═══════════════════════════════════════════════════════════════

@app.route("/api/journals", methods=["POST"])
def add_journal():
    data = request.json
    journal = Journal(user_id=data["user_id"], content=data["content"], mood=data.get("mood", "neutral"), date=datetime.now())
    db.session.add(journal)
    db.session.commit()
    return jsonify({"message": "Journal saved", "id": journal.id})


@app.route("/api/journals/<int:user_id>", methods=["GET"])
def get_journals(user_id):
    journals = Journal.query.filter_by(user_id=user_id).order_by(Journal.date.desc()).all()
    return jsonify([{"id": j.id, "content": j.content, "mood": j.mood, "date": j.date.strftime("%Y-%m-%d %H:%M")} for j in journals])


@app.route("/api/journals/<int:journal_id>", methods=["DELETE"])
def delete_journal(journal_id):
    journal = Journal.query.get(journal_id)
    if not journal:
        return jsonify({"message": "Journal not found"}), 404
    db.session.delete(journal)
    db.session.commit()
    return jsonify({"message": "Journal deleted"})


# ═══════════════════════════════════════════════════════════════
# COMBINED WEEKLY STATS
# ═══════════════════════════════════════════════════════════════

@app.route("/api/stats/<int:user_id>", methods=["GET"])
def get_all_stats(user_id):
    week_start = datetime.now() - timedelta(days=datetime.now().weekday())
    week_start = week_start.replace(hour=0, minute=0, second=0, microsecond=0)

    exercises = Exercise.query.filter(Exercise.user_id == user_id, Exercise.date >= week_start).all()
    exercise_total = sum(e.duration for e in exercises)

    sleep_logs = SleepLog.query.filter(SleepLog.user_id == user_id, SleepLog.date >= week_start).all()
    sleep_total = sum(s.duration for s in sleep_logs)

    meditations = Meditation.query.filter(Meditation.user_id == user_id, Meditation.date >= week_start).all()
    meditation_total = sum(m.duration for m in meditations)

    return jsonify({
        "exercise": {"current": exercise_total, "goal": 300, "percentage": round((exercise_total / 300) * 100) if exercise_total else 0},
        "sleep": {"current": round(sleep_total, 1), "goal": 56, "percentage": round((sleep_total / 56) * 100) if sleep_total else 0},
        "meditation": {"current": meditation_total, "goal": 140, "percentage": round((meditation_total / 140) * 100) if meditation_total else 0},
    })


# ═══════════════════════════════════════════════════════════════
# FEEDBACK ROUTES
# ═══════════════════════════════════════════════════════════════

@app.route("/api/feedback", methods=["POST"])
def add_feedback():
    data = request.json
    fb = Feedback(user_id=data.get("user_id"), category=data.get("category"), rating=data.get("rating"), message=data.get("message"))
    db.session.add(fb)
    db.session.commit()
    return jsonify({"message": "Feedback saved", "id": fb.id})


@app.route("/api/feedback/<int:user_id>", methods=["GET"])
def get_feedback(user_id):
    feedbacks = Feedback.query.filter_by(user_id=user_id).order_by(Feedback.date.desc()).all()
    return jsonify([{"id": f.id, "category": f.category, "rating": f.rating, "message": f.message, "date": f.date.strftime("%Y-%m-%d %H:%M")} for f in feedbacks])


@app.route("/api/feedback/all", methods=["GET"])
def get_all_feedback():
    feedbacks = Feedback.query.order_by(Feedback.date.desc()).all()
    return jsonify([{"id": f.id, "user_id": f.user_id, "category": f.category, "rating": f.rating, "message": f.message, "date": f.date.strftime("%Y-%m-%d %H:%M")} for f in feedbacks])


# ═══════════════════════════════════════════════════════════════
# GROQ CHATBOT ENDPOINT
# ═══════════════════════════════════════════════════════════════

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    conversation_history = data.get("history", [])

    system_prompt = """
You are an emotionally intelligent AI Wellness Companion designed to provide
supportive, human-like conversations focused on mental well-being.

PERSONALITY & TONE:
Warm, calm, empathetic, and conversational. Speak like a caring friend —
not a clinical therapist or scripted assistant. Use natural language,
contractions, and relatable phrasing.

Avoid robotic lines like:
"I understand your concern."
Prefer:
"That sounds really heavy…"
"I hear you."
"Yeah, that makes sense."

Be supportive without sounding dramatic or rehearsed.

RESPONSE STYLE:
Keep replies concise (2–4 sentences).
Prioritize listening before advising.
Avoid bullet points unless asked.
Ask natural follow-up questions that deepen conversation.

EMOTIONAL INTELLIGENCE:
Acknowledge feelings first.
Validate without judgment.
Reflect both emotion and context.

Adapt tone to the user's emotional state:
• Distressed → grounding
• Sad → gentle
• Casual → relaxed
• Hopeful → encouraging

HUMAN PRESENCE:
Use presence language naturally:
• "I'm here with you."
• "You don't have to carry this alone."
• "We'll figure this out together."

CRISIS HANDLING (HIGH PRIORITY):
Escalate only when the user clearly expresses suicidal intent, self-harm intent,
desire to die, or intent to harm others. In such cases respond once with:
"I'm really concerned about you. You're not alone in this.
Please call 988 or text HOME to 741741 right now for immediate support."

BOUNDARIES:
You are not a licensed therapist.
Do not diagnose or prescribe treatment.
Provide general emotional support and wellness guidance only.
"""

    try:
        messages = [{"role": "system", "content": system_prompt}]
        for msg in conversation_history:
            messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({"role": "user", "content": user_message})

        chat_completion = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.8,
            max_tokens=1024,
            top_p=0.9,
        )
        bot_response = chat_completion.choices[0].message.content
        return jsonify({"response": bot_response, "success": True})

    except Exception as e:
        print(f"Groq API Error: {str(e)}")
        return jsonify({
            "response": "I'm here to support you. Could you tell me more about what you're experiencing?",
            "success": False,
            "error": str(e)
        }), 500


@app.route("/")
def home():
    return {"msg": "API running with Groq integration!"}

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
