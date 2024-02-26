from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("project/<int:project_id>", views.project, name="project"),
    path("level/<int:level_id>", views.level, name="level"),
    path("pinpoint/<int:level_id>", views.pinpoint, name="pinpoint"),
    path("pinpoint_update/<int:pinpoint_id>", views.pinpoint_update, name="pinpoint_update"),
    path("pinpoint_new", views.pinpoint_new, name="pinpoint_new"),
]

if settings.DEBUG:
    urlpatterns.extend(static(settings.STATIC_URL, document_root=settings.STATIC_ROOT))
    urlpatterns.extend(static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT))