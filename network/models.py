from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass
    def __str__(self):
        return f"{self.username}"

    def serialize(self):
        return {
            "name": self.username,
            "followers": [user.id for user in self.user_following.all()]
        }

# model for posts
class Post(models.Model):
    content = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, blank=True, related_name="user_posts", on_delete=models.CASCADE, default="default_user")
    like = models.ManyToManyField(User, blank=True, related_name="user_likes")

    def __str__(self):
        return f"{self.id}"
    
    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "user": self.user.id,
            "like": [user.id for user in self.like.all()]
        }
    
# model for followers
class Follower(models.Model):
    user = models.ForeignKey(User, blank=True, related_name="user_followers", on_delete=models.CASCADE, default="default_user")
    following = models.ManyToManyField(User, blank=True, related_name="user_following")
    
    def __str__(self):
        return f"{self.user}:{self.following.all()}"
    
    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.id,
            "following": [user.id for user in self.following.all()]
        }
    
