from django.urls import path
from . import views

urlpatterns = [
    # Authentication URLs
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    
    # Profile URLs
    path('profile/<str:username>/', views.profile, name='profile'),
    path('edit-profile/', views.edit_profile, name='edit_profile'),
    
    # Post URLs
    path('create-post/', views.create_post, name='create_post'),
    path('post/<int:pk>/', views.post_detail, name='post_detail'),
    path('delete-post/<int:pk>/', views.delete_post, name='delete_post'),
    
    # Comment URLs
    path('delete-comment/<int:pk>/', views.delete_comment, name='delete_comment'),
    
    # AJAX URLs
    path('toggle-like/', views.toggle_like, name='toggle_like'),
    path('toggle-follow/', views.toggle_follow, name='toggle_follow'),
    path('add-comment/', views.add_comment, name='add_comment'),
    
    # Search URL
    path('search/', views.search_users, name='search'),
]
