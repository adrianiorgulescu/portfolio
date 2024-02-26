from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

# User class: 
class User(AbstractUser):
    pass
    def __str__(self):
        return f"{self.username}"

# Class to save pinpoints on pdf files
class Pinpoint(models.Model):
    x_coordinate = models.FloatField()
    y_coordinate = models.FloatField()
    sender = models.ForeignKey("User", on_delete=models.PROTECT, related_name="user_snags") 
    recipients = models.ManyToManyField("User")
    photo = models.FileField(upload_to='image_files/')
    evidence = models.ImageField(upload_to='evidence_files/', blank=True, null=True, default='default.jpg')
    timestamp = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(auto_now=False)
    description = models.TextField()
    ready_for_inspection = models.BooleanField(default=False)
    resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.id}"
    
    def serialize(self):
        return {
            "id": self.id,
            "x_coordinate": self.x_coordinate,
            "y_coordinate": self.y_coordinate,
            "sender": self.sender.id,
            "recipients": [user.id for user in self.recipients.all()],
            "photo": self.photo.url,
            "evidence": self.evidence.url,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "due_date": self.due_date.strftime("%b %d %Y, %I:%M %p"),
            "description": self.description,
            "ready_for_inspection": self.ready_for_inspection,
            "resolved": self.resolved
        }

class Message(models.Model):
    sender = models.ForeignKey("User", on_delete=models.PROTECT, related_name="emails_sent")
    recipients = models.ManyToManyField("User", related_name="emails_received")
    subject = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)
    pinpoint = models.ForeignKey("Pinpoint", on_delete=models.PROTECT) 

    def serialize(self):
        return {
            "id": self.id,
            "sender": self.sender.email,
            "recipients": [user.email for user in self.recipients.all()],
            "subject": self.subject,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "read": self.read,
            "archived": self.archived
        }
    

#Class to save pdf files in database 
class PDFFile(models.Model):
    title = models.CharField(max_length=255)
    pdf_file = models.FileField(upload_to='pdf_files/')
    
    def __str__(self):
        return f"{self.id}"

# Project Level (or Area) class (levels are included within projects): 
class Level(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField()
    archived = models.BooleanField(default=False)
    file = models.ForeignKey(PDFFile, blank=True, on_delete=models.CASCADE, related_name="pdf_level")
    pinpoint = models.ManyToManyField("Pinpoint", blank=True, related_name="pinpoint_level") 

    def __str__(self):
        return f"{self.id}"
    
    def serialize(self):
        return {
            "pinpoint": [pinpoint.id for pinpoint in self.pinpoint.all()]
        }

# Project class (projects include levels): 
class Project(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField()
    archived = models.BooleanField(default=False)
    responsible = models.ManyToManyField("User", blank=True, related_name="UserProjectsResponsible")
    master = models.ManyToManyField("User", blank=True, related_name="UserProjectsMaster")
    level = models.ManyToManyField("Level", blank=True, related_name="level_project")

    def __str__(self):
        return f"{self.id}"