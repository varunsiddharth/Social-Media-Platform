from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

from .models import Profile, Post, Comment, Like, Follow
from .forms import UserRegistrationForm, ProfileUpdateForm, UserUpdateForm, PostForm, CommentForm


def home(request):
    """Home page showing posts from followed users"""
    if request.user.is_authenticated:
        # Get posts from users that the current user follows
        following_users = Follow.objects.filter(follower=request.user).values_list('following', flat=True)
        posts = Post.objects.filter(author__in=following_users).order_by('-created_at')
        
        # If user doesn't follow anyone, show all posts
        if not following_users:
            posts = Post.objects.all().order_by('-created_at')
    else:
        posts = Post.objects.all().order_by('-created_at')
    
    # Pagination
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'posts': page_obj,
    }
    return render(request, 'socialmedia_app/home.html', context)


def register(request):
    """User registration view"""
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}!')
            login(request, user)
            return redirect('home')
    else:
        form = UserRegistrationForm()
    return render(request, 'socialmedia_app/register.html', {'form': form})


def user_login(request):
    """User login view"""
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        from django.contrib.auth import authenticate
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'socialmedia_app/login.html')


def user_logout(request):
    """User logout view"""
    logout(request)
    return redirect('login')


@login_required
def profile(request, username):
    """User profile view"""
    user = get_object_or_404(User, username=username)
    profile = get_object_or_404(Profile, user=user)
    posts = Post.objects.filter(author=user).order_by('-created_at')
    
    # Check if current user follows this profile
    is_following = False
    if request.user.is_authenticated and request.user != user:
        is_following = Follow.objects.filter(follower=request.user, following=user).exists()
    
    # Pagination for posts
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'profile_user': user,
        'profile': profile,
        'page_obj': page_obj,
        'posts': page_obj,
        'is_following': is_following,
    }
    return render(request, 'socialmedia_app/profile.html', context)


@login_required
def edit_profile(request):
    """Edit profile view"""
    if request.method == 'POST':
        user_form = UserUpdateForm(request.POST, instance=request.user)
        profile_form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile)
        
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, 'Your profile has been updated!')
            return redirect('profile', username=request.user.username)
    else:
        user_form = UserUpdateForm(instance=request.user)
        profile_form = ProfileUpdateForm(instance=request.user.profile)
    
    context = {
        'user_form': user_form,
        'profile_form': profile_form,
    }
    return render(request, 'socialmedia_app/edit_profile.html', context)


@login_required
def create_post(request):
    """Create new post view"""
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            messages.success(request, 'Post created successfully!')
            return redirect('home')
    else:
        form = PostForm()
    return render(request, 'socialmedia_app/create_post.html', {'form': form})


def post_detail(request, pk):
    """Post detail view with comments"""
    post = get_object_or_404(Post, pk=pk)
    comments = Comment.objects.filter(post=post).order_by('created_at')
    
    if request.method == 'POST' and request.user.is_authenticated:
        comment_form = CommentForm(request.POST)
        if comment_form.is_valid():
            comment = comment_form.save(commit=False)
            comment.post = post
            comment.author = request.user
            comment.save()
            return redirect('post_detail', pk=pk)
    else:
        comment_form = CommentForm()
    
    context = {
        'post': post,
        'comments': comments,
        'comment_form': comment_form,
    }
    return render(request, 'socialmedia_app/post_detail.html', context)


@login_required
def delete_post(request, pk):
    """Delete post view"""
    post = get_object_or_404(Post, pk=pk)
    if post.author == request.user:
        post.delete()
        messages.success(request, 'Post deleted successfully!')
    else:
        messages.error(request, 'You can only delete your own posts.')
    return redirect('home')


@login_required
def delete_comment(request, pk):
    """Delete comment view"""
    comment = get_object_or_404(Comment, pk=pk)
    if comment.author == request.user:
        post_pk = comment.post.pk
        comment.delete()
        messages.success(request, 'Comment deleted successfully!')
        return redirect('post_detail', pk=post_pk)
    else:
        messages.error(request, 'You can only delete your own comments.')
        return redirect('post_detail', pk=comment.post.pk)


@login_required
@require_POST
def toggle_like(request):
    """Toggle like on a post (AJAX)"""
    data = json.loads(request.body)
    post_id = data.get('post_id')
    post = get_object_or_404(Post, pk=post_id)
    
    like, created = Like.objects.get_or_create(post=post, user=request.user)
    
    if not created:
        like.delete()
        liked = False
    else:
        liked = True
    
    return JsonResponse({
        'liked': liked,
        'likes_count': post.likes.count()
    })


@login_required
@require_POST
def toggle_follow(request):
    """Toggle follow on a user (AJAX)"""
    data = json.loads(request.body)
    username = data.get('username')
    user = get_object_or_404(User, username=username)
    
    if user == request.user:
        return JsonResponse({'error': 'You cannot follow yourself'})
    
    follow, created = Follow.objects.get_or_create(follower=request.user, following=user)
    
    if not created:
        follow.delete()
        following = False
    else:
        following = True
    
    return JsonResponse({
        'following': following,
        'followers_count': user.profile.followers_count,
        'following_count': user.profile.following_count
    })


@login_required
@require_POST
def add_comment(request):
    """Add comment to a post (AJAX)"""
    data = json.loads(request.body)
    post_id = data.get('post_id')
    content = data.get('content')
    
    post = get_object_or_404(Post, pk=post_id)
    comment = Comment.objects.create(post=post, author=request.user, content=content)
    
    return JsonResponse({
        'success': True,
        'comment_id': comment.id,
        'author': comment.author.username,
        'content': comment.content,
        'created_at': comment.created_at.strftime('%B %d, %Y at %I:%M %p')
    })


def search_users(request):
    """Search for users"""
    query = request.GET.get('q')
    users = []
    
    if query:
        users = User.objects.filter(
            Q(username__icontains=query) | 
            Q(first_name__icontains=query) | 
            Q(last_name__icontains=query)
        ).exclude(id=request.user.id if request.user.is_authenticated else None)
    
    context = {
        'users': users,
        'query': query,
    }
    return render(request, 'socialmedia_app/search.html', context)
