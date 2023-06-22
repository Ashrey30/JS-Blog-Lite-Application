To run the blog lite application, type the following in the WSL terminal:

python3 app.py
~/go/bin/MailHog
redis-server
celery -A celery_task.celery worker -l info -B