// ==========================================
// 🔧 SUPABASE CONFIGURATION
// ==========================================
// Replace with your actual Supabase credentials
// This is for JavaScript web applications
const SUPABASE_URL = 'https://hihobitpqkbxkefvpgbk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpaG9iaXRwcWtieGtlZnZwZ2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNDk3MjQsImV4cCI6MjA3MzYyNTcyNH0.1_fLA-mq4McZgW3IzyDdbe6tVjdi80TKslyjMF02DBE';

// Initialize Supabase client
let supabaseClient = null;

function initializeSupabase() {
    try {
        if (typeof supabase !== 'undefined') {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase initialized successfully');
            testDatabaseConnection();
        } else {
            console.error('❌ Supabase library not loaded');
        }
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
    }
}

// Test database connection
async function testDatabaseConnection() {
    try {
        const { data, error } = await supabaseClient
            .from('admin_login_details')
            .select('count', { count: 'exact' });
        
        if (error) throw error;
        console.log('✅ Database connected! Current records:', data || 0);
    } catch (error) {
        console.error('❌ Database connection test failed:', error.message);
        if (error.message.includes('relation "user_profiles" does not exist')) {
            console.warn('⚠️ Please create the user_profiles table in Supabase');
        }
    }
}

// ==========================================
// 🔐 AUTHENTICATION & PAGE PROTECTION
// ==========================================
function protectDashboard() {
    if (window.location.pathname.includes('dashboard.html')) {
        const isLoggedIn = sessionStorage.getItem('isSuperAdminLoggedIn');
        if (isLoggedIn !== 'true') {
            console.log('🚫 User not authenticated, redirecting...');
            window.location.replace('index.html');
        }
    }
}

// ==========================================
// 🎯 MAIN APPLICATION INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Jal Chetna Admin Dashboard starting...');
    
    // Initialize Supabase
    initializeSupabase();
    
    // Protect dashboard page
    protectDashboard();
    
    // Setup all event listeners
    setupEventListeners();
});

// ==========================================
// 📝 EVENT LISTENERS SETUP
// ==========================================
function setupEventListeners() {
    // Login page elements
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.getElementById('closeBtn');
    const loginForm = document.getElementById('loginForm');

    // Dashboard page elements
    const logoutBtn = document.getElementById('logoutBtn');
    const createUserForm = document.getElementById('createUserForm');

    // Login functionality
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideLoginModal();
        });
    }

    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                hideLoginModal();
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Dashboard functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    if (createUserForm) {
        createUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCreateUser(); // 🎯 This saves to database
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal && loginModal.classList.contains('show')) {
            hideLoginModal();
        }
    });
}

// ==========================================
// 🔑 LOGIN/LOGOUT FUNCTIONS
// ==========================================
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.add('show');
        setTimeout(() => {
            const usernameField = document.getElementById('username');
            if (usernameField) usernameField.focus();
        }, 100);
    }
}

function hideLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.remove('show');
        clearLoginForm();
    }
}

function clearLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (loginForm) loginForm.reset();
    if (loginError) loginError.textContent = '';
}

function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginError = document.getElementById('loginError');

    if (loginError) loginError.textContent = '';

    if (username === 'superadmin' && password === 'admin') {
        sessionStorage.setItem('isSuperAdminLoggedIn', 'true');
        
        if (loginError) {
            loginError.style.color = 'green';
            loginError.textContent = 'Login successful! Redirecting...';
        }
        
        setTimeout(() => {
            hideLoginModal();
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } else {
        if (loginError) {
            loginError.textContent = 'Invalid username or password. Please try again.';
        }
        
        const passwordField = document.getElementById('password');
        if (passwordField) {
            passwordField.value = '';
            passwordField.focus();
        }
    }
}

function handleLogout() {
    sessionStorage.removeItem('isSuperAdminLoggedIn');
    window.location.replace('index.html');
}

// ==========================================
// 💾 DATABASE SAVE FUNCTION - MAIN FEATURE
// ==========================================
async function handleCreateUser() {
    console.log('📝 Starting user creation process...');
    
    const formMessage = document.getElementById('formMessage');
    
    // Clear previous messages
    if (formMessage) {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }

    // Collect form data matching your database schema
    const userData = {
        first_name: document.getElementById('firstName').value.trim(),
        last_name: document.getElementById('lastName').value.trim(),
        username: document.getElementById('userUsername').value.trim(),
        password: document.getElementById('userPassword').value.trim(),
        designation: document.getElementById('designation').value
    };

    console.log('📋 Form data collected:', { ...userData, password: '[HIDDEN]' });

    // Client-side validation
    if (!validateUserData(userData)) {
        return; // Validation errors already shown
    }

    // Show loading state
    showMessage('Creating user profile...', 'info');

    try {
        // Check if Supabase is properly initialized
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized. Please check your configuration.');
        }

        // 🚀 SAVE TO DATABASE - This is where the magic happens
        const { data, error } = await supabaseClient
            .from('admin_login_details')
            .insert([userData])
            .select(); // Returns the inserted data

        if (error) {
            console.error('❌ Database error:', error);
            handleDatabaseError(error);
        } else {
            console.log('✅ User created successfully:', data);
            
            // Show success message with user ID
            const newUserId = data[0]?.id || 'Unknown';
            showMessage(`✅ Success! User "${userData.username}" created with ID: ${newUserId}`, 'success');
            
            // Clear the form
            clearUserForm();
            
            // Log success for debugging
            console.log('💾 Data successfully saved to database:', data[0]);
        }

    } catch (error) {
        console.error('❌ Unexpected error during user creation:', error);
        
        if (error.message.includes('fetch')) {
            showMessage('❌ Network Error: Please check your internet connection and Supabase configuration.', 'error');
        } else if (error.message.includes('Supabase client not initialized')) {
            showMessage('❌ Configuration Error: Supabase not properly configured.', 'error');
        } else {
            showMessage('❌ An unexpected error occurred. Please check the console for details.', 'error');
        }
    }
}

// ==========================================
// 🔍 VALIDATION FUNCTIONS
// ==========================================
function validateUserData(userData) {
    // Check for empty fields
    if (!userData.first_name || !userData.last_name || !userData.username || 
        !userData.password || !userData.designation) {
        showMessage('❌ Please fill in all fields.', 'error');
        return false;
    }

    // Username validation (only letters, numbers, underscores)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(userData.username)) {
        showMessage('❌ Username can only contain letters, numbers, and underscores.', 'error');
        return false;
    }

    // Password length validation
    if (userData.password.length < 6) {
        showMessage('❌ Password must be at least 6 characters long.', 'error');
        return false;
    }

    // Name validation (only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(userData.first_name) || !nameRegex.test(userData.last_name)) {
        showMessage('❌ Names can only contain letters and spaces.', 'error');
        return false;
    }

    return true;
}

// ==========================================
// 🎨 UI HELPER FUNCTIONS
// ==========================================
function handleDatabaseError(error) {
    if (error.code === '23505') {
        // Unique constraint violation (duplicate username)
        showMessage('❌ Error: Username already exists. Please choose a different username.', 'error');
    } else if (error.message.includes('relation "user_profiles" does not exist')) {
        showMessage('❌ Database Error: Table "user_profiles" not found. Please create the table in Supabase.', 'error');
    } else if (error.message.includes('permission denied')) {
        showMessage('❌ Permission Error: Please check your database policies in Supabase.', 'error');
    } else {
        showMessage(`❌ Database Error: ${error.message}`, 'error');
    }
}

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

function clearUserForm() {
    const form = document.getElementById('createUserForm');
    if (form) {
        form.reset();
    }
}

// ==========================================
// 🧪 DEBUGGING & TESTING FUNCTIONS
// ==========================================
function testButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const createBtn = document.getElementById('createUserForm');
    
    console.log('🔍 Button Status Check:');
    console.log('- Login button found:', !!loginBtn);
    console.log('- Logout button found:', !!logoutBtn);
    console.log('- Create form found:', !!createBtn);
    console.log('- Supabase client initialized:', !!supabaseClient);
}

// Run diagnostics after page load
setTimeout(testButtons, 2000);

console.log('📱 Jal Chetna Admin Dashboard loaded successfully');
