from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:name>", views.entry, name="page"),
    path("New", views.new, name="new"),
    path("wiki/edit/<str:entry>", views.edit, name="edit"),
    path("random", views.whatever, name="random")
]
