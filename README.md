# Social Media Platform

A complete mini social media web application built with Django featuring user profiles, posts, comments, likes, and follow system.

## Features

### User Management
- User registration and authentication
- Profile pages with bio and profile pictures
- Edit profile functionality
- User search functionality

### Posts
- Create, view, and delete posts
- Optional image upload with posts
- Posts feed with latest posts first
- Pagination for better performance

### Comments
- Add comments under posts
- View comments under each post
- Delete own comments
- Real-time comment updates with AJAX

### Social Features
- Like/unlike posts with AJAX
- Follow/unfollow other users
- Display followers & following count
- Feed shows posts from followed users

### Frontend
- Responsive design with Bootstrap 5
- AJAX/fetch API for likes, comments, and follows
- No page reload needed for interactions
- Modern UI with smooth animations

## Project Structure

```
socialmedia/
├── manage.py
├── requirements.txt
├── README.md
├── socialmedia/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── socialmedia_app/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── forms.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
├── templates/
│   └── socialmedia_app/
│       ├── base.html
│       ├── home.html
│       ├── login.html
│       ├── register.html
│       ├── profile.html
│       ├── edit_profile.html
│       ├── create_post.html
│       ├── post_detail.html
│       └── search.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
└── media/
    └── profile_pics/
        └── default.jpg
```

## Installation and Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Steps

1. **Clone or download the project**
   ```bash
   # If you have the project files, navigate to the project directory
   cd "Social Media Platform"
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Create media directories**
   ```bash
   mkdir media
   mkdir media/profile_pics
   mkdir media/post_images
   ```

7. **Add default profile picture**
   - Place a default profile picture at `media/profile_pics/default.jpg`
   - This will be used for users who haven't uploaded a profile picture

8. **Run the development server**
   ```bash
   python manage.py runserver
   ```

9. **Access the application**
   - Open your browser and go to `http://127.0.0.1:8000/`
   - Register a new account or login with the superuser account

## Usage

### Getting Started
1. **Register**: Create a new account by clicking "Register"
2. **Login**: Use your credentials to login
3. **Create Profile**: Upload a profile picture and add a bio
4. **Create Posts**: Share your thoughts and images
5. **Follow Users**: Find and follow other users
6. **Interact**: Like posts and add comments

### Features Overview

#### Home Feed
- View posts from users you follow
- If you don't follow anyone, see all posts
- Like posts and view comments
- Create new posts from the home page

#### Profile Pages
- View user information and posts
- Follow/unfollow users
- See followers and following counts
- Edit your own profile

#### Post Details
- View full post with all comments
- Add comments in real-time
- Like/unlike posts
- Delete your own posts/comments

#### Search
- Search for users by username, first name, or last name
- View user profiles from search results

## Database Models

### User (Django built-in)
- username, email, first_name, last_name
- password (hashed)

### Profile
- user (OneToOne with User)
- bio (Text)
- profile_picture (Image)
- created_at, updated_at

### Post
- author (ForeignKey to User)
- content (Text)
- image (Image, optional)
- created_at, updated_at

### Comment
- post (ForeignKey to Post)
- author (ForeignKey to User)
- content (Text)
- created_at, updated_at

### Like
- post (ForeignKey to Post)
- user (ForeignKey to User)
- created_at
- Unique constraint on (post, user)

### Follow
- follower (ForeignKey to User)
- following (ForeignKey to User)
- created_at
- Unique constraint on (follower, following)

## API Endpoints

### AJAX Endpoints
- `POST /toggle-like/` - Toggle like on a post
- `POST /toggle-follow/` - Toggle follow on a user
- `POST /add-comment/` - Add a comment to a post

### Regular Endpoints
- `/` - Home feed
- `/register/` - User registration
- `/login/` - User login
- `/logout/` - User logout
- `/profile/<username>/` - User profile
- `/edit-profile/` - Edit profile
- `/create-post/` - Create new post
- `/post/<id>/` - Post detail
- `/search/` - Search users

## Customization

### Styling
- Modify `static/css/style.css` for custom styling
- Bootstrap 5 classes are used throughout
- Responsive design for mobile devices

### Functionality
- Add new features by extending models in `models.py`
- Create new views in `views.py`
- Add URL patterns in `urls.py`
- Create templates in `templates/socialmedia_app/`

### Settings
- Modify `socialmedia/settings.py` for configuration
- Change database settings for production
- Update media and static file settings

## Production Deployment

### Security Considerations
1. Change `SECRET_KEY` in settings.py
2. Set `DEBUG = False`
3. Update `ALLOWED_HOSTS`
4. Use environment variables for sensitive data
5. Use HTTPS in production

### Database
- Consider using PostgreSQL for production
- Set up proper database backups
- Use database connection pooling

### Static Files
- Run `python manage.py collectstatic`
- Serve static files with a web server (nginx, Apache)
- Use CDN for better performance

### Media Files
- Use cloud storage (AWS S3, Google Cloud Storage)
- Set up proper file upload limits
- Implement image optimization

## Troubleshooting

### Common Issues

1. **Media files not loading**
   - Check `MEDIA_URL` and `MEDIA_ROOT` in settings
   - Ensure media directory exists
   - Check file permissions

2. **Static files not loading**
   - Run `python manage.py collectstatic`
   - Check `STATIC_URL` and `STATICFILES_DIRS`
   - Ensure static directory exists

3. **Database errors**
   - Run `python manage.py makemigrations`
   - Run `python manage.py migrate`
   - Check database permissions

4. **AJAX requests failing**
   - Check CSRF token in requests
   - Verify JavaScript console for errors
   - Check network tab in browser dev tools

### Debug Mode
- Set `DEBUG = True` in settings.py for detailed error messages
- Check Django logs for server errors
- Use browser developer tools for client-side debugging

## Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support and questions:
- Check the troubleshooting section
- Review Django documentation
- Create an issue in the project repository

---

**Happy coding! 🚀**
