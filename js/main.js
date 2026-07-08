/* =========================================================
   main.js — Shared JavaScript for EdTech Website
   ========================================================= */

'use strict';

// ── Preloader ──────────────────────────────────────────
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 1200);
  }
});

// ── Navbar: scroll class & active links ───────────────
const navbar = document.querySelector('.navbar');

function updateNavbar() {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// Set active nav link based on current page
(function setActiveLink() {
  const links = document.querySelectorAll('.navbar-links a, .navbar-mobile a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ── Mobile Nav Toggle ─────────────────────────────────
const mobileToggle = document.getElementById('mobileToggle');
const mobileNav = document.getElementById('mobileNav');

if (mobileToggle && mobileNav) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    mobileToggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      mobileToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!mobileToggle.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      mobileToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ── Scroll Reveal ─────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Scroll To Top ─────────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Accordion / FAQ ───────────────────────────────────
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-item.open').forEach(openItem => {
      openItem.classList.remove('open');
    });
    if (!isOpen) item.classList.add('open');
  });
});

// ── Counter Animation ─────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 2000;
  const step = 16;
  let current = 0;
  const increment = target / (duration / step);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = prefix + (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Filter Buttons ────────────────────────────────────
document.querySelectorAll('.filter-btn-group').forEach(group => {
  group.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      const container = group.closest('.filterable-section');
      if (!container) return;
      container.querySelectorAll('[data-category]').forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
          item.classList.add('reveal', 'visible');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});

// ── Tab Buttons ───────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.tab-group');
    const panel = btn.getAttribute('data-tab');
    if (group) {
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-panel') === panel);
    });
  });
});

// ── Form Validation ───────────────────────────────────
document.querySelectorAll('form[data-validate]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      const error = field.closest('.form-group')?.querySelector('.form-error');
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#ef4444';
        if (error) error.style.display = 'block';
      } else {
        field.style.borderColor = '';
        if (error) error.style.display = 'none';
      }
    });

    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.style.borderColor = '#ef4444';
      valid = false;
    }

    // Password length
    const passField = form.querySelector('input[type="password"]');
    if (passField && passField.value && passField.value.length < 6) {
      passField.style.borderColor = '#ef4444';
      valid = false;
    }

    if (valid) {
      const successMsg = form.querySelector('.form-success');
      if (successMsg) {
        successMsg.style.display = 'block';
        form.reset();
        setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
      }
    }
  });

  // Real-time clear error on input
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });
});

// ── Smooth Internal Links ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── LingoFlow Language Animation Engine ────────────────

// 1. SLA Countdown Ticker
function startSLATimers() {
  const timers = document.querySelectorAll('.sla-timer');
  if (timers.length === 0) return;

  setInterval(() => {
    timers.forEach(timer => {
      let timeText = timer.textContent.trim();
      if (timeText === 'Expired' || timeText === 'Resolved' || timeText.startsWith('Resolved') || timeText.startsWith('Starts')) return;
      
      // Parse e.g., "14m 22s" or "5m 05s"
      let minutes = 0;
      let seconds = 0;
      
      const minMatch = timeText.match(/(\d+)m/);
      const secMatch = timeText.match(/(\d+)s/);
      
      if (minMatch) minutes = parseInt(minMatch[1]);
      if (secMatch) seconds = parseInt(secMatch[1]);
      else seconds = 0;
      
      let totalSeconds = minutes * 60 + seconds;
      if (totalSeconds > 0) {
        totalSeconds--;
        let newMin = Math.floor(totalSeconds / 60);
        let newSec = totalSeconds % 60;
        
        // Format
        let formattedSec = newSec < 10 ? '0' + newSec : newSec;
        timer.textContent = `${newMin}m ${formattedSec}s`;
        
        // Update alert classes
        if (newMin < 5) {
          timer.className = 'sla-timer danger';
        } else if (newMin < 15) {
          timer.className = 'sla-timer warning';
        } else {
          timer.className = 'sla-timer';
        }
      } else {
        timer.textContent = 'Expired';
        timer.className = 'sla-timer danger';
      }
    });
  }, 1000);
}
document.addEventListener('DOMContentLoaded', startSLATimers);

