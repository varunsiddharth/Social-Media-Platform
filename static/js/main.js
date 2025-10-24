// Main JavaScript file for Social Media Platform

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeLikeButtons();
    initializeFollowButtons();
    initializeCommentForms();
    initializeImagePreview();
    initializeTooltips();
    initializeAlerts();
});

// Like functionality
function initializeLikeButtons() {
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.dataset.postId;
            const heartIcon = this.querySelector('i');
            const likesCount = this.querySelector('.likes-count');
            
            // Add loading state
            this.disabled = true;
            const originalText = likesCount.textContent;
            likesCount.innerHTML = '<span class="loading"></span>';
            
            fetch('/toggle-like/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({
                    post_id: postId
                })
            })
            .then(response => response.json())
            .then(data => {
                likesCount.textContent = data.likes_count;
                
                if (data.liked) {
                    heartIcon.classList.add('text-danger');
                    heartIcon.classList.add('fas');
                    heartIcon.classList.remove('far');
                } else {
                    heartIcon.classList.remove('text-danger');
                    heartIcon.classList.add('far');
                    heartIcon.classList.remove('fas');
                }
                
                // Add animation
                heartIcon.style.animation = 'heartbeat 0.6s ease-in-out';
                setTimeout(() => {
                    heartIcon.style.animation = '';
                }, 600);
            })
            .catch(error => {
                console.error('Error:', error);
                likesCount.textContent = originalText;
                showAlert('Error liking post. Please try again.', 'danger');
            })
            .finally(() => {
                this.disabled = false;
            });
        });
    });
}

// Follow functionality
function initializeFollowButtons() {
    const followButtons = document.querySelectorAll('.follow-btn');
    
    followButtons.forEach(button => {
        button.addEventListener('click', function() {
            const username = this.dataset.username;
            const followText = this.querySelector('.follow-text');
            const followersCount = document.getElementById('followers-count');
            const followingCount = document.getElementById('following-count');
            
            // Add loading state
            this.disabled = true;
            const originalText = followText.textContent;
            followText.textContent = 'Loading...';
            
            fetch('/toggle-follow/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({
                    username: username
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showAlert(data.error, 'danger');
                    return;
                }
                
                followText.textContent = data.following ? 'Unfollow' : 'Follow';
                
                if (followersCount) {
                    followersCount.textContent = data.followers_count;
                }
                if (followingCount) {
                    followingCount.textContent = data.following_count;
                }
                
                // Update button styling
                if (data.following) {
                    this.classList.remove('btn-primary');
                    this.classList.add('btn-outline-primary');
                } else {
                    this.classList.remove('btn-outline-primary');
                    this.classList.add('btn-primary');
                }
                
                // Add animation
                this.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            })
            .catch(error => {
                console.error('Error:', error);
                followText.textContent = originalText;
                showAlert('Error following user. Please try again.', 'danger');
            })
            .finally(() => {
                this.disabled = false;
            });
        });
    });
}

// Comment functionality
function initializeCommentForms() {
    const commentForms = document.querySelectorAll('#comment-form');
    
    commentForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const content = this.querySelector('#comment-content').value.trim();
            if (!content) return;
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Add loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="loading"></span> Commenting...';
            
            // Get post ID from URL or data attribute
            const postId = this.dataset.postId || getPostIdFromUrl();
            
            fetch('/add-comment/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({
                    post_id: postId,
                    content: content
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Clear the form
                    this.querySelector('#comment-content').value = '';
                    
                    // Add the new comment to the page
                    addCommentToPage(data);
                    
                    // Update comment count
                    updateCommentCount(postId);
                    
                    showAlert('Comment added successfully!', 'success');
                } else {
                    showAlert('Error adding comment. Please try again.', 'danger');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Error adding comment. Please try again.', 'danger');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            });
        });
    });
}

// Image preview functionality
function initializeImagePreview() {
    const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    
    imageInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Remove existing preview
                    const existingPreview = input.parentNode.querySelector('.image-preview');
                    if (existingPreview) {
                        existingPreview.remove();
                    }
                    
                    // Create new preview
                    const preview = document.createElement('img');
                    preview.src = e.target.result;
                    preview.className = 'image-preview';
                    preview.alt = 'Preview';
                    
                    input.parentNode.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });
    });
}

// Initialize Bootstrap tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize auto-dismiss alerts
function initializeAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
}

// Utility functions
function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

function getPostIdFromUrl() {
    const path = window.location.pathname;
    const matches = path.match(/\/post\/(\d+)\//);
    return matches ? matches[1] : null;
}

function addCommentToPage(commentData) {
    const commentsContainer = document.getElementById('comments-container');
    const emptyMessage = commentsContainer.querySelector('.text-center.text-muted');
    
    if (emptyMessage) {
        emptyMessage.remove();
    }
    
    const newComment = document.createElement('div');
    newComment.className = 'comment-item mb-3 p-3 border rounded fade-in';
    newComment.setAttribute('data-comment-id', commentData.comment_id);
    
    newComment.innerHTML = `
        <div class="d-flex align-items-center mb-2">
            <img src="${getCurrentUserProfilePicture()}" alt="Profile" class="rounded-circle me-2" width="30" height="30">
            <div>
                <h6 class="mb-0">
                    <a href="/profile/${commentData.author}/" class="text-decoration-none">
                        ${commentData.author}
                    </a>
                </h6>
                <small class="text-muted">${commentData.created_at}</small>
            </div>
        </div>
        <p class="mb-0">${escapeHtml(commentData.content)}</p>
        <div class="mt-2">
            <a href="/delete-comment/${commentData.comment_id}/" class="btn btn-outline-danger btn-sm" onclick="return confirm('Are you sure you want to delete this comment?')">
                <i class="fas fa-trash"></i>
            </a>
        </div>
    `;
    
    commentsContainer.insertBefore(newComment, commentsContainer.firstChild);
}

function updateCommentCount(postId) {
    const commentButtons = document.querySelectorAll(`[data-post-id="${postId}"] .btn-outline-secondary`);
    commentButtons.forEach(button => {
        const currentCount = parseInt(button.textContent.match(/\d+/)[0]);
        button.innerHTML = `<i class="fas fa-comment"></i> ${currentCount + 1}`;
    });
}

function getCurrentUserProfilePicture() {
    const profileImg = document.querySelector('.navbar .rounded-circle');
    return profileImg ? profileImg.src : '/media/profile_pics/default.jpg';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showAlert(message, type = 'info') {
    const alertContainer = document.querySelector('.container.mt-3') || document.querySelector('main.container');
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.insertBefore(alertDiv, alertContainer.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Add form validation to all forms
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        if (!validateForm(this)) {
            e.preventDefault();
            showAlert('Please fill in all required fields.', 'warning');
        }
    });
});

// Infinite scroll for posts (optional enhancement)
function initializeInfiniteScroll() {
    let loading = false;
    
    window.addEventListener('scroll', function() {
        if (loading) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollTop + windowHeight >= documentHeight - 100) {
            loading = true;
            loadMorePosts();
        }
    });
}

function loadMorePosts() {
    const nextPage = getCurrentPage() + 1;
    const url = new URL(window.location);
    url.searchParams.set('page', nextPage);
    
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newPosts = doc.querySelectorAll('.post-card');
            
            if (newPosts.length > 0) {
                const container = document.getElementById('posts-container');
                newPosts.forEach(post => {
                    container.appendChild(post);
                });
                
                // Re-initialize like buttons for new posts
                initializeLikeButtons();
            }
        })
        .catch(error => console.error('Error loading more posts:', error))
        .finally(() => {
            loading = false;
        });
}

function getCurrentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('page')) || 1;
}
