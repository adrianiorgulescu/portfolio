from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms

from .models import User, Listing, Bid, Comment, Category

class CreateForm(forms.Form):
    title = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Title'}))
    description = forms.CharField(label='', widget=forms.Textarea(attrs={'placeholder': 'Description'}))
    price = forms.DecimalField(label='Starting bid:',max_value=5000, min_value=0)
    url = forms.URLField(max_length=5000, required=False, label='Image URL', widget=forms.TextInput(attrs={'placeholder': 'Optional'}))
    category = forms.ModelChoiceField(required=False, label='Category:', queryset=Category.objects.all())

class CommentForm(forms.Form):
    title = forms.CharField(label='',max_length=30, widget=forms.TextInput(attrs={'placeholder': 'Title'}))
    text = forms.CharField(label='',max_length=200, widget=forms.Textarea(attrs={'placeholder': 'Comment'}))

def bid(request, user_name, auction_id):
    current_user = User.objects.get(username=user_name)
    user_id = current_user.id
    current_listing = Listing.objects.get(pk=auction_id)
    current_listing_start_price = current_listing.price
    current_bids = Bid.objects.filter(listing__id=auction_id)
    bid_values = [current_listing.price]
    for bid in current_bids: 
        BidVal = bid.bid
        bid_values.append(BidVal)
    max_bid = max(bid_values)
    current_watchlist = Listing.objects.filter(watchlist__id=user_id)
    comments = Comment.objects.filter(listing__id=auction_id)
    # the form: 
    class BidForm(forms.Form):
        bid = forms.DecimalField(label='Bid amount:',max_value=5000, min_value=max_bid+1)

    if request.method == "POST":
        form = BidForm(request.POST)
        if form.is_valid():
            obj = Bid(bid = form.cleaned_data["bid"], listing = current_listing, user=current_user)
            obj.save()
            current_bids = Bid.objects.filter(listing__id=auction_id)
            bid_values = [current_listing.price]
            for bid in current_bids: 
                BidVal = bid.bid
                bid_values.append(BidVal)
            max_bid = max(bid_values)
            return render(request, "auctions/Listing.html", {
            "listing": current_listing,
            "current_watchlist": current_watchlist, 
            "comments": comments,
            "max": max_bid
            })
        else:
            # If the form is invalid, re-render the page with existing information.
            return render(request, "auctions/bid.html", {
            "listing": current_listing,
            "start_price": current_listing_start_price, 
            "form": BidForm(),
            "max": max_bid
            })
    return render(request, "auctions/bid.html", {
    "listing": current_listing,
    "start_price": current_listing_start_price, 
    "form": BidForm(),
    "max": max_bid
    })

def categories(request):
    return render(request, "auctions/categories.html", {
        "categories": Category.objects.all()
    })

def category(request, category_id):
    category_name = Category.objects.get(id=category_id)
    category = Listing.objects.filter(category__id=category_id)
    return render(request, "auctions/category.html", {
        "category": category,
        "category_name": category_name 
    })

def watchlist(request, user_name):
    current_user = User.objects.get(username=user_name)
    user_id = current_user.id
    current_watchlist = Listing.objects.filter(watchlist__id=user_id)
    return render(request, "auctions/watchlist.html", {
        "current_watchlist": current_watchlist
    })

def listing(request, auction_id, user_name):
    if user_name == "not_signed_in":
        listing = Listing.objects.get(id=auction_id)
        listing_creator = listing.user
        comments = Comment.objects.filter(listing__id=auction_id)
        bids = Bid.objects.filter(listing__id=auction_id)
        bid_values = [listing.price]
        #get the maximum(winning) bid
        for bid in bids: 
            BidVal = bid.bid
            bid_values.append(BidVal)
        max_bid = max(bid_values)
        #Determine the winner of the bid (from max bid at end):
        try:
            winning_bid = Bid.objects.get(bid=max_bid, listing=listing)
        except Bid.DoesNotExist:
            winning_bid = None
            #render the page
            return render(request, "auctions/Listing.html", {
            "listing": listing,
            "comments": comments,
            "max": max_bid,
            "listing_creator": listing_creator,
            })
        # run code if try is successful 
        try:
            winner = winning_bid.user
        except winner == None:
            #render the page
            return render(request, "auctions/Listing.html", {
            "listing": listing,
            "comments": comments,
            "max": max_bid,
            "listing_creator": listing_creator,
            })
        #render the page
        return render(request, "auctions/Listing.html", {
        "listing": listing,
        "comments": comments,
        "max": max_bid,
        "listing_creator": listing_creator,
        "winner": winner,
        })
    else: 
        listing = Listing.objects.get(id=auction_id)
        current_user = User.objects.get(username=user_name)
        user_id = current_user.id
        listing_creator = listing.user
        current_watchlist = Listing.objects.filter(watchlist__id=user_id)
        comments = Comment.objects.filter(listing__id=auction_id)
        bids = Bid.objects.filter(listing__id=auction_id)
        bid_values = [listing.price]
        #get the maximum(winning) bid
        for bid in bids: 
            BidVal = bid.bid
            bid_values.append(BidVal)
        max_bid = max(bid_values)
        #Determine the winner of the bid (from max bid at end):
        try:
            winning_bid = Bid.objects.get(bid=max_bid, listing=listing)
        except Bid.DoesNotExist:
            winning_bid = None
            winner = "winner is None!"
            #render the page
            return render(request, "auctions/Listing.html", {
            "listing": listing,
            "current_watchlist": current_watchlist, 
            "comments": comments,
            "max": max_bid,
            "listing_creator": listing_creator,
            "winner": winner
            })
        # run code if try is successful 
        try:
            winner = winning_bid.user
        except winner == None:
            winner = "winner is None!"
            #render the page
            return render(request, "auctions/Listing.html", {
            "listing": listing,
            "current_watchlist": current_watchlist, 
            "comments": comments,
            "max": max_bid,
            "listing_creator": listing_creator,
            "winner": winner
            })
        #render the page
        return render(request, "auctions/Listing.html", {
        "listing": listing,
        "current_watchlist": current_watchlist, 
        "comments": comments,
        "max": max_bid,
        "listing_creator": listing_creator,
        "winner": winner,
        })

