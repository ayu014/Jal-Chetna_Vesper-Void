// Global variables
let supabaseClient = null;

// Initialize Supabase client
function initializeSupabase() {
    const supabaseUrl = 'YOUR_SUPABASE_URL';
    const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
    
    // Check if supabase is available
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
        console.log('Supabase initialized successfully');
    } else {
        console.error('Supabase library not loaded');
    }
}

// Check if we're on the dashboard page and protect it
function protectDashboard() {
    if (window.location.pathname.includes('dashboard.html')) {
        const isLoggedIn = sessionStorage.getItem('isSuperAdminLoggedIn');
        if (isLoggedIn !== 'true') {
            console.log('User not authenticated, redirecting to index.html');
            window.location.replace('index.html');
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize Supabase
    initializeSupabase();
    
    // Protect dashboard if needed
    protectDashboard();
    
    // Set up event listeners based on current page
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Login page elements
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.getElementById('closeBtn');
    const loginForm = document.getElementById('loginForm');

    // Dashboard page elements
    const logoutBtn = document.getElementById('logoutBtn');
    const createUserForm = document.getElementById('createUserForm');

    // Login modal functionality
    if (loginBtn) {
        console.log('Setting up login button event listener');
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Login button clicked');
            showLoginModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Close button clicked');
            hideLoginModal();
        });
    }

    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                console.log('Modal overlay clicked');
                hideLoginModal();
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            handleLogin();
        });
    }

    // Dashboard functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Logout button clicked');
            handleLogout();
        });
    }

    if (createUserForm) {
        createUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Create user form submitted');
            handleCreateUser();
        });
    }

    // Keyboard events
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal && loginModal.classList.contains('show')) {
            hideLoginModal();
        }
    });
}

// Show login modal
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        console.log('Showing login modal');
        loginModal.classList.add('show');
        
        // Focus on username field
        setTimeout(() => {
            const usernameField = document.getElementById('username');
            if (usernameField) {
                usernameField.focus();
            }
        }, 100);
    }
}

// Hide login modal
function hideLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        console.log('Hiding login modal');
        loginModal.classList.remove('show');
        clearLoginForm();
    }
}

// Clear login form
function clearLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.reset();
    }
    
    if (loginError) {
        loginError.textContent = '';
    }
}

// Handle login
function handleLogin() {
    console.log('Handling login...');
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginError = document.getElementById('loginError');

    // Clear previous errors
    if (loginError) {
        loginError.textContent = '';
    }

    console.log('Username:', username);
    console.log('Password:', password ? '***' : 'empty');

    // Validate credentials
    if (username === 'superadmin' && password === 'admin') {
        console.log('Login successful');
        
        // Set session flag
        sessionStorage.setItem('isSuperAdminLoggedIn', 'true');
        
        // Show success message briefly
        if (loginError) {
            loginError.style.color = 'green';
            loginError.textContent = 'Login successful! Redirecting...';
        }
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } else {
        console.log('Login failed');
        
        // Show error message
        if (loginError) {
            loginError.textContent = 'Invalid username or password. Please try again.';
        }
        
        // Clear password field
        const passwordField = document.getElementById('password');
        if (passwordField) {
            passwordField.value = '';
            passwordField.focus();
        }
    }
}

// Handle logout
function handleLogout() {
    console.log('Handling logout...');
    sessionStorage.removeItem('isSuperAdminLoggedIn');
    window.location.replace('index.html');
}

// Handle create user
async function handleCreateUser() {
    console.log('Handling create user...');
    
    const formMessage = document.getElementById('formMessage');
    
    // Clear previous messages
    if (formMessage) {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }

    // Get form values
    const userData = {
        full_name: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone_number: document.getElementById('phoneNumber').value.trim(),
        assigned_location: document.getElementById('assignedLocation').value.trim(),
        designation: document.getElementById('designation').value,
        password: document.getElementById('userPassword').value.trim()
    };

    console.log('User data:', { ...userData, password: '***' });

    // Basic validation
    if (!userData.full_name || !userData.email || !userData.phone_number || 
        !userData.assigned_location || !userData.designation || !userData.password) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(userData.phone_number)) {
        showMessage('Please enter a valid phone number.', 'error');
        return;
    }

    // Show loading message
    showMessage('Creating user profile...', 'info');

    try {
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        // Insert user into Supabase
        const { data, error } = await supabaseClient
            .from('user_profiles')
            .insert([userData]);

        if (error) {
            console.error('Supabase error:', error);
            
            // Handle specific error cases
            if (error.code === '23505') {
                showMessage('Error: A user with this email already exists.', 'error');
            } else {
                showMessage(`Error: ${error.message}`, 'error');
            }
        } else {
            console.log('User created successfully:', data);
            showMessage('User profile created successfully!', 'success');
            clearUserForm();
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        
        // If Supabase is not configured, show demo message
        if (error.message.includes('Supabase client not initialized')) {
            showMessage('Demo Mode: User profile would be created (Supabase not configured)', 'success');
            clearUserForm();
        } else {
            showMessage('An unexpected error occurred. Please try again.', 'error');
        }
    }
}

// Show message function
function showMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        // Auto-clear success and info messages after 5 seconds
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
        }
    }
}

// Clear user form
function clearUserForm() {
    const form = document.getElementById('createUserForm');
    if (form) {
        form.reset();
    }
}

// Add some debugging
console.log('app.js loaded successfully');

// Test function to verify everything is working
function testButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    console.log('Login button found:', !!loginBtn);
    console.log('Logout button found:', !!logoutBtn);
    
    if (loginBtn) {
        console.log('Login button click listener count:', getEventListeners(loginBtn));
    }
}

// Run test after a short delay
setTimeout(testButtons, 1000);
