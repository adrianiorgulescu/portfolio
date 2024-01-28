from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
import json

from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from django.core.paginator import Paginator

from .models import User, Post, Follower

class NewPostForm(forms.Form):
    content = forms.CharField(label='',max_length=500, widget=forms.Textarea(attrs={'placeholder': '', 'class': 'form-control', 'id':'post-body', 'rows': '2'}))
    user = forms.CharField(widget = forms.HiddenInput(), required = False)

def index(request):
    if request.method == "POST":
        form = NewPostForm(request.POST)
        if form.is_valid():
            #get the name of the user from the form
            user_name = form.cleaned_data["user"]
            #transform the user_name into an User object
            current_user = User.objects.get(username=user_name)
            #create a Post object using the form data
            obj = Post(content = form.cleaned_data["content"], user = current_user)
            obj.save()
            posts = Post.objects.all().order_by("timestamp").reverse()
            paginator = Paginator(posts, 10) # show 10 posts per page
            page_number = request.GET.get('page')
            page_obj = paginator.get_page(page_number)
            return render(request, "network/index.html", {
            "form": NewPostForm(),
            "page_obj": page_obj
            })
        else:
            # If the form is invalid, re-render the page with existing information.
            posts = Post.objects.all().order_by("timestamp").reverse()
            paginator = Paginator(posts, 10) # show 10 posts per page
            page_number = request.GET.get('page')
            page_obj = paginator.get_page(page_number)
            return render(request, "network/index.html", {
            "form": NewPostForm(),
            "page_obj": page_obj
            })
    #else, if method is GET render the normal index page:
    posts = Post.objects.all().order_by("timestamp").reverse()
    paginator = Paginator(posts, 10) # show 10 posts per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "network/index.html", {
        "form": NewPostForm(),
        "page_obj": page_obj
    })


def following(request, user_id):
    sample_instance = Follower.objects.get(pk=user_id)
    people_followed = sample_instance.following.all()
    followed_id_list = []
    for person in people_followed:
        person_id = person.id
        followed_id_list.append(person_id)
    posts = Post.objects.filter(user__in=followed_id_list)
    posts = posts.order_by("timestamp").reverse()

    paginator = Paginator(posts, 10) # show 10 posts per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    if request.method == "POST":
        form = NewPostForm(request.POST)
        if form.is_valid():
            #get the name of the user from the form
            user_name = form.cleaned_data["user"]
            #transform the user_name into an User object
            current_user = User.objects.get(username=user_name)
            #create a Post object using the form data
            obj = Post(content = form.cleaned_data["content"], user = current_user)
            obj.save()
            return render(request, "network/following.html", {
            "page_obj": page_obj,
            "form": NewPostForm()
            })
        else:
            # If the form is invalid, re-render the page with existing information.
            return render(request, "network/following.html", {
            "page_obj": page_obj,
            "form": NewPostForm(),
            })
    #else, if method is GET render the normal index page:
    
    return render(request, "network/following.html", {
        "page_obj": page_obj,
        "form": NewPostForm(),
        "following": people_followed,
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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            #initialize the follower model also:
            follower = Follower.objects.create(user = user)
            follower.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    
def new_post(request):
    return render(request, "network/index.html")

def profile(request, user_id):
    current_user = User.objects.get(pk=user_id)
    number_of_followers = current_user.user_following.all()
    sample_instance = Follower.objects.get(pk=user_id)
    people_followed = sample_instance.following.all()

    posts = Post.objects.filter(user=current_user)
    posts = posts.order_by("timestamp").reverse()

    paginator = Paginator(posts, 10) # show 10 posts per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, "network/profile.html", {
        "page_obj": page_obj,
        "current_user": current_user,
        "number_of_followers": number_of_followers,
        "number_following": people_followed
    })



@login_required
def post(request, post_id):

    # Query for requested post
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    # Return post contents
    if request.method == "GET":
        return JsonResponse(post.serialize())

    # Update post when edited
    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("content") is not None:
            post.content = data["content"]
        if data.get("like") is not None:
            current_user = User.objects.get(pk=data["like"])
            if current_user in post.like.all():
                post.like.remove(User.objects.get(id=current_user.id))
            else: 
                post.like.add(User.objects.get(id=current_user.id))
        post.save()
        return HttpResponse(status=204)
    
    # post must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)
    
@login_required
def follower(request, user_id):

    # Query for requested user
    try:
        current_model = Follower.objects.get(user=user_id)
    except Follower.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)

    # Return user_follower contents
    if request.method == "GET":
        return JsonResponse(current_model.serialize())

    # Update user_followers when edited
    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("following") is not None:
            followed_user = User.objects.get(pk=data["following"])
            if followed_user in current_model.following.all():
                current_model.following.remove(followed_user)
            else: 
                current_model.following.add(followed_user)
        current_model.save()
        return HttpResponse(status=204)
    
    # post must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

@login_required
def user_followers(request, user_id):

    # Query for requested user
    try:
        current_user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)

    # Return user_followers contents
    if request.method == "GET":
        return JsonResponse(current_user.serialize())

    # post must be via GET
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)
