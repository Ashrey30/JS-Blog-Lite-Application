from flask import Flask, render_template, request, redirect, jsonify
import requests as rq
from flask_login import (LoginManager, current_user, login_required, login_user, logout_user)
from datetime import date
from flask_restful import Api
from api import Users_api, Posts_api, Followers_api
from model import db, Users, Posts, Followers
import os
from cache_config import make_cache
from celery_config import create_celery_inst
import celery_task


app = Flask(__name__)
app.config['SECRET_KEY'] = 'panda@193020'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///project_db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


login_manager = LoginManager(app)
login_manager.login_view = '/'

celery = create_celery_inst(app)
cache = make_cache(app)

UPLOAD_FOLDER = '/static/blog_posts/'
UPLOAD_PFP = '/static/profile_pics/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['UPLOAD_PFP'] = UPLOAD_PFP


db.init_app(app)
app.app_context().push()
db.create_all()


api = Api(app)
api.add_resource(Users_api, '/api/users', '/api/users/<string:username>')
api.add_resource(Posts_api, '/api/posts', '/api/posts/<string:by>', '/api/posts/<int:by>', '/api/posts/<string:delete>/<int:id>')
api.add_resource(Followers_api, '/api/followers', '/api/followers/<string:following>/<string:follower>')


def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@login_manager.user_loader
def load_user(username):
    return Users.query.filter_by(username = username).first()


@login_manager.unauthorized_handler
def unauthorized_callback():
    return redirect('/')


@app.route('/')
def mainpage():
    return render_template("index.html")


@app.route('/login', methods=['GET', 'POST'])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    data = rq.get(request.url_root+'api/users/'+username)
    if data.status_code == 200 and data.json().get("password") == password:
        okay = Users.query.filter_by(username = username).first()
        login_user(okay, remember=True)
        return jsonify({'message': 'Log-In Successful', "email": okay.email}), 200
    else:
        return jsonify({'message': 'Incorrect username or password'}), 404


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify('Logged out'), 200


@app.route('/register', methods=['GET', 'POST'])
@login_required
def register():
    email = request.json.get("email")
    username = request.json.get("username")
    password = request.json.get("password")
    

    data = rq.get(request.url_root+'api/users/'+username)
    if data.status_code == 200 and data.json().get("password") == password and data.json().get("email") == email:

        login_user(Users.query.filter_by(username = username).first(), remember=True)
        return jsonify({'message': 'User Registered Successfully'}), 200
    else:
        return jsonify({'message': 'Try a different Email ID or username'}), 404


@app.route('/follow/<string:following>', methods=['GET', 'POST'])
@login_required
def unfollow(following):
    fll = Followers.query.filter_by(following = following, follower = current_user.username).first()
    if fll is None:
        db.session.add(Followers(following = following, follower = current_user.username))
    else:
        db.session.delete(fll)
    db.session.commit()
    return jsonify({'message': 'completed'}), 200

@app.route('/export', methods=['GET', 'POST'])
@login_required
def export():
    print("exporting")
    celery_task.export.delay(current_user.username)
    return jsonify({'message':'exported'}), 200


if __name__ == "__main__":
    app.run(debug = True, host = '0.0.0.0')