def listing_close_auction_btn(request, user_name, auction_id):
    listing = Listing.objects.get(id=auction_id)
    current_user = User.objects.get(username=user_name)
    user_id = current_user.id
    listing_creator = listing.user
    current_watchlist = Listing.objects.filter(watchlist__id=user_id)
    comments = Comment.objects.filter(listing__id=auction_id)
    bids = Bid.objects.filter(listing__id=auction_id)
    bid_values = [listing.price]
    for bid in bids: 
        BidVal = bid.bid
        bid_values.append(BidVal)
    max_bid = max(bid_values)
    listing.closed = True
    listing.save()

    #Determine the winner of the bid (from max bid at end):
   # winning_bid = bids.objects.filter
    winner = User.objects.filter(user_bids=max_bid, user_listings=listing)

    return render(request, "auctions/Listing.html", {
        "listing": listing,
        "current_watchlist": current_watchlist, 
        "comments": comments,
        "max": max_bid,
        "listing_creator": listing_creator,
        "winner": winner,
        "bids": bids
    })
# must add here a page for a listing that was closed. Maybe new page?

def listing_watchlist_add_btn(request, user_name, auction_id):
    current_user = User.objects.get(username=user_name)
    user_id = current_user.id
    current_watchlist = Listing.objects.filter(watchlist__id=user_id)
    current_listing = Listing.objects.get(pk=auction_id)
    current_listing.watchlist.add(current_user)
    return render(request, "auctions/watchlist.html", {
    "current_watchlist": current_watchlist
    })

def listing_watchlist_rm_btn(request, user_name, auction_id):
    current_user = User.objects.get(username=user_name)
    user_id = current_user.id
    current_watchlist = Listing.objects.filter(watchlist__id=user_id)
    current_listing = Listing.objects.get(pk=auction_id)
    current_listing.watchlist.remove(current_user)
    return render(request, "auctions/watchlist.html", {
    "current_watchlist": current_watchlist
    })

def listing_watchlist_add_comm_btn(request, user_name, auction_id):
    current_user = User.objects.get(username=user_name)
    user_id = current_user.id
    current_listing = Listing.objects.get(pk=auction_id)
    current_watchlist = Listing.objects.filter(watchlist__id=user_id)
    comments = Comment.objects.filter(listing__id=auction_id)
    bids = Bid.objects.filter(listing__id=auction_id)
    bid_values = [current_listing.price]
    #get the maximum(winning) bid
    for bid in bids: 
        BidVal = bid.bid
        bid_values.append(BidVal)
    max_bid = max(bid_values)
    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            obj = Comment(title = form.cleaned_data["title"], text = form.cleaned_data["text"], user=current_user, listing=current_listing)
            obj.save()
            return render(request, "auctions/Listing.html", {
            "listing": current_listing,
            "current_watchlist": current_watchlist, 
            "comments": comments,
            "max": max_bid
            }) 
        #must add more fileds here. Have a look at max bid and posted by (check the main listing view function). Same is avalialble for the rest of the functions rendering the listing page. review.
        else:
            # If the form is invalid, re-render the page with existing information.
            return render(request, "auctions/CreateListing.html", {
                "auctions": Listing.objects.all(),
                "form": CreateForm()
            })
    return render(request, "auctions/AddComment.html", {
    "listing": current_listing,
    "user": current_user ,
    "form": CommentForm()
    })

def index(request):
    return render(request, "auctions/index.html", {
        "auctions": Listing.objects.all()
    })

def create(request, user_name):
    current_user = User.objects.get(username=user_name)
    if request.method == "POST":
        form = CreateForm(request.POST)
        if form.is_valid():
            obj = Listing(title = form.cleaned_data["title"], description = form.cleaned_data["description"], price = form.cleaned_data["price"], url = form.cleaned_data["url"], category = form.cleaned_data["category"], user=current_user)
            obj.save()
            return render(request, "auctions/index.html", {
            "auctions": Listing.objects.all()
            })
        else:
            # If the form is invalid, re-render the page with existing information.
            return render(request, "auctions/CreateListing.html", {
                "auctions": Listing.objects.all(),
                "form": CreateForm()
            })
    return render(request, "auctions/CreateListing.html", {
        "auctions": Listing.objects.all(),
        "form": CreateForm()
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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
    