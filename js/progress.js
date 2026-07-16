/**
 * progress.js — Payments Academy v4
 * Shared learner progress tracker.
 * - Reads/writes active pathway to localStorage
 * - On module pages: injects a "Your Progress" sidebar widget
 */

(function () {
  'use strict';

  // ── Data ────────────────────────────────────────────────────────────────────

  const MODULE_METADATA = {
    'm1': { name: 'Module 1: Foundation',             short: 'Foundation',           file: 'module1.html', seq: 1 },
    'm2': { name: 'Module 2: Payments Infrastructure', short: 'Infrastructure',       file: 'module2.html', seq: 2 },
    'm3': { name: 'Module 3: Consumer Payments',       short: 'Consumer Payments',    file: 'module3.html', seq: 3 },
    'm4': { name: 'Module 4: Card Payments',           short: 'Card Payments',        file: 'module4.html', seq: 4 },
    'm5': { name: 'Module 5: Risk & Fraud',            short: 'Risk & Fraud',         file: 'module5.html', seq: 5 },
    'm6': { name: 'Module 6: Compliance & Regulation', short: 'Compliance',           file: 'module6.html', seq: 6 },
    'm7': { name: 'Module 7: Innovation',              short: 'Innovation',           file: 'module7.html', seq: 7 }
  };

  const PATHWAYS = {
    'level': {
      key: 'level',
      title: 'Level-Based Sequence',
      icon: '🗺️',
      modules: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7']
    },
    'PM': {
      key: 'PM',
      title: 'Product Manager Pathway',
      icon: '🎯',
      modules: ['m1', 'm3', 'm4', 'm6']
    },
    'Eng': {
      key: 'Eng',
      title: 'Software Engineer Pathway',
      icon: '⚙️',
      modules: ['m1', 'm2', 'm4', 'm7']
    }
  };

  // ── Storage helpers ──────────────────────────────────────────────────────────

  function getCompleted() {
    return JSON.parse(localStorage.getItem('pa_completed') || '[]');
  }

  function getActivePathway() {
    return localStorage.getItem('pa_active_pathway') || null;
  }

  function setActivePathway(key) {
    localStorage.setItem('pa_active_pathway', key);
  }

  function markModuleComplete(modId) {
    const done = getCompleted();
    if (!done.includes(modId)) {
      done.push(modId);
      localStorage.setItem('pa_completed', JSON.stringify(done));
    }
  }

  // Detect which module page we're on by filename
  function getCurrentModuleId() {
    const page = window.location.pathname.split('/').pop();
    for (const [id, meta] of Object.entries(MODULE_METADATA)) {
      if (meta.file === page) return id;
    }
    return null;
  }

  // ── Progress calculation ─────────────────────────────────────────────────────

  function calcProgress(pathwayKey) {
    const pathway = PATHWAYS[pathwayKey];
    if (!pathway) return { done: 0, total: 0, pct: 0, nextModule: null };
    const completed = getCompleted();
    const done = pathway.modules.filter(m => completed.includes(m)).length;
    const total = pathway.modules.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const nextModule = pathway.modules.find(m => !completed.includes(m)) || null;
    return { done, total, pct, nextModule };
  }

  // ── Sidebar widget (module pages only) ───────────────────────────────────────

  function injectSidebarWidget() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return; // not a module page

    const activeKey = getActivePathway();
    const currentModId = getCurrentModuleId();
    const completed = getCompleted();

    // Build the widget HTML
    const widget = document.createElement('div');
    widget.id = 'pa-progress-widget';
    widget.style.cssText = `
      margin-top: 2rem;
      padding: 1.25rem;
      background: rgba(99,102,241,0.06);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 12px;
      font-family: 'Outfit', sans-serif;
    `;

    if (!activeKey) {
      // No pathway selected yet
      widget.innerHTML = `
        <div style="font-size:0.7rem;font-weight:800;color:#6366f1;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.6rem;">Your Progress</div>
        <p style="font-size:0.78rem;color:var(--text-muted);line-height:1.4;margin-bottom:0.8rem;">
          Select a learning pathway to track your progress and get personalised next steps.
        </p>
        <a href="pathways.html" style="display:block;text-align:center;font-size:0.75rem;font-weight:700;padding:0.45rem 0.8rem;background:var(--grad-indigo);color:#fff;border-radius:8px;text-decoration:none;">
          Choose a Pathway →
        </a>
      `;
    } else {
      const pathway = PATHWAYS[activeKey];
      const { done, total, pct, nextModule } = calcProgress(activeKey);

      const moduleNodes = pathway.modules.map((modId) => {
        const meta = MODULE_METADATA[modId];
        const isDone = completed.includes(modId);
        const isCurrent = modId === currentModId;
        const color = isDone ? '#2dd4bf' : isCurrent ? '#6366f1' : 'rgba(255,255,255,0.15)';
        const textColor = isDone || isCurrent ? '#fff' : 'var(--text-muted)';
        const label = meta.seq;
        return `
          <a href="${meta.file}" title="${meta.name}" style="text-decoration:none;">
            <div style="width:30px;height:30px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:800;color:${textColor};transition:all 0.2s;border:2px solid ${isDone ? '#2dd4bf' : isCurrent ? '#6366f1' : 'rgba(255,255,255,0.1)'};">
              ${isDone ? '✓' : label}
            </div>
          </a>
        `;
      }).join('<div style="width:12px;height:2px;background:rgba(255,255,255,0.1);align-self:center;margin-top:-4px;"></div>');

      widget.innerHTML = `
        <div style="font-size:0.7rem;font-weight:800;color:#6366f1;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.6rem;">Your Progress</div>
        <div style="font-size:0.82rem;font-weight:700;color:var(--text-primary);margin-bottom:0.25rem;">${pathway.icon} ${pathway.title}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.85rem;">${done} of ${total} modules complete</div>

        <!-- Progress bar -->
        <div style="height:5px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden;margin-bottom:1rem;">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#6366f1,#2dd4bf);border-radius:99px;transition:width 0.4s ease;"></div>
        </div>

        <!-- Step nodes -->
        <div style="display:flex;align-items:center;gap:4px;flex-wrap:nowrap;margin-bottom:1rem;overflow-x:auto;padding-bottom:4px;">
          ${moduleNodes}
        </div>

        <!-- Next step -->
        ${nextModule ? `
          <div style="font-size:0.68rem;color:var(--text-muted);margin-bottom:0.3rem;font-weight:600;">UP NEXT</div>
          <a href="${MODULE_METADATA[nextModule].file}" style="display:block;font-size:0.75rem;font-weight:700;padding:0.4rem 0.75rem;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:8px;color:#fff;text-decoration:none;transition:background 0.2s;">
            ${MODULE_METADATA[nextModule].short} →
          </a>
        ` : `
          <div style="font-size:0.75rem;font-weight:700;color:#2dd4bf;text-align:center;padding:0.4rem;">🎉 Pathway Complete!</div>
        `}

        <!-- Change path link -->
        <a href="pathways.html" style="display:block;text-align:center;font-size:0.68rem;color:var(--text-muted);margin-top:0.75rem;text-decoration:none;opacity:0.7;">
          Change Pathway
        </a>
      `;
    }

    // Append at bottom of sidebar
    const lastDivider = sidebar.querySelector('.sidebar-divider:last-of-type');
    if (lastDivider) {
      lastDivider.after(widget);
    } else {
      sidebar.appendChild(widget);
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  window.PA = window.PA || {};
  window.PA.progress = {
    getCompleted,
    getActivePathway,
    setActivePathway,
    markModuleComplete,
    calcProgress,
    PATHWAYS,
    MODULE_METADATA
  };

  // ── Init ─────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    injectSidebarWidget();
  });

})();
