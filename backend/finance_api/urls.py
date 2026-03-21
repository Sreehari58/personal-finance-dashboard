from django.urls import path, include, re_path
from django.conf import settings
from django.views.generic import TemplateView
from django.views.static import serve
import os


def react_app_view(request, *args, **kwargs):
    """Serve React's index.html for all non-API routes (SPA catch-all)."""
    index = os.path.join(settings.REACT_BUILD_DIR, "index.html")
    return serve(request, "index.html", document_root=settings.REACT_BUILD_DIR)


urlpatterns = [
    path("api/", include("api.urls")),
    # Serve React static assets
    re_path(
        r"^(?!api/).*$",
        react_app_view,
    ),
]
