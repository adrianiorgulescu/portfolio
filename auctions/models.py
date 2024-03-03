from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

# model for user categories
class Category(models.Model):
    category = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.category}"

# model for auctions
class Listing(models.Model):
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=300)
    price = models.IntegerField()
    url = models.TextField()
    category = models.ForeignKey(Category, blank=True, related_name="category_listings", on_delete=models.PROTECT)
    user = models.ForeignKey(User, blank=True, related_name="user_listings", on_delete=models.CASCADE, default="default_user")
    watchlist = models.ManyToManyField(User, blank=True, related_name="user_watchlist")
    closed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.id}"

# model for bids
class Bid(models.Model):
    bid = models.IntegerField()
    listing = models.ForeignKey(Listing, blank=True, related_name="listing_bids", on_delete=models.CASCADE, default="default_listing")
    user = models.ForeignKey(User, blank=True, related_name="user_bids", on_delete=models.CASCADE,  default="default_user")

    def __str__(self):
        return f"{self.bid}"

# model for comments
class Comment(models.Model):
    title = models.CharField(max_length=30)
    text = models.CharField(max_length=200)
    user = models.ForeignKey(User, blank=True, related_name="user_comments", on_delete=models.CASCADE, default="default_user")
    listing = models.ForeignKey(Listing, blank=True, related_name="listing_comments", on_delete=models.CASCADE, default="default_listing")
    
    def __str__(self):
        return f"{self.id}: {self.title}/{self.text}"
        