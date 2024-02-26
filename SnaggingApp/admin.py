from django.contrib import admin

# Register your models here.
from .models import User, Pinpoint, Message, PDFFile, Level, Project

admin.site.register(User)
admin.site.register(Pinpoint)
admin.site.register(Message)
admin.site.register(PDFFile)
admin.site.register(Level)
admin.site.register(Project)