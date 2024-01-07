from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create/<str:user_name>", views.create, name="create"),
    path("categories", views.categories, name="categories"),
    path("watchlist/<str:user_name>", views.watchlist, name="watchlist"),
    path("listing/<int:auction_id>/<str:user_name>", views.listing, name="listing"),
    path("listing/<int:auction_id>/not_signed_in", views.listing, name="listing_user_not_signed_in"),
    path("listing_close_auction_btn/<str:user_name>/<int:auction_id>", views.listing_close_auction_btn, name="close_auction_btn"),
    path("listing_watchlist_add_btn/<str:user_name>/<int:auction_id>", views.listing_watchlist_add_btn, name="watchlist_add_btn"),
    path("listing_watchlist_add_comm_btn/<str:user_name>/<int:auction_id>", views.listing_watchlist_add_comm_btn, name="watchlist_add_comm_btn"),
    path("listing_watchlist_rm_btn/<str:user_name>/<int:auction_id>", views.listing_watchlist_rm_btn, name="watchlist_rm_btn"),
    path("category/<int:category_id>", views.category, name="category"),
    path("bid/<str:user_name>/<int:auction_id>", views.bid, name="bid"),
]
