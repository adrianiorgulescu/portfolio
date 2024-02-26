from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
#from django import forms

#from reportlab.pdfgen import canvas

from django.contrib.auth.decorators import login_required
#from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse

from .models import User, Pinpoint, Level, Project

import base64
from django.core.files.base import ContentFile


def index(request):
    if request.user.is_authenticated:
        current_user = request.user
        projects = Project.objects.filter(master=current_user) | Project.objects.filter(responsible=current_user)
        projects = projects.distinct()
        return render(request, "SnaggingApp/index.html", {
            "projects": projects,
            "current_user": current_user,
            })
    else:
        return render(request, "SnaggingApp/index.html", {})

def project(request, project_id):
    current_project = Project.objects.get(pk=project_id)
    levels = current_project.level.all()
    return render(request, "SnaggingApp/project.html", {

        "current_project": current_project,
        "levels": levels,
    })

def level(request, level_id):
    current_level = Level.objects.get(pk=level_id)
    current_project = current_level.level_project.all().first()
    pdf_instance = current_level.file
    file_path = pdf_instance.pdf_file.path
    file_address = file_path
    file_url = pdf_instance.pdf_file.url
    pinpoints = current_level.pinpoint.all()
    masters = current_project.master.all()
    responsible = current_project.responsible.all()
    current_user = request.user

    return render(request, "SnaggingApp/level.html", {

        'current_level': current_level,
        'current_project': current_project,
        'file_path': file_address,
        'file_url': file_url,
        'pinpoints': pinpoints,
        'masters': masters,
        'responsible': responsible,
        'current_user' : current_user,
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "SnaggingApp/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "SnaggingApp/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "SnaggingApp/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "SnaggingApp/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "SnaggingApp/register.html")


# IS THIS DOING ANYTHIG?
#HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH  
@login_required
def pinpoint(request, level_id):

    # Query for requested post
    try:
        level = Level.objects.get(pk=level_id)
    except Level.DoesNotExist:
        return JsonResponse({"error": "Level not found."}, status=404)

    # Return Level contents
    if request.method == "GET":
        return JsonResponse(level.serialize())
    
    # Update pinpoint when edited
    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("mark_complete") is not None:
            pinpoint.resolved = data["mark_complete"]
        if data.get("ready_for_inspection") is not None:
            pinpoint.ready_for_inspection = data["ready_for_inspection"]
        if data.get("upload_evidence") is not None:
            pinpoint.photo = data["upload_evidence"]      
        pinpoint.save()
        return HttpResponse(status=204)

    # post must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)
#HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH  

@login_required
def pinpoint_update(request, pinpoint_id):

    # Query for requested post
    try:
        pinpoint = Pinpoint.objects.get(pk=pinpoint_id)
    except Pinpoint.DoesNotExist:
        return JsonResponse({"error": "Pinpoint not found."}, status=404)

    # Return Level contents
    if request.method == "GET":
        return JsonResponse(pinpoint.serialize())
    
    # Update pinpoint when edited
    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("mark_complete") is not None:
            pinpoint.resolved = data["mark_complete"]
        if data.get("ready_for_inspection") is not None:
            pinpoint.ready_for_inspection = data["ready_for_inspection"]
        if data.get("upload_evidence") is not None:
            pinpoint.photo = data["upload_evidence"]      
        pinpoint.save()
        return HttpResponse(status=204)
    
    elif request.method == 'POST':
        try:
            image_data = request.POST.get('evidence', '')
            ready_for_inspection = request.POST.get('ready_for_inspection', '')

            # Split the data URL to get the format and the actual data
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[-1]

            # Decode the base64 data
            data = ContentFile(base64.b64decode(imgstr), name=f'{pinpoint.id}.{ext}')

            # Update the image field of the existing instance
            pinpoint.evidence.save(f'image_{pinpoint.id}.{ext}', data, save=True)

            return JsonResponse({'message': 'Image uploaded successfully'})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    # post must be via GET, PUT or POST
    else:
        return JsonResponse({
            "error": "GET, PUT or POST request required."
        }, status=400)

@login_required
def pinpoint_new(request):
     #adding new pinpoint must be via post
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    try:
        # Get data from request.POST and request.FILES 
        photo = request.POST.get('image', '')

        x_coordinate = request.POST.get('x_coordinate')
        y_coordinate = request.POST.get('y_coordinate')
        sender = request.POST.get('sender_id')
        recipients = request.POST.get('recipient_id')  
        due_date = request.POST.get('due_date')  
        description = request.POST.get('description') 

        current_level_id = request.POST.get('current_level_id') 
        # update references:
        sender_object = User.objects.get(pk=sender) 
        recipient_object = User.objects.get(pk=recipients) 

        # Create a new instance of YourModel
        instance = Pinpoint(
            x_coordinate=x_coordinate,
            y_coordinate=y_coordinate,
            sender=sender_object,
            due_date=due_date,
            description=description
            )

        instance.save()

        if recipients:
            instance.recipients.add(recipient_object)
            instance.save()

        if photo:
            # Split the data URL to get the format and the actual data
            format, imgstr = photo.split(';base64,')
            ext = format.split('/')[-1]

            # Decode the base64 data
            data = ContentFile(base64.b64decode(imgstr), name=f'{instance.id}.{ext}')

            # Add image to the instance
            instance.photo = data
            instance.save()

        #Add the pinpoint to the level:
        # Query for requested level
        if current_level_id:
            level = Level.objects.get(pk=current_level_id)
            print(level)
            level.pinpoint.add(instance)
            level.save()
        
        return JsonResponse({'message': 'Data uploaded successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
     
