import csv
import os
import datetime

from celery.schedules import crontab
from jinja2 import Template
from weasyprint import HTML

from mail_config import send_email
from app import celery, cache
from model import Users, Followers, Posts


@celery.on_after_finalize.connect
def setup_intervalTASK(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute=20, hour=18),
        #180,
        daily_rem.s(), name="Daily reminder"
    )

    sender.add_periodic_task(
        crontab(minute=20, hour=18, day_of_month=26),
        #180,
        monthly_report.s(), name="Monthly Report"
    )


@celery.task()
def daily_rem():
    users = Users.query.all()
    for user in users:
        blogcount = 0
        bloglist = Posts.query.filter_by(by=user.username).all()
        date = datetime.datetime.now().day
        for blog in bloglist: 
            day = blog.date.split("_")[2]
            if day == str(date):
                blogcount+=1
                print(blogcount)
        
        with open(r"templates/daily.html") as file:
            msg_template = Template(file.read())
        send_email(to=user.email, subject="Daily Reminder for BlogLite",
                   msg=msg_template.render(username=user.username, data = blogcount))
    return 'success'


@celery.task()
def monthly_report():
    users = Users.query.all()
    monthname = datetime.date.today().strftime("%B")
    d = datetime.date.today()
    month = f"{d:%m}"
    for user in users:
        username = user.username
        follower = Followers.query.filter_by(follower=user.username).count()
        following = Followers.query.filter_by(following=user.username).count()
        postsno = Posts.query.filter_by(by = user.username).count()
        posts = Posts.query.filter_by(by = user.username).all()
        monthpost=0

        for post in posts:
            print(post.date.split('_')[1], month)
            print(type(post.date.split('_')[1]), type(month))
            print(post.date.split('_')[1] == str(month))

            if post.date.split("_")[1] == str(month):
                monthpost +=1


        filepath = f"static/monthly/monthly_report_{user.username}_{month}.pdf"

        if not os.path.exists('static/monthly/'):
            os.mkdir(path='static/monthly/')

        with open(r"templates/monthly.html") as file:
            msg_template = Template(file.read())
        with open(r"templates/report.html") as file:
            pdf_template = Template(file.read())

        pdf_html = HTML(string=pdf_template.render(username = username, follower = follower, following = following, posts = postsno, monthpost = monthpost, month = monthname))
        pdf_html.write_pdf(target=filepath)

        send_email(to=user.email, subject="Monthly Report for BlogLite", attachment=filepath,
                   msg=msg_template.render(username=user.username))
    return 'success'

@celery.task
@cache.memoize(timeout=15)
def export(username):
    filepath = 'static/download/'+username+'data.csv'

    if not os.path.exists('static/download/'):
        os.mkdir(path='static/download/')
    with open(file=filepath, mode='w') as file:
        writer = csv.writer(file)
        writer.writerow(["Title", "Description", "Date"])
        for post in Posts.query.filter_by(by = username).all():
            writer.writerow([post.title, post.desc, post.date])
    
    with open(r"templates/mail.html") as file:
        msg_template = Template(file.read())

    email = Users.query.filter_by(username=username).first().email
    send_email(to=email, subject="CSV file for blog data ",
                msg=msg_template.render(), attachment=filepath)
   
    return 'sucess'