// 2. Simulated Toast Notification Feed
function triggerMockToasts() {
  const isAgentDashboard = document.querySelector('.dashboard-layout');
  if (!isAgentDashboard || document.getElementById('lastUpdated2')) return; // Ensure we're on teacher console

  // Create toast container if it doesn't exist
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const mockStreaks = [
    { title: "🔥 Streak Milestone!", desc: "user_vikram just achieved a 15-day Spanish study streak!", user: "vikram@lingoflow.edu" },
    { title: "🏆 Lesson Completed", desc: "Priya just finished the advanced German Grammar lesson block.", user: "priya@gmail.com" },
    { title: "⚡ Custom Lesson Created", desc: "New AI lesson 'Travel Italian: At the Restaurant' generated.", user: "admin@lingoflow.edu" },
    { title: "🚨 Tutor Review Request", desc: "Suresh submitted a Spanish writing exercise for manual grading.", user: "suresh@nit.edu.in" }
  ];

  let streakIndex = 0;
  
  // Show first toast after 8 seconds, then every 25 seconds
  setTimeout(function showNextToast() {
    const t = mockStreaks[streakIndex % mockStreaks.length];
    streakIndex++;
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <div style="flex:1;">
        <div style="font-size:0.9rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">${t.title}</div>
        <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:6px;">${t.desc}</div>
        <div style="font-size:0.7rem; color:var(--text-muted);">Learner: ${t.user}</div>
      </div>
      <button style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.1rem; padding:0 4px;" onclick="this.closest('.toast-notification').classList.add('closing'); setTimeout(() => this.closest('.toast-notification').remove(), 300)">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 6 seconds
    setTimeout(() => {
      if (toast && toast.parentElement) {
        toast.classList.add('closing');
        setTimeout(() => toast.remove(), 300);
      }
    }, 6000);
    
    // Schedule next
    setTimeout(showNextToast, 20000 + Math.random() * 8000);
  }, 8000);
}
document.addEventListener('DOMContentLoaded', triggerMockToasts);

// 3. Sliding Action Drawer Actions (For teacher console dashboard.html)
function setupDrawerActions() {
  const ticketRows = document.querySelectorAll('.ticket-row');
  if (ticketRows.length === 0) return;

  // Create overlay and drawer container in HTML if not exists
  let overlay = document.querySelector('.drawer-overlay');
  let drawer = document.querySelector('.ticket-drawer');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    document.body.appendChild(overlay);
  }

  if (!drawer) {
    drawer = document.createElement('div');
    drawer.className = 'ticket-drawer';
    drawer.innerHTML = `
      <div class="drawer-header">
        <h3 style="font-family:var(--font-heading);font-weight:700;" id="drawerTicketId">#LEX-0000</h3>
        <button id="closeDrawerBtn" style="background:none;border:none;color:var(--text-secondary);font-size:1.5rem;cursor:pointer;">&times;</button>
      </div>
      <div class="drawer-body">
        <div style="margin-bottom:20px;">
          <span class="badge" id="drawerBadge">Status</span>
          <span class="badge" style="background:rgba(255,255,255,0.05);color:var(--text-secondary);margin-left:8px;" id="drawerPriority">Medium</span>
        </div>
        <div style="margin-bottom:24px;">
          <h4 style="font-size:0.85rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;font-weight:600;letter-spacing:0.05em;">Exercise Topic</h4>
          <p id="drawerSubject" style="font-size:1.05rem;font-weight:600;color:var(--text-primary);"></p>
        </div>
        <div style="margin-bottom:24px;">
          <h4 style="font-size:0.85rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;font-weight:600;letter-spacing:0.05em;">Student Submission</h4>
          <p id="drawerDesc" style="font-size:0.9rem;color:var(--text-secondary);line-height:1.6;white-space:pre-wrap;"></p>
        </div>
        <div style="margin-bottom:24px;">
          <h4 style="font-size:0.85rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;font-weight:600;letter-spacing:0.05em;">Student Info</h4>
          <p id="drawerUser" style="font-size:0.9rem;color:var(--text-primary);font-weight:500;"></p>
        </div>
        
        <div style="border-top:1px solid var(--border);padding-top:20px;margin-top:20px;">
          <h4 style="font-size:0.85rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:12px;font-weight:600;letter-spacing:0.05em;">Corrections Feed &amp; Feedback</h4>
          <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px;max-height:160px;overflow-y:auto;padding-right:4px;" id="drawerReplies">
            <div style="padding:10px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-sm);">
              <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;display:flex;justify-content:space-between;">
                <span>LingoFlow AI</span><span>10m ago</span>
              </div>
              <p style="font-size:0.82rem;color:var(--text-secondary);">Submission received and queued for manual Coach grading.</p>
            </div>
          </div>
          <div class="form-group">
            <textarea class="form-control" placeholder="Write corrections, grades, or feedback for the student..." id="drawerReplyText" style="min-height:80px;font-size:0.85rem;"></textarea>
          </div>
        </div>
      </div>
      <div class="drawer-footer">
        <button class="btn btn-outline btn-sm" id="btnUpdateStatus" style="flex:1;justify-content:center;">Approve &amp; Score</button>
        <button class="btn btn-primary btn-sm" id="btnSendReply" style="flex:1;justify-content:center;">Send Feedback</button>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  // Open drawer helper
  let activeRow = null;
  ticketRows.forEach(row => {
    row.addEventListener('click', () => {
      activeRow = row;
      const tid = row.getAttribute('data-id');
      const subject = row.getAttribute('data-subject');
      const desc = row.getAttribute('data-desc');
      const user = row.getAttribute('data-user');
      const priority = row.getAttribute('data-priority');
      const status = row.getAttribute('data-status');
      
      document.getElementById('drawerTicketId').textContent = tid;
      document.getElementById('drawerSubject').textContent = subject;
      document.getElementById('drawerDesc').textContent = desc;
      document.getElementById('drawerUser').textContent = user;
      document.getElementById('drawerPriority').textContent = priority + " Level";
      
      const badge = document.getElementById('drawerBadge');
      badge.textContent = status;
      
      // Update badge visual styling
      badge.className = 'badge ' + (status === 'Graded' || status === 'Resolved' ? 'badge-green' : (status === 'Pending' || status === 'Open' ? 'badge-red' : 'badge-orange'));
      
      // Reset replies
      const replies = document.getElementById('drawerReplies');
      replies.innerHTML = `
        <div style="padding:10px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:8px;">
          <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;display:flex;justify-content:space-between;">
            <span>LingoFlow AI</span><span>10m ago</span>
          </div>
          <p style="font-size:0.82rem;color:var(--text-secondary);">Submission received and queued for manual Coach grading.</p>
        </div>
      `;

      // Set resolve button text
      const btnResolve = document.getElementById('btnUpdateStatus');
      if (status === 'Graded' || status === 'Resolved') {
        btnResolve.textContent = 'Request Revision';
      } else {
        btnResolve.textContent = 'Approve & Score';
      }
      
      overlay.classList.add('open');
      drawer.classList.add('open');
    });
  });

  // Close drawer
  const closeBtn = document.getElementById('closeDrawerBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('open');
      drawer.classList.remove('open');
    });
  }
  overlay.addEventListener('click', () => {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
  });

  // Resolve action with animation
  const btnResolve = document.getElementById('btnUpdateStatus');
  if (btnResolve) {
    btnResolve.addEventListener('click', () => {
      if (!activeRow) return;
      const badge = activeRow.querySelector('.badge');
      const timer = activeRow.querySelector('.sla-timer');
      
      activeRow.classList.add('updating');
      
      setTimeout(() => {
        activeRow.classList.remove('updating');
        const currentStatus = badge.textContent.trim();
        
        if (currentStatus === 'Graded' || currentStatus === 'Resolved') {
          // Reopen
          badge.textContent = 'In Progress';
          badge.className = 'badge badge-orange';
          if (timer) {
            timer.textContent = '28m 15s';
            timer.className = 'sla-timer';
          }
          activeRow.classList.remove('resolved');
          btnResolve.textContent = 'Approve & Score';
          document.getElementById('drawerBadge').textContent = 'In Progress';
          document.getElementById('drawerBadge').className = 'badge badge-orange';
          activeRow.setAttribute('data-status', 'In Progress');
        } else {
          // Resolve
          badge.textContent = 'Graded';
          badge.className = 'badge badge-green';
          if (timer) {
            timer.textContent = 'Graded';
            timer.className = 'sla-timer';
          }
          activeRow.classList.add('resolved');
          btnResolve.textContent = 'Request Revision';
          document.getElementById('drawerBadge').textContent = 'Graded';
          document.getElementById('drawerBadge').className = 'badge badge-green';
          activeRow.setAttribute('data-status', 'Graded');
        }
      }, 550);
    });
  }

  // Send reply action
  const btnSend = document.getElementById('btnSendReply');
  const txtReply = document.getElementById('drawerReplyText');
  if (btnSend && txtReply) {
    btnSend.addEventListener('click', () => {
      const text = txtReply.value.trim();
      if (!text) return;
      
      const replies = document.getElementById('drawerReplies');
      const newReply = document.createElement('div');
      newReply.style.padding = '10px';
      newReply.style.background = 'var(--bg-glass2)';
      newReply.style.border = '1px solid var(--border)';
      newReply.style.borderRadius = 'var(--radius-sm)';
      newReply.style.marginTop = '8px';
      newReply.innerHTML = `
        <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;display:flex;justify-content:space-between;">
          <span>You (Language Coach)</span><span>Just now</span>
        </div>
        <p style="font-size:0.82rem;color:var(--text-primary);">${text}</p>
      `;
      
      replies.appendChild(newReply);
      txtReply.value = '';
      replies.scrollTop = replies.scrollHeight;
    });
  }
}
document.addEventListener('DOMContentLoaded', setupDrawerActions);

// 4. AI Chat Bot replies (for dashboard2.html student portal chatbot)
function setupAIChatBot() {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const messages = document.getElementById('chatMessages');

  if (!input || !sendBtn || !messages) return;

  function appendMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    input.value = '';

    // Show typing bouncing indicator
    const typing = document.createElement('div');
    typing.className = 'typing-dots chat-bubble bot';
    typing.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    // Simulated AI response based on keywords
    let response = "¡Hola! I am your LingoFlow AI Tutor. You can practice speaking with me, ask for grammar corrections, or say 'quiz' for a vocabulary challenge!";
    const query = text.toLowerCase();
    
    if (query.includes('hola') || query.includes('spanish') || query.includes('como')) {
      response = "¡Hola, amigo! ¿Cómo estás hoy? We can chat in Spanish. Tell me: ¿Qué te gusta hacer en tu tiempo libre?";
    } else if (query.includes('bonjour') || query.includes('french') || query.includes('comment')) {
      response = "Bonjour ! Comment ça va ? I can help you practice your French. Ask me about French grammar or vocabulary!";
    } else if (query.includes('hallo') || query.includes('german') || query.includes('wie')) {
      response = "Hallo! Wie geht es dir? Let's practice German. Try writing a sentence, and I will correct any grammar errors.";
    } else if (query.includes('quiz') || query.includes('vocab')) {
      response = "Vocabulary Quiz! What is the translation of 'The butterfly' in Spanish? \nA) El pájaro \nB) La mariposa \nC) El gato \n\n(Write your answer!)";
    } else if (query.includes('mariposa') || query.includes(' b')) {
      response = "¡Excelente! 'La mariposa' is indeed 'The butterfly'. +10 XP gained! Ready for another word?";
    } else if (query.includes('translate') || query.includes('how do you say')) {
      response = "To translate, simply tell me the phrase. For example: 'How do you say thank you in Italian?' -> It is 'Grazie'!";
    } else if (query.includes('grammar') || query.includes('conjugat')) {
      response = "Let's review verb conjugation! In Spanish, the verb 'hablar' (to speak) in present tense is: yo hablo, tú hablas, él/ella habla, nosotros hablamos, vosotros habláis, ellos/ellas hablan. Which verb should we conjugate next?";
    }

    setTimeout(() => {
      typing.remove();
      appendMessage(response, 'bot');
    }, 1200 + Math.random() * 800);
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}
document.addEventListener('DOMContentLoaded', setupAIChatBot);

