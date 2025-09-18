// ==========================================
// 🔧 SUPABASE CONFIGURATION
// ==========================================
// IMPORTANT: Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://hihobitpqkbxkefvpgbk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpaG9iaXRwcWtieGtlZnZwZ2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNDk3MjQsImV4cCI6MjA3MzYyNTcyNH0.1_fLA-mq4McZgW3IzyDdbe6tVjdi80TKslyjMF02DBE';

// Global variables
let supabaseClient = null;
let isSupabaseReady = false;

// ==========================================
// 🔌 SUPABASE INITIALIZATION
// ==========================================
function initializeSupabase() {
    console.log('🔄 Initializing Supabase...');
    
    // Check if Supabase library is loaded
    if (typeof supabase === 'undefined') {
        console.error('❌ Supabase library not loaded. Make sure the CDN is included.');
        showGlobalError('Supabase library not found. Please refresh the page.');
        return false;
    }
    
    // Check configuration
    if (!SUPABASE_URL || SUPABASE_URL.includes('your-project-id')) {
        console.error('❌ Supabase URL not configured properly');
        showGlobalError('Supabase URL not configured. Please check your settings.');
        return false;
    }
    
    if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('your-anon-key')) {
        console.error('❌ Supabase API key not configured properly');
        showGlobalError('Supabase API key not configured. Please check your settings.');
        return false;
    }
    
    try {
        // Create Supabase client
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        isSupabaseReady = true;
        console.log('✅ Supabase client created successfully');
        
        // Test connection
        testDatabaseConnection();
        return true;
    } catch (error) {
        console.error('❌ Failed to create Supabase client:', error);
        showGlobalError(`Supabase initialization failed: ${error.message}`);
        return false;
    }
}

// Test database connection
async function testDatabaseConnection() {
    try {
        console.log('🔍 Testing database connection...');
        const { data, error } = await supabaseClient
            .from('admin_login_details')
            .select('count', { count: 'exact' });
        
        if (error) {
            console.warn('⚠️ Database test warning:', error.message);
            if (error.message.includes('relation "admin_login_details" does not exist')) {
                console.log('ℹ️ Table "admin_login_details" not found. You need to create it in Supabase.');
            }
        } else {
            console.log('✅ Database connection successful!');
        }
    } catch (error) {
        console.error('❌ Database connection test failed:', error);
    }
}

// Show global error message
function showGlobalError(message) {
    let errorBanner = document.getElementById('global-error');
    if (!errorBanner) {
        errorBanner = document.createElement('div');
        errorBanner.id = 'global-error';
        errorBanner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: #dc3545;
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 9999;
            font-weight: bold;
        `;
        document.body.insertBefore(errorBanner, document.body.firstChild);
    }
    errorBanner.textContent = `⚠️ Configuration Error: ${message}`;
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
// 📝 IMPROVED EVENT LISTENERS SETUP
// ==========================================
function setupEventListeners() {
    console.log('🔗 Setting up event listeners...');
    
    // Login page elements - Multiple selectors for reliability
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.getElementById('closeBtn');
    const loginForm = document.getElementById('loginForm');
    
    // Additional login buttons
    const accessDashboardBtn = document.getElementById('accessDashboardBtn');
    const footerLoginBtn = document.getElementById('footerLoginBtn');
    
    // Dashboard page elements
    const logoutBtn = document.getElementById('logoutBtn');
    const createUserForm = document.getElementById('createUserForm');

    console.log('🔍 Elements found:', {
        loginBtn: !!loginBtn,
        loginModal: !!loginModal,
        closeBtn: !!closeBtn,
        loginForm: !!loginForm,
        accessDashboardBtn: !!accessDashboardBtn,
        footerLoginBtn: !!footerLoginBtn
    });

    // Login functionality - FIXED
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔐 Admin login button clicked');
            showLoginModal();
        });
        console.log('✅ Login button event listener attached');
    }

    if (accessDashboardBtn) {
        accessDashboardBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🚀 Access dashboard button clicked');
            showLoginModal();
        });
        console.log('✅ Access Dashboard button event listener attached');
    }

    if (footerLoginBtn) {
        footerLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('👇 Footer login button clicked');
            showLoginModal();
        });
        console.log('✅ Footer login button event listener attached');
    }

    // Modal close functionality - FIXED
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('❌ Close button clicked');
            hideLoginModal();
        });
        console.log('✅ Close button event listener attached');
    }

    // Click outside to close - FIXED
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                console.log('🖱️ Clicked outside modal');
                hideLoginModal();
            }
        });
        console.log('✅ Modal overlay click event listener attached');
    }

    // Login form submission - FIXED
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Login form submitted');
            handleLogin();
        });
        console.log('✅ Login form submit event listener attached');
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
            handleCreateUser();
        });
    }

    // Keyboard shortcuts - FIXED
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('loginModal');
            if (modal && modal.classList.contains('show')) {
                console.log('⌨️ Escape key pressed');
                hideLoginModal();
            }
        }
    });

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

    console.log('✅ All event listeners setup completed');
}

// ==========================================
// 🎨 ENHANCED UI FEATURES
// ==========================================
function setupPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('userPassword');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
}

function setupFormAnimations() {
    // Add focus/blur animations to form inputs
    const formInputs = document.querySelectorAll('.form-input, .form-select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.form-group')?.classList.add('focused');
        });
        input.addEventListener('blur', function() {
            this.closest('.form-group')?.classList.remove('focused');
        });
    });
}

function setButtonLoading(loading) {
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
}

// ==========================================
// 🔑 FIXED LOGIN MODAL FUNCTIONS
// ==========================================
function showLoginModal() {
    console.log('🎭 Attempting to show login modal...');
    
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        console.log('✅ Modal element found, showing modal');
        loginModal.classList.add('show');
        loginModal.style.display = 'flex'; // Backup in case CSS fails
        
        // Focus on username field after modal is shown
        setTimeout(() => {
            const usernameField = document.getElementById('username');
            if (usernameField) {
                usernameField.focus();
                console.log('👤 Username field focused');
            }
        }, 300);
    } else {
        console.error('❌ Login modal element not found!');
        alert('Login modal not found. Please refresh the page.');
    }
}

function hideLoginModal() {
    console.log('🙈 Hiding login modal...');
    
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.remove('show');
        setTimeout(() => {
            loginModal.style.display = 'none'; // Backup cleanup
        }, 300);
        clearLoginForm();
        console.log('✅ Modal hidden');
    }
}

function clearLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.reset();
        console.log('🧹 Login form cleared');
    }
    if (loginError) {
        loginError.textContent = '';
        loginError.style.display = 'none';
    }
}

// ==========================================
// 🔐 IMPROVED LOGIN HANDLING
// ==========================================
function handleLogin() {
    console.log('🔐 Processing login...');
    
    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value.trim();
    const loginError = document.getElementById('loginError');
    
    // Clear previous errors
    if (loginError) {
        loginError.textContent = '';
        loginError.style.display = 'none';
        loginError.style.color = '#dc2626';
    }

    console.log('👤 Login attempt for username:', username);

    // Basic validation
    if (!username || !password) {
        showLoginError('Please enter both username and password.');
        return;
    }

    // Simple authentication (you can modify these credentials)
    if (username === 'superadmin' && password === 'admin') {
        console.log('✅ Login successful');
        
        // Store login state
        sessionStorage.setItem('isSuperAdminLoggedIn', 'true');
        sessionStorage.setItem('adminUsername', username);
        
        // Show success message
        if (loginError) {
            loginError.style.color = '#22c55e';
            loginError.style.display = 'block';
            loginError.textContent = '✅ Login successful! Redirecting...';
        }

        // Redirect to dashboard
        setTimeout(() => {
            hideLoginModal();
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } else {
        console.log('❌ Login failed - Invalid credentials');
        showLoginError('❌ Invalid username or password. Please try again.');
        
        // Clear password field and refocus
        const passwordField = document.getElementById('password');
        if (passwordField) {
            passwordField.value = '';
            passwordField.focus();
        }
    }
}

function showLoginError(message) {
    const loginError = document.getElementById('loginError');
    if (loginError) {
        loginError.textContent = message;
        loginError.style.display = 'block';
        loginError.style.color = '#dc2626';
    }
}

function handleLogout() {
    console.log('🚪 User logging out...');
    sessionStorage.removeItem('isSuperAdminLoggedIn');
    sessionStorage.removeItem('adminUsername');
    window.location.replace('index.html');
}

// ==========================================
// 💾 DATABASE SAVE FUNCTION - MAIN FEATURE
// ==========================================
async function handleCreateUser() {
    console.log('📝 Starting user creation process...');
    const formMessageContent = document.getElementById('formMessageContent') || document.getElementById('formMessage');
    
    // Clear previous messages
    if (formMessageContent) {
        formMessageContent.textContent = '';
        formMessageContent.className = 'form-message';
    }
    
    // Check if Supabase is ready
    if (!isSupabaseReady || !supabaseClient) {
        showEnhancedMessage('❌ Database not configured. Please check your Supabase settings.', 'error');
        return;
    }
    
    // Get form data - UPDATED for enhanced form structure
    const userData = {
        first_name: document.getElementById('firstName')?.value.trim(),
        last_name: document.getElementById('lastName')?.value.trim(),
        username: document.getElementById('userUsername')?.value.trim(),
        password: document.getElementById('userPassword')?.value.trim(),
        designation: document.getElementById('designation')?.value
    };
    
    console.log('📋 Form data collected:', { ...userData, password: '[HIDDEN]' });
    
    // Client-side validation
    if (!validateUserData(userData)) {
        return; // Validation errors already shown
    }
    
    // Show loading state
    setButtonLoading(true);
    showEnhancedMessage('🔄 Creating user profile...', 'info');
    
    try {
        // 🚀 SAVE TO DATABASE - This is where the magic happens
        const { data, error } = await supabaseClient
            .from('admin_login_details') // Updated table name
            .insert([userData])
            .select(); // Returns the inserted data
        
        if (error) {
            console.error('❌ Database error:', error);
            handleDatabaseError(error);
        } else {
            console.log('✅ User created successfully:', data);
            
            // Show success message with user ID
            const newUserId = data[0]?.id || 'Unknown';
            showEnhancedMessage(`✅ Success! User "${userData.username}" created successfully!`, 'success');
            
            // Clear the form
            clearUserForm();
            
            // Log success for debugging
            console.log('💾 Data successfully saved to database:', data[0]);
        }
        
    } catch (error) {
        console.error('❌ Unexpected error during user creation:', error);
        if (error.message.includes('fetch')) {
            showEnhancedMessage('❌ Network Error: Please check your internet connection and Supabase configuration.', 'error');
        } else if (error.message.includes('Supabase client not initialized')) {
            showEnhancedMessage('❌ Configuration Error: Supabase not properly configured.', 'error');
        } else {
            showEnhancedMessage('❌ An unexpected error occurred. Please check the console for details.', 'error');
        }
    } finally {
        // Always remove loading state
        setButtonLoading(false);
    }
}

// ==========================================
// 🔍 VALIDATION FUNCTIONS
// ==========================================
function validateUserData(userData) {
    // Check for empty fields
    if (!userData.first_name || !userData.last_name || !userData.username || 
        !userData.password || !userData.designation) {
        showEnhancedMessage('❌ Please fill in all fields.', 'error');
        return false;
    }
    
    // Username validation (only letters, numbers, underscores)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(userData.username)) {
        showEnhancedMessage('❌ Username can only contain letters, numbers, and underscores.', 'error');
        return false;
    }
    
    // Password length validation
    if (userData.password.length < 6) {
        showEnhancedMessage('❌ Password must be at least 6 characters long.', 'error');
        return false;
    }
    
    // Name validation (only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(userData.first_name) || !nameRegex.test(userData.last_name)) {
        showEnhancedMessage('❌ Names can only contain letters and spaces.', 'error');
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
        showEnhancedMessage('❌ Error: Username already exists. Please choose a different username.', 'error');
    } else if (error.message.includes('relation "admin_login_details" does not exist')) {
        showEnhancedMessage('❌ Database Error: Table "admin_login_details" not found. Please create the table in Supabase.', 'error');
    } else if (error.message.includes('permission denied')) {
        showEnhancedMessage('❌ Permission Error: Please check your database policies in Supabase.', 'error');
    } else {
        showEnhancedMessage(`❌ Database Error: ${error.message}`, 'error');
    }
}

function showEnhancedMessage(message, type) {
    // Try enhanced form message first, then fallback to regular
    const formMessageContent = document.getElementById('formMessageContent');
    const formMessage = document.getElementById('formMessage');
    const messageElement = formMessageContent || formMessage;
    
    if (messageElement) {
        messageElement.textContent = message;
        
        // Enhanced styling
        if (formMessageContent) {
            messageElement.className = `form-message ${type} show`;
        } else {
            messageElement.className = `form-message ${type}`;
        }
        
        // Auto-clear success and info messages after 5 seconds
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                if (formMessageContent) {
                    messageElement.classList.remove('show');
                } else {
                    messageElement.textContent = '';
                    messageElement.className = 'form-message';
                }
            }, 5000);
        }
    }
}

function clearUserForm() {
    const form = document.getElementById('createUserForm');
    if (form) {
        form.reset();
        
        // Remove any focus states
        document.querySelectorAll('.form-group.focused').forEach(group => {
            group.classList.remove('focused');
        });
        
        // Reset password toggle if visible
        const passwordInput = document.getElementById('userPassword');
        const passwordToggle = document.getElementById('passwordToggle');
        if (passwordInput && passwordToggle) {
            passwordInput.setAttribute('type', 'password');
            const icon = passwordToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    }
}

// ==========================================
// 🧪 DEBUGGING & TESTING FUNCTIONS
// ==========================================
function testButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const createBtn = document.getElementById('createUserForm');
    const accessDashboardBtn = document.getElementById('accessDashboardBtn');
    
    console.log('🔍 Button Status Check:');
    console.log('- Login button found:', !!loginBtn);
    console.log('- Access Dashboard button found:', !!accessDashboardBtn);
    console.log('- Logout button found:', !!logoutBtn);
    console.log('- Create form found:', !!createBtn);
    console.log('- Supabase client initialized:', !!supabaseClient);
    console.log('- Current page:', window.location.pathname);
    console.log('- User logged in:', sessionStorage.getItem('isSuperAdminLoggedIn') === 'true');
}

// Function to manually test database connection
async function testDatabaseManually() {
    if (!supabaseClient) {
        console.log('❌ Supabase not initialized');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('admin_login_details')
            .select('*')
            .limit(5);
        
        if (error) {
            console.error('Database test error:', error);
        } else {
            console.log('Database test successful. Sample data:', data);
        }
    } catch (error) {
        console.error('Database test failed:', error);
    }
}

// ==========================================
// 🚀 ENHANCED INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Jal Chetna application starting...');
    console.log('📄 Current page:', window.location.pathname);
    
    // Initialize Supabase with delay
    setTimeout(initializeSupabase, 100);
    
    // Protect dashboard page
    protectDashboard();
    
    // Setup all event listeners
    setTimeout(setupEventListeners, 200); // Small delay to ensure DOM is ready
    
    // Setup enhanced features
    setupPasswordToggle();
    setupFormAnimations();
    
    // Test modal after everything loads
    setTimeout(() => {
        const modal = document.getElementById('loginModal');
        console.log('🎭 Modal element check:', !!modal);
        if (modal) {
            console.log('✅ Login modal is ready');
        } else {
            console.error('❌ Login modal not found in DOM');
        }
    }, 1000);
});

// Run diagnostics after page load
setTimeout(testButtons, 2000);

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

console.log('📱 Jal Chetna Admin Dashboard loaded successfully');

// Export functions for testing (if needed)
if (typeof window !== 'undefined') {
    window.testDatabaseManually = testDatabaseManually;
    window.testButtons = testButtons;
}
