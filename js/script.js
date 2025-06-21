// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const loginContainer = document.querySelector('.login-form');
const registerContainer = document.querySelector('.register-form');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const logoutBtn = document.getElementById('logoutBtn');

// Toggle between login and register forms
if (loginLink && registerLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    });

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
    });
}

// Mobile menu toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
}

// Initialize data in localStorage if not exists
function initializeData() {
    if (!localStorage.getItem('users')) {
        const initialUsers = {
            'Admin01': { password: '01234567', isAdmin: true },
            'Admin02': { password: '02345678', isAdmin: true },
            'Admin03': { password: '12345678', isAdmin: true }
        };
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }

    if (!localStorage.getItem('announcements')) {
        localStorage.setItem('announcements', JSON.stringify([]));
    }

    if (!localStorage.getItem('members')) {
        const initialMembers = {
            'Admin01': { payments: [], balance: 0 },
            'Admin02': { payments: [], balance: 0 },
            'Admin03': { payments: [], balance: 0 }
        };
        localStorage.setItem('members', JSON.stringify(initialMembers));
    }

    if (!localStorage.getItem('projects')) {
        const initialProjects = [
            {
                id: 1,
                title: 'Community Center Renovation',
                description: 'Renovation of the local community center to improve facilities for all members.',
                status: 'completed',
                startDate: '2022-01-15',
                endDate: '2022-05-20',
                budget: 50000
            },
            {
                id: 2,
                title: 'Annual Charity Fundraiser',
                description: 'Yearly fundraising event to support local families in need.',
                status: 'current',
                startDate: '2023-06-01',
                endDate: '2023-08-31',
                budget: 20000
            },
            {
                id: 3,
                title: 'Spiritual Talk Program',
                description: 'Program to connect our souls back with God and ask for His reconcilliation.',
                status: 'upcoming',
                startDate: '2025-06-21',
                endDate: '2025-06-21',
                budget: 3000
            }
        ];
        localStorage.setItem('projects', JSON.stringify(initialProjects));
    }

    if (!localStorage.getItem('team')) {
        const initialTeam = [
            {
                id: 1,
                image:'images/Fulasisi11.jpg',
                name: 'Francis Chikuse',
                position: 'Chief Excutive Officer',
                bio: 'Founding member with 10 years of leadership experience.'
            },
            {
                id: 2,
                image:'images/IMG_20240803_071614_990~2.jpg',
                name: 'Paul Kangachepe',
                position: 'Deputy CEO',
                bio: 'Community organizer with expertise in fundraising.'
            },
            {
                id: 3,
                image:'',
                name: 'Bright Chimwaza',
                position: 'Treasurer',
                bio: 'Financial expert responsible for budget management.'
            },
            {
                id: 4,
                image:'',
                name: 'Shadreck Ganizani',
                position: 'Secretary',
                bio: 'Keeps detailed records of all meetings and decisions.'
            }
        ];
        localStorage.setItem('team', JSON.stringify(initialTeam));
    }
}

// Login functionality
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users'));
        if (users && users[username] && users[username].password === password) {
            // Successful login
            localStorage.setItem('currentUser', JSON.stringify({
                username: username,
                isAdmin: users[username].isAdmin || false
            }));
            window.location.href = 'dashboard.html';
        } else {
            loginError.textContent = 'Invalid username or password';
        }
    });
}

// Registration functionality
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            registerError.textContent = 'Passwords do not match';
            return;
        }

        if (password.length < 6) {
            registerError.textContent = 'Password must be at least 6 characters';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username]) {
            registerError.textContent = 'Username already exists';
            return;
        }

        // Register new user
        users[username] = { password: password, isAdmin: false };
        localStorage.setItem('users', JSON.stringify(users));

        // Initialize member data
        const members = JSON.parse(localStorage.getItem('members')) || {};
        members[username] = { payments: [], balance: 0 };
        localStorage.setItem('members', JSON.stringify(members));

        // Show success message and switch to login
        registerError.textContent = '';
        alert('Registration successful! Please login.');
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        document.getElementById('username').value = username;
        document.getElementById('password').value = '';
    });
}

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

// Check authentication on protected pages
function checkAuth() {
    const protectedPages = ['dashboard.html', 'announcements.html', 'members.html', 'projects.html', 'about.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage)) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = 'index.html';
        }
    }
}

// Load dashboard data
function loadDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Display username
    document.getElementById('loggedInUser').textContent = currentUser.username;

    // Show admin section if admin
    if (currentUser.isAdmin) {
        document.getElementById('adminSection').classList.remove('hidden');
    }

    // Load announcements preview
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const previewContainer = document.getElementById('announcementsPreview');
    
    if (announcements.length > 0) {
        const latestAnnouncements = announcements.slice(0, 3);
        previewContainer.innerHTML = latestAnnouncements.map(ann => `
            <div class="announcement-item">
                <h4>${ann.title}</h4>
                <p>${ann.content.substring(0, 50)}...</p>
                <small>Posted on ${new Date(ann.date).toLocaleDateString()}</small>
            </div>
        `).join('');

        // Show notification badge if there are new announcements
        const lastSeen = localStorage.getItem('lastSeenAnnouncement') || 0;
        if (announcements.length > 0 && new Date(announcements[0].date) > new Date(lastSeen)) {
            document.getElementById('notificationBadge').classList.remove('hidden');
        }
    } else {
        previewContainer.innerHTML = '<p>No announcements yet.</p>';
    }

    // Load payment status
    const members = JSON.parse(localStorage.getItem('members')) || {};
    const memberData = members[currentUser.username] || { payments: [], balance: 0 };
    const paymentStatus = document.getElementById('paymentStatus');
    
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    const currentPayment = memberData.payments.find(p => 
        p.month === currentMonth && p.year === currentYear && p.approved
    );

    if (currentPayment) {
        paymentStatus.innerHTML = `
            <p class="paid">Your payment for ${currentMonth} ${currentYear} has been received. Thank you!</p>
            <p>Current balance: MWK${memberData.balance.toFixed(2)}</p>
        `;
    } else {
        const pendingPayment = memberData.payments.find(p => 
            p.month === currentMonth && p.year === currentYear && !p.approved
        );

        if (pendingPayment) {
            paymentStatus.innerHTML = `
                <p class="unpaid">Your payment for ${currentMonth} ${currentYear} is pending approval.</p>
                <p>Current balance: MWK${memberData.balance.toFixed(2)}</p>
            `;
        } else {
            paymentStatus.innerHTML = `
                <p class="unpaid">You haven't paid for ${currentMonth} ${currentYear} yet.</p>
                <p>Current balance: MWK${memberData.balance.toFixed(2)}</p>
            `;
        }

        // Show payment form for non-admin users
        if (!currentUser.isAdmin) {
            document.getElementById('paymentForm').classList.remove('hidden');
            const monthSelect = document.getElementById('paymentMonth');
            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            
            monthSelect.innerHTML = '<option value="">Select month</option>' + 
                months.map((month, index) => 
                    `<option value="${month}" ${index === new Date().getMonth() ? 'selected' : ''}>${month}</option>`
                ).join('');
        }
    }

    // Payment form submission
    const paymentForm = document.getElementById('submitPaymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('paymentAmount').value);
            const month = document.getElementById('paymentMonth').value;
            const year = new Date().getFullYear();

            if (!month || isNaN(amount) || amount <= 0) {
                alert('Please enter valid payment details');
                return;
            }

            const members = JSON.parse(localStorage.getItem('members')) || {};
            const memberData = members[currentUser.username] || { payments: [], balance: 0 };
            
            // Check if payment already exists for this month
            const existingPaymentIndex = memberData.payments.findIndex(p => 
                p.month === month && p.year === year
            );

            if (existingPaymentIndex !== -1) {
                // Update existing payment
                memberData.payments[existingPaymentIndex] = {
                    month, year, amount, approved: false, date: new Date().toISOString()
                };
            } else {
                // Add new payment
                memberData.payments.push({
                    month, year, amount, approved: false, date: new Date().toISOString()
                });
            }

            members[currentUser.username] = memberData;
            localStorage.setItem('members', JSON.stringify(members));
            alert('Payment submitted for approval. Thank you!');
            window.location.reload();
        });
    }
}

// Load announcements page
function loadAnnouncements() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Show admin controls if admin
    if (currentUser.isAdmin) {
        document.getElementById('adminAnnouncementControls').classList.remove('hidden');
    }

    // Load announcements
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const announcementsList = document.getElementById('announcementsList');

    if (announcements.length > 0) {
        announcementsList.innerHTML = announcements.map(ann => `
            <div class="announcement-card">
                <h3>${ann.title}</h3>
                <p class="date">Posted on ${new Date(ann.date).toLocaleDateString()}</p>
                <div class="content">${ann.content}</div>
                ${currentUser.isAdmin ? `
                    <div class="admin-controls">
                        <button class="delete-btn" data-id="${ann.id}">Delete</button>
                    </div>
                ` : ''}
            </div>
        `).join('');

        // Mark announcements as seen
        localStorage.setItem('lastSeenAnnouncement', new Date().toISOString());
    } else {
        announcementsList.innerHTML = '<p>No announcements yet.</p>';
    }

    // Announcement form submission
    const announcementForm = document.getElementById('announcementForm');
    if (announcementForm) {
        announcementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('announcementTitle').value.trim();
            const content = document.getElementById('announcementContent').value.trim();

            if (!title || !content) {
                alert('Please fill in all fields');
                return;
            }

            const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
            const newAnnouncement = {
                id: Date.now().toString(),
                title,
                content,
                date: new Date().toISOString(),
                author: currentUser.username
            };

            announcements.unshift(newAnnouncement);
            localStorage.setItem('announcements', JSON.stringify(announcements));
            alert('Announcement posted successfully!');
            announcementForm.reset();
            loadAnnouncements();
        });
    }

    // Delete announcement
    announcementsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this announcement?')) {
                const announcementId = e.target.getAttribute('data-id');
                let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
                announcements = announcements.filter(ann => ann.id !== announcementId);
                localStorage.setItem('announcements', JSON.stringify(announcements));
                loadAnnouncements();
            }
        }
    });
}

// Load members page
function loadMembers() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Show admin section if admin
    if (currentUser.isAdmin) {
        document.getElementById('adminMembersSection').classList.remove('hidden');
    }

    // Load member details
    const members = JSON.parse(localStorage.getItem('members')) || {};
    const memberData = members[currentUser.username] || { payments: [], balance: 0 };
    const memberDetails = document.getElementById('memberDetails');

    memberDetails.innerHTML = `
        <div class="member-details">
            <div class="member-detail">
                <label>Username:</label>
                <span>${currentUser.username}</span>
            </div>
            <div class="member-detail">
                <label>Status:</label>
                <span>${currentUser.isAdmin ? 'Admin' : 'Member'}</span>
            </div>
            <div class="member-detail">
                <label>Current Balance:</label>
                <span>MWK${memberData.balance.toFixed(2)}</span>
            </div>
        </div>
    `;

    // Load payment history
    const paymentHistory = document.getElementById('paymentHistory');
    if (memberData.payments.length > 0) {
        paymentHistory.innerHTML = `
            <table class="payment-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${memberData.payments.map(payment => `
                        <tr>
                            <td>${new Date(payment.date).toLocaleDateString()}</td>
                            <td>${payment.month}</td>
                            <td>${payment.year}</td>
                            <td>MWK${payment.amount.toFixed(2)}</td>
                            <td>${payment.approved ? 'Approved' : 'Pending'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        paymentHistory.innerHTML = '<p>No payment history found.</p>';
    }

    // Load all members for admin
    if (currentUser.isAdmin) {
        const allMembersList = document.getElementById('allMembersList');
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const allMembers = Object.keys(users).map(username => {
            const member = members[username] || { payments: [], balance: 0 };
            return { username, ...member, isAdmin: users[username].isAdmin || false };
        });

        allMembersList.innerHTML = `
            <table class="payment-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${allMembers.map(member => `
                        <tr>
                            <td>${member.username}</td>
                            <td>${member.isAdmin ? 'Admin' : 'Member'}</td>
                            <td>MWK${member.balance.toFixed(2)}</td>
                            <td>
                                <button class="manage-payments-btn" data-username="${member.username}">Manage Payments</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Payment management modal
        allMembersList.addEventListener('click', (e) => {
            if (e.target.classList.contains('manage-payments-btn')) {
                const username = e.target.getAttribute('data-username');
                const member = allMembers.find(m => m.username === username);
                
                // Show payment management modal
                const modalHtml = `
                    <div class="modal-overlay">
                        <div class="modal">
                            <h3>Manage Payments for ${username}</h3>
                            <div class="current-balance">
                                <p>Current Balance: MWK${member.balance.toFixed(2)}</p>
                            </div>
                            <div class="payment-list">
                                <h4>Payment History</h4>
                                ${member.payments.length > 0 ? `
                                    <table class="payment-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Month</th>
                                                <th>Year</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${member.payments.map(payment => `
                                                <tr>
                                                    <td>${new Date(payment.date).toLocaleDateString()}</td>
                                                    <td>${payment.month}</td>
                                                    <td>${payment.year}</td>
                                                    <td>MWK${payment.amount.toFixed(2)}</td>
                                                    <td>${payment.approved ? 'Approved' : 'Pending'}</td>
                                                    <td>
                                                        ${!payment.approved ? `
                                                            <button class="approve-payment-btn" 
                                                                data-username="${username}" 
                                                                data-month="${payment.month}" 
                                                                data-year="${payment.year}">
                                                                Approve
                                                            </button>
                                                        ` : ''}
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                ` : '<p>No payment history found.</p>'}
                            </div>
                            <div class="modal-actions">
                                <button class="close-modal-btn">Close</button>
                            </div>
                        </div>
                    </div>
                `;

                document.body.insertAdjacentHTML('beforeend', modalHtml);

                // Close modal
                document.querySelector('.close-modal-btn').addEventListener('click', () => {
                    document.querySelector('.modal-overlay').remove();
                });

                // Approve payment
                document.querySelectorAll('.approve-payment-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const username = e.target.getAttribute('data-username');
                        const month = e.target.getAttribute('data-month');
                        const year = e.target.getAttribute('data-year');

                        const members = JSON.parse(localStorage.getItem('members')) || {};
                        const memberPayments = members[username].payments;
                        
                        const paymentIndex = memberPayments.findIndex(p => 
                            p.month === month && p.year === year
                        );

                        if (paymentIndex !== -1) {
                            memberPayments[paymentIndex].approved = true;
                            members[username].balance = Math.max(0, members[username].balance + memberPayments[paymentIndex].amount);
                            localStorage.setItem('members', JSON.stringify(members));
                            alert('Payment approved successfully!');
                            document.querySelector('.modal-overlay').remove();
                            loadMembers();
                        }
                    });
                });
            }
        });
    }
}

// Load projects page
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    
    const currentProjects = projects.filter(p => p.status === 'current');
    const completedProjects = projects.filter(p => p.status === 'completed');
    const upcomingProjects = projects.filter(p => p.status === 'upcoming');

    // Load current projects
    const currentProjectsContainer = document.getElementById('currentProjects');
    if (currentProjects.length > 0) {
        currentProjectsContainer.innerHTML = currentProjects.map(project => `
            <div class="project-card">
                <h3>${project.title}</h3>
                <span class="status status-current">In Progress</span>
                <p class="description">${project.description}</p>
                <div class="details">
                    <div class="detail">
                        <i>📅</i>
                        <span>${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                    <div class="detail">
                        <i>💰</i>
                        <span>Budget: MWK${project.budget.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        currentProjectsContainer.innerHTML = '<p>No current projects at this time.</p>';
    }

    // Load completed projects
    const completedProjectsContainer = document.getElementById('completedProjects');
    if (completedProjects.length > 0) {
        completedProjectsContainer.innerHTML = completedProjects.map(project => `
            <div class="project-card">
                <h3>${project.title}</h3>
                <span class="status status-completed">Completed</span>
                <p class="description">${project.description}</p>
                <div class="details">
                    <div class="detail">
                        <i>📅</i>
                        <span>${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                    <div class="detail">
                        <i>💰</i>
                        <span>Budget: MWK${project.budget.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        completedProjectsContainer.innerHTML = '<p>No completed projects yet.</p>';
    }

    // Load upcoming projects
    const upcomingProjectsContainer = document.getElementById('upcomingProjects');
    if (upcomingProjects.length > 0) {
        upcomingProjectsContainer.innerHTML = upcomingProjects.map(project => `
            <div class="project-card">
                <h3>${project.title}</h3>
                <span class="status status-upcoming">Upcoming</span>
                <p class="description">${project.description}</p>
                <div class="details">
                    <div class="detail">
                        <i>📅</i>
                        <span>${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                    <div class="detail">
                        <i>💰</i>
                        <span>Budget: MWK${project.budget.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        upcomingProjectsContainer.innerHTML = '<p>No upcoming projects announced yet.</p>';
    }
}

// Load about page
function loadAbout() {
    const team = JSON.parse(localStorage.getItem('team')) || [];
    const teamContainer = document.getElementById('teamMembers');

    if (team.length > 0) {
        teamContainer.innerHTML = `
            <div class="team-members">
                ${team.map(member => `
                    <div class="team-member">
                        <img src="${member.image}" alt = "${member.name}">
                        <h4>${member.name}</h4>
                        <p>${member.position}</p>
                        <p class="bio">${member.bio}</p>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        teamContainer.innerHTML = '<p>No team members information available.</p>';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    checkAuth();

    // Load page-specific content
    const currentPage = window.location.pathname.split('/').pop();
    switch (currentPage) {
        case 'dashboard.html':
            loadDashboard();
            break;
        case 'announcements.html':
            loadAnnouncements();
            break;
        case 'members.html':
            loadMembers();
            break;
        case 'projects.html':
            loadProjects();
            break;
        case 'about.html':
            loadAbout();
            break;
    }
});