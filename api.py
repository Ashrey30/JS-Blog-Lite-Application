from datetime import datetime
from flask import request
from flask_restful import Resource, fields, marshal_with
from model import db, Users, Posts, Followers
import os

UPLOAD_PFP = '/static/profile_pics/'
UPLOAD_FOLDER = '/static/blog_posts/'


class Users_api(Resource):
    '''Api code for User_Details table'''

    output = {"username": fields.String, 
              "email": fields.String,
              "password": fields.String,
              "pfpname": fields.String}
    
    @marshal_with(output)
    def get(self, username: str):
        if username != 'None':
            obj = Users.query.filter_by(username = username).first()
            if obj != None:
                return obj, 200
        else:
            obj = Users.query.all()
            return obj, 200
        return obj, 201
    
    @marshal_with(output)
    def put(self):
        data = request.get_json()
        print(data)
        obj = Users.query.filter_by(username = data.get("username")).first()
        print(obj)
        obj.email = data.get('email')
        obj.password = data.get('password')
        db.session.commit()
        return obj, 202
    
    @marshal_with(output)
    def post(self):
        data = request.form
        pfp = request.files.get("pfp")
        okay = pfp.filename
        pfpname = data.get("username") + okay
        basedir = os.path.abspath(os.path.dirname(__file__))
        pfp.save(basedir + UPLOAD_PFP + pfpname)
        
        obj = Users(username = data.get("username"),
                    email =  data.get("email"),
                    password = data.get("password"),
                    pfpname = pfpname)
        
        # Checking whether a user record with same username is present
        if Users.query.filter_by(username = obj.username).first():
            return 404

        db.session.add(obj)
        db.session.commit()
        return obj, 201
    
    def delete(self, username: str):
        basedir = os.path.abspath(os.path.dirname(__file__))
        obj = Users.query.filter_by(username = username).first()
        for i in obj.user_by:
            os.remove(basedir + UPLOAD_FOLDER + i.filename)
        os.remove(basedir + UPLOAD_PFP + obj.pfpname)

        db.session.delete(obj)
        db.session.commit()
        return '', 200
    

class Posts_api(Resource):
    '''Api code for Posts table'''

    output = {"id": fields.Integer, 
              "filename": fields.String,
              "by": fields.String, 
              "title": fields.String,
              "desc": fields.String,
              "date": fields.String, }
    
    @marshal_with(output)
    def get(self, by):
        if(type(by) == str):
            posts = Posts.query.filter_by(by = by).all()
            for post in posts:
                post.date = datetime.strptime(post.date,"%Y_%m_%d_%H_%M_%S").strftime("%b %d, %Y %I:%M %p")

            if posts is None:
                return posts, 404

            return posts, 200
        else:
            obj = Posts.query.filter_by(id = by).first()
            if obj is None:
                return obj, 404
            return obj, 200
    
    @marshal_with(output)
    def put(self):
        data = request.get_json()
        obj = Posts.query.filter_by(id = int(data.get("id"))).first()
        obj.title = data.get('title')
        obj.desc = data.get('desc')
        db.session.commit()
        return obj, 201
    
    @marshal_with(output)
    def post(self):
        data = request.form
        b_date = datetime.now().strftime("%Y_%m_%d_%H_%M_%S")
        
        file = request.files.get("file")
        okay = file.filename
        filename = str(data.get("by")) + str(b_date) + str(okay)
        basedir = os.path.abspath(os.path.dirname(__file__))
        file.save(basedir + UPLOAD_FOLDER + filename)
        
        obj = Posts(by = data.get("by"),
                    title = data.get("title"),
                    desc = data.get("desc"),
                    filename = filename,
                    date = b_date)
           
        db.session.add(obj)
        db.session.commit()
        return obj , 201
    
    def delete(self, delete, id):
        obj = Posts.query.filter_by(id = int(id)).first()
        db.session.delete(obj)
        db.session.commit()
        return 201


class Followers_api(Resource):
    '''Api code for Folowers table'''

    output = {"follow_id": fields.Integer, 
              "follower": fields.String,
              "following": fields.String }
    
    @marshal_with(output)
    def post(self, following, follower):
        obj = Followers(
            follower = follower,
            following = following
        )
        check = Followers.query.filter_by(following = obj.following, follower = obj.follower).first()
        if check is None or (check.following == None and check.follower == None):
            db.session.add(obj)
        else:
            db.session.delete(check)
        db.session.commit()
        return obj, 201

    @marshal_with(output)
    def get(self, following, follower):
        if following != 'None':
            check = Followers.query.filter_by(following = following).all()
        else:
            check = Followers.query.filter_by(follower = follower).all()
        return check , 201