import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

// NOTE: This single-file React app contains multiple components for quick setup.
// You can split components into separate files later for better organization.

/* ------------------------- Helper Utilities ------------------------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const generateUserName = (email) => {
  const username = email.split("@")[0];
  return username
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

/* ---------------------------- Navbar ---------------------------- */
function Navbar({ currentSection, onNavigate, currentUser, onShowLogin, onShowSignup, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <i className="fas fa-handshake"></i>
          <span>CitizenConnect</span>
        </div>
        <div className="nav-menu">
          {[
            ["dashboard", "Dashboard", "tachometer-alt"],
            ["issues", "Issues", "exclamation-circle"],
            ["politicians", "Representatives", "users"],
            ["updates", "Updates", "bell"],
            ["profile", "Profile", "user"],
          ].map(([key, label, icon]) => (
            <a
              key={key}
              href={`#${key}`}
              className={`nav-link ${currentSection === key ? "active" : ""}`}
              data-section={key}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(key);
              }}
            >
              <i className={`fas fa-${icon}`}></i> {label}
            </a>
          ))}
        </div>

        <div className="nav-auth">
          {!currentUser ? (
            <>
              <button className="btn-login" id="loginBtn" onClick={() => onShowLogin()}>Login</button>
              <button className="btn-signup" id="signupBtn" onClick={() => onShowSignup()}>Sign Up</button>
            </>
          ) : (
            <div className="user-menu">
              <span className="user-name">{currentUser.name}</span>
              <button className="btn-logout" onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ---------------------------- Modal ---------------------------- */
function Modal({ id, title, children, isOpen, onClose }) {
  return (
    <div id={id} className={`modal ${isOpen ? "active" : ""}`} style={{ display: isOpen ? "flex" : "none" }} onClick={(e) => { if (e.target.id === id) onClose(); }}>
      <div className={`modal-content`}> 
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

/* --------------------------- Dashboard --------------------------- */
function Dashboard({ stats, activities }) {
  return (
    <section id="dashboard" className={`content-section active`}>
      <div className="hero-section">
        <h1>Welcome to CitizenConnect</h1>
        <p>Empowering citizens to engage with their elected representatives for transparent and responsive governance.</p>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number" id="totalIssues">{stats.totalIssues.toLocaleString()}</span>
            <span className="stat-label">Issues Reported</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" id="resolvedIssues">{stats.resolvedIssues.toLocaleString()}</span>
            <span className="stat-label">Issues Resolved</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" id="activePoliticians">{stats.activePoliticians}</span>
            <span className="stat-label">Active Representatives</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3><i className="fas fa-chart-line"></i> Recent Activity</h3>
          <div className="activity-list" id="activityList">
            {activities.slice(0, 5).map((a) => (
              <div key={a.id} className="activity-item">
                <div className="activity-icon">
                  <i className={`fas fa-${a.icon || "circle"}`}></i>
                </div>
                <div className="activity-content">
                  <span className="activity-text">{a.description}</span>
                  <span className="activity-time">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3><i className="fas fa-fire"></i> Trending Issues</h3>
          <div className="trending-list">
            <div className="trending-item"><span className="trending-title">Public Transportation Delays</span><span className="trending-count">142 reports</span></div>
            <div className="trending-item"><span className="trending-title">Waste Management Issues</span><span className="trending-count">89 reports</span></div>
            <div className="trending-item"><span className="trending-title">Road Infrastructure</span><span className="trending-count">76 reports</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Issues ---------------------------- */
function Issues({ issues, onReportClick, onFilterChange, categoryFilter, statusFilter, searchQuery, onVote }) {
  return (
    <section id="issues" className="content-section">
      <div className="section-header">
        <h2>Community Issues</h2>
        <button className="btn-primary" id="reportIssueBtn" onClick={onReportClick}><i className="fas fa-plus"></i> Report New Issue</button>
      </div>

      <div className="filters">
        <select id="categoryFilter" value={categoryFilter} onChange={(e) => onFilterChange({ category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="environment">Environment</option>
          <option value="safety">Public Safety</option>
          <option value="transport">Transportation</option>
        </select>
        <select id="statusFilter" value={statusFilter} onChange={(e) => onFilterChange({ status: e.target.value })}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <input id="searchIssues" value={searchQuery} onChange={(e) => onFilterChange({ search: e.target.value })} placeholder="Search issues..." />
      </div>

      <div className="issues-grid" id="issuesGrid">
        {issues.length === 0 && <p>No issues found.</p>}
        {issues.map((issue) => (
          <div key={issue.id} className="issue-card" data-category={issue.category} data-status={issue.status}>
            <div className="issue-header">
              <span className={`issue-category ${issue.category}`}>{issue.category}</span>
              <span className={`issue-status ${issue.status}`}>{issue.status}</span>
            </div>
            <h3 className="issue-title">{issue.title}</h3>
            <p className="issue-description">{issue.description}</p>
            <div className="issue-meta">
              <span className="issue-author">Reported by: {issue.author}</span>
              <span className="issue-date">{issue.date}</span>
              <span className="issue-votes">👍 {issue.votes} | 💬 {issue.comments}</span>
            </div>
            <div className="issue-actions">
              <button className="btn-secondary vote-btn" onClick={() => onVote(issue.id)}>Support</button>
              <button className="btn-secondary comment-btn" onClick={() => alert('Comment UI not implemented yet')}>Comment</button>
              <button className="btn-secondary share-btn" onClick={() => { navigator.clipboard?.writeText(window.location.href); alert('Link copied to clipboard'); }}>Share</button>
            </div>

            {issue.politicianResponse && <div className="politician-response"><strong>Response:</strong><p>{issue.politicianResponse}</p></div>}
            {issue.resolution && <div className="resolution-note"><strong>Resolution:</strong> {issue.resolution}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------- Politicians -------------------------- */
function Politicians({ politicians, onMessage, onFollow }) {
  return (
    <section id="politicians" className="content-section">
      <div className="section-header">
        <h2>Your Representatives</h2>
        <input id="searchPoliticians" placeholder="Search representatives..." onChange={() => {}} />
      </div>

      <div className="politicians-grid" id="politiciansGrid">
        {politicians.map((p) => (
          <div key={p.id} className="politician-card">
            <div className="politician-avatar">
              <img src={p.avatar} alt={p.name} />
            </div>
            <div className="politician-info">
              <h3>{p.name}</h3>
              <p className="politician-title">{p.title}</p>
              <p className="politician-party">{p.party}</p>
              <div className="politician-stats">
                <span>📧 {p.messages} messages</span>
                <span>⭐ {p.rating} rating</span>
                <span>🗣️ {p.responseRate}% response</span>
              </div>
            </div>
            <div className="politician-actions">
              <button className="btn-primary message-btn" onClick={() => onMessage(p.name)}>Send Message</button>
              <button className="btn-secondary follow-btn" onClick={() => onFollow(p.id)}>Follow</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- Updates --------------------------- */
function Updates({ updates, onFilter }) {
  const [active, setActive] = useState('all');
  useEffect(() => onFilter(active), [active]);
  return (
    <section id="updates" className="content-section">
      <div className="section-header">
        <h2>Latest Updates</h2>
        <div className="update-filters">
          {[
            ['all','All Updates'],
            ['policy','Policy'],
            ['events','Events'],
            ['announcements','Announcements']
          ].map(([k,label]) => (
            <button key={k} className={`filter-btn ${active===k? 'active' : ''}`} onClick={() => setActive(k)} data-filter={k}>{label}</button>
          ))}
        </div>
      </div>

      <div className="updates-list">
        {updates.filter(u => active==='all' || u.type===active).map(u => (
          <div key={u.id} className="update-item" data-type={u.type}>
            <div className="update-header">
              <span className={`update-type ${u.type}`}>{u.type}</span>
              <span className="update-date">{u.date}</span>
            </div>
            <h3>{u.title}</h3>
            <p>{u.body}</p>
            <div className="update-author"><strong>From: {u.author}</strong></div>
            <div className="update-actions">
              <button className="btn-secondary like-btn">👍 Like ({u.likes})</button>
              <button className="btn-secondary comment-btn">💬 Comment ({u.comments})</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------- Profile ---------------------------- */
function Profile({ currentUser, onUpdateSettings }) {
  const [tab, setTab] = useState('overview');
  const [form, setForm] = useState({ name: '', email: '', location: '' });

  useEffect(() => {
    if (currentUser) setForm({ name: currentUser.name, email: currentUser.email, location: currentUser.location });
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateSettings(form);
  };

  return (
    <section id="profile" className="content-section">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <img src={currentUser?.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjNjY2NiIvPgo8Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIxNSIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNMjAgNzBjMC0xNiAxMy00MyAzMC00M3MzMCAyNyAzMCA0MyIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4='} alt="avatar" />
            <button className="change-avatar-btn">Change Photo</button>
          </div>
          <div className="profile-info">
            <h3 id="profileName">{currentUser?.name || 'Guest'}</h3>
            <p id="profileRole">{currentUser?.role || ''}</p>
            <p id="profileLocation">{currentUser?.location || ''}</p>
            <p id="profileMember">Member since: {currentUser?.joinDate || ''}</p>
          </div>
        </div>

        <div className="profile-main">
          <div className="profile-tabs">
            {['overview','activity','settings'].map(t => (
              <button key={t} className={`tab-btn ${tab===t? 'active' : ''}`} onClick={() => setTab(t)} data-tab={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>

          <div id="overview" className={`tab-content ${tab==='overview'? 'active' : ''}`}>
            <div className="profile-stats">
              <div className="stat-card"><h4>Issues Reported</h4><span className="stat-value">{currentUser?12:0}</span></div>
              <div className="stat-card"><h4>Issues Supported</h4><span className="stat-value">{currentUser?67:0}</span></div>
              <div className="stat-card"><h4>Comments Made</h4><span className="stat-value">{currentUser?143:0}</span></div>
              <div className="stat-card"><h4>Representatives Followed</h4><span className="stat-value">{currentUser?8:0}</span></div>
            </div>
          </div>

          <div id="activity" className={`tab-content ${tab==='activity'? 'active' : ''}`}>
            <div className="activity-history">
              <h4>Recent Activity</h4>
              <div className="activity-list">
                <div className="activity-item"><span className="activity-date">March 10, 2024</span> <span className="activity-desc">Reported issue: Street lighting on Oak Avenue</span></div>
                <div className="activity-item"><span className="activity-date">March 8, 2024</span> <span className="activity-desc">Commented on healthcare accessibility issue</span></div>
              </div>
            </div>
          </div>

          <div id="settings" className={`tab-content ${tab==='settings'? 'active' : ''}`}>
            <form className="settings-form" onSubmit={handleSubmit}>
              <div className="form-group"><label>Full Name:</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
              <div className="form-group"><label>Email:</label><input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></div>
              <div className="form-group"><label>Location:</label><input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} /></div>
              <div className="form-actions"><button className="btn-primary" type="submit">Save</button></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ App ------------------------------ */
export default function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [modals, setModals] = useState({ login: false, signup: false, report: false });
  const [currentUser, setCurrentUser] = useState(null);
  const [issues, setIssues] = useState([]);
  const [politicians, setPoliticians] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({ totalIssues: 1247, resolvedIssues: 892, activePoliticians: 156 });

  const [filters, setFilters] = useState({ category: '', status: '', search: '' });
  const loginRef = useRef();
  const signupRef = useRef();
  const reportRef = useRef();

  useEffect(() => {
    // load initial data from uploaded HTML's content (converted)
    const seededPoliticians = [
      { id: uid(), name: 'Mayor Robert Johnson', title: 'Mayor of Springfield', party: 'Democratic Party', messages: 142, rating: 4.2, responseRate: 89, avatar: 'data:image/svg+xml;base64,PHN2Zy...' },
      { id: uid(), name: 'Sarah Davis', title: 'City Council Member - District 3', party: 'Independent', messages: 98, rating: 4.7, responseRate: 95, avatar: 'data:image/svg+xml;base64,PHN2Zy...' },
      { id: uid(), name: 'Carlos Martinez', title: 'State Representative', party: 'Republican Party', messages: 76, rating: 3.9, responseRate: 78, avatar: 'data:image/svg+xml;base64,PHN2Zy...' },
    ];

    const seededUpdates = [
      { id: uid(), type: 'policy', date: 'Today, 2:30 PM', title: 'New Public Transportation Initiative', body: 'City Council approved $2.5M budget...', author: 'Mayor Robert Johnson', likes: 34, comments: 12 },
      { id: uid(), type: 'events', date: 'Tomorrow, 6:00 PM', title: 'Town Hall Meeting: Community Safety', body: 'Join us for an open discussion...', author: 'Sarah Davis', likes: 12, comments: 4 },
      { id: uid(), type: 'announcements', date: '2 days ago', title: 'Road Maintenance Schedule', body: 'Main Street will undergo scheduled maintenance', author: 'Dept. of Public Works', likes: 8, comments: 2 },
    ];

    setPoliticians(seededPoliticians);
    setUpdates(seededUpdates);
    setIssues([ // sample issues
      { id: uid(), title: 'Pothole on Main Street causing traffic issues', category: 'infrastructure', description: 'Large pothole near intersection...', location: 'Main St', status: 'open', author: 'Sarah Johnson', date: '3 days ago', votes: 24, comments: 8 },
      { id: uid(), title: 'Long wait times at Community Health Center', category: 'healthcare', description: 'Patients experiencing 3-4 hour wait times...', location: 'Community Health Center', status: 'in-progress', author: 'Michael Chen', date: '1 week ago', votes: 67, comments: 23, politicianResponse: "We're working with the health department to address staffing issues." },
      { id: uid(), title: 'Illegal dumping in Riverside Park', category: 'environment', description: 'Construction waste and household items dumped...', location: 'Riverside Park', status: 'resolved', author: 'Environmental Group', date: '2 weeks ago', votes: 89, comments: 15, resolution: 'Cleanup completed and additional cameras installed.' },
    ]);

    setActivities([
      { id: uid(), description: 'New issue reported: Road maintenance on Main St', time: '2 hours ago', icon: 'plus-circle' },
      { id: uid(), description: 'Issue resolved: Street lighting fixed', time: '5 hours ago', icon: 'check-circle' },
      { id: uid(), description: 'Mayor Johnson responded to healthcare concern', time: '1 day ago', icon: 'comment' },
    ]);

    // try to restore saved user
    const saved = localStorage.getItem('citizen_user');
    if (saved) setCurrentUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    // persist user
    if (currentUser) localStorage.setItem('citizen_user', JSON.stringify(currentUser));
    else localStorage.removeItem('citizen_user');
  }, [currentUser]);

  useEffect(() => {
    // update derived stats when issues change
    setStats((s) => ({ ...s, totalIssues: 1247 + issues.length }));
  }, [issues]);

  /* ---------------------- Auth Handlers ---------------------- */
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.loginEmail.value;
    const password = e.target.loginPassword.value;
    const role = e.target.userRole.value;

    if (email && password && role) {
      const user = { name: generateUserName(email), email, role, location: 'Springfield, IL', joinDate: 'January 2024', avatar: '', id: uid() };
      setCurrentUser(user);
      setModals({ ...modals, login: false });
      addMessage('Login successful! Welcome back.', 'success');
    } else addMessage('Please fill in all fields.', 'error');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const name = e.target.signupName.value;
    const email = e.target.signupEmail.value;
    const password = e.target.signupPassword.value;
    const role = e.target.signupRole.value;
    const location = e.target.signupLocation.value;

    if (name && email && password && role && location) {
      const user = { name, email, role, location, joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), avatar: '', id: uid() };
      setCurrentUser(user);
      setModals({ ...modals, signup: false });
      addMessage('Account created successfully! Welcome to CitizenConnect.', 'success');
    } else addMessage('Please fill in all fields.', 'error');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    addMessage('You have been logged out successfully.', 'success');
    setCurrentSection('dashboard');
  };

  /* -------------------- Report Issue Handler -------------------- */
  const handleReportIssue = (e) => {
    e.preventDefault();
    if (!currentUser) { addMessage('Please log in to report an issue.', 'error'); setModals({ ...modals, login: true }); return; }

    const title = e.target.issueTitle.value;
    const category = e.target.issueCategory.value;
    const description = e.target.issueDescription.value;
    const location = e.target.issueLocation.value;
    const urgent = e.target.issueUrgent.checked;

    if (title && category && description) {
      const newIssue = {
        id: uid(), title, category, description, location: location || 'Location not specified', status: urgent ? 'urgent' : 'open', author: currentUser.name, date: new Date().toLocaleDateString(), votes: Math.floor(Math.random() * 50) + 1, comments: Math.floor(Math.random() * 20) + 1
      };
      setIssues([newIssue, ...issues]);
      setModals({ ...modals, report: false });
      addMessage('Issue reported successfully!', 'success');
      addActivity('reported', `New issue: ${title}`);
      e.target.reset();
    } else addMessage('Please fill in all required fields.', 'error');
  };

  /* ---------------------- Utility Actions ---------------------- */
  const addMessage = (text, type='success') => {
    const container = document.getElementById('messageContainer');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `message ${type}`;
    el.textContent = text;
    container.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  };

  const addActivity = (type, description) => {
    const a = { id: uid(), type, description, time: 'Just now', icon: type==='reported' ? 'plus-circle' : 'circle' };
    setActivities([a, ...activities].slice(0, 10));
  };

  const handleVote = (issueId) => {
    if (!currentUser) { addMessage('Please log in to vote on issues.', 'error'); setModals({ ...modals, login: true }); return; }
    setIssues((prev) => prev.map(i => i.id===issueId ? {...i, votes: i.votes+1} : i));
    addMessage('Your support has been recorded.', 'success');
    addActivity('voted', 'Supported an issue');
  };

  const handleMessagePolitician = (name) => {
    if (!currentUser) { addMessage('Please log in to send messages.', 'error'); setModals({ ...modals, login: true }); return; }
    const text = prompt(`Send a message to ${name}:`);
    if (text) { addMessage('Message sent successfully!', 'success'); addActivity('messaged', `Sent message to ${name}`); }
  };

  const handleFollowPolitician = (id) => {
    if (!currentUser) { addMessage('Please log in to follow representatives.', 'error'); setModals({ ...modals, login: true }); return; }
    addMessage('You are now following this representative!', 'success'); addActivity('followed', 'Started following a representative');
  };

  const handleUpdateSettings = (form) => {
    if (!currentUser) { addMessage('Please log in to update settings.', 'error'); return; }
    const updated = { ...currentUser, name: form.name, email: form.email, location: form.location };
    setCurrentUser(updated); addMessage('Settings updated successfully!', 'success');
  };

  const handleFilterChange = (payload) => setFilters({ ...filters, ...payload });

  const filteredIssues = issues.filter(i => {
    if (filters.category && i.category !== filters.category) return false;
    if (filters.status && i.status !== filters.status) return false;
    if (filters.search && !(`${i.title} ${i.description}`).toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <Navbar
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        currentUser={currentUser}
        onShowLogin={() => setModals({...modals, login: true})}
        onShowSignup={() => setModals({...modals, signup: true})}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {currentSection === "dashboard" && (
  <Dashboard stats={stats} activities={activities} />
)}

{currentSection === "issues" && (
  <Issues
    issues={filteredIssues}
    onReportClick={() => setModals({ ...modals, report: true })}
    onFilterChange={handleFilterChange}
    categoryFilter={filters.category}
    statusFilter={filters.status}
    searchQuery={filters.search}
    onVote={handleVote}
  />
)}

{currentSection === "politicians" && (
  <Politicians
    politicians={politicians}
    onMessage={handleMessagePolitician}
    onFollow={handleFollowPolitician}
  />
)}

{currentSection === "updates" && (
  <Updates updates={updates} onFilter={() => {}} />
)}

{currentSection === "profile" && (
  <Profile
    currentUser={currentUser}
    onUpdateSettings={handleUpdateSettings}
  />
)}

      </main>

      {/* Modals */}
      <div id="messageContainer" className="message-container" />

      <Modal id="loginModal" title="Login to CitizenConnect" isOpen={modals.login} onClose={() => setModals({...modals, login: false})}>
        <form id="loginForm" onSubmit={handleLogin}>
          <div className="form-group"><label>Email:</label><input name="loginEmail" type="email" required /></div>
          <div className="form-group"><label>Password:</label><input name="loginPassword" type="password" required /></div>
          <div className="form-group"><label>Login as:</label>
            <select name="userRole" required>
              <option value="">Select Role</option>
              <option value="citizen">Citizen</option>
              <option value="politician">Politician</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
          <button className="btn-primary" type="submit">Login</button>
        </form>
      </Modal>

      <Modal id="signupModal" title="Join CitizenConnect" isOpen={modals.signup} onClose={() => setModals({...modals, signup: false})}>
        <form id="signupForm" onSubmit={handleSignup}>
          <div className="form-group"><label>Full Name:</label><input name="signupName" type="text" required /></div>
          <div className="form-group"><label>Email:</label><input name="signupEmail" type="email" required /></div>
          <div className="form-group"><label>Password:</label><input name="signupPassword" type="password" required /></div>
          <div className="form-group"><label>Register as:</label>
            <select name="signupRole" required>
              <option value="">Select Role</option>
              <option value="citizen">Citizen</option>
              <option value="politician">Politician</option>
            </select>
          </div>
          <div className="form-group"><label>Location:</label><input name="signupLocation" type="text" placeholder="City, State" required /></div>
          <button className="btn-primary" type="submit">Sign Up</button>
        </form>
      </Modal>

      <Modal id="reportModal" title="Report an Issue" isOpen={modals.report} onClose={() => setModals({...modals, report: false})}>
        <form id="reportForm" onSubmit={handleReportIssue}>
          <div className="form-group"><label>Title:</label><input name="issueTitle" required /></div>
          <div className="form-group"><label>Category:</label>
            <select name="issueCategory" required>
              <option value="">Select</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="environment">Environment</option>
              <option value="safety">Public Safety</option>
              <option value="transport">Transportation</option>
            </select>
          </div>
          <div className="form-group"><label>Description:</label><textarea name="issueDescription" required /></div>
          <div className="form-group"><label>Location:</label><input name="issueLocation" /></div>
          <div className="form-group"><label><input name="issueUrgent" type="checkbox" /> Mark as urgent</label></div>
          <div className="form-actions">
            <button className="btn-secondary" type="button" onClick={() => setModals({...modals, report: false})}>Cancel</button>
            <button className="btn-primary" type="submit">Report</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
