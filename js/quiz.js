/* ============================================================
   QUIZ ENGINE — quiz.js
   Dynamic assessment system for Payments Academy
   ============================================================ */
(function () {
  'use strict';

  const QUIZ_SIZE  = 10;
  const PASS_SCORE = 8; // 80%

  const QB_MAP = {
    '1': () => window.QB_M1,
    '2': () => window.QB_M2,
    '3': () => window.QB_M3,
    '4': () => window.QB_M4,
    '5': () => window.QB_M5,
    '6': () => window.QB_M6,
    '7': () => window.QB_M7,
  };

  /* ── Helpers ── */
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ── Main init per container ── */
  function initQuiz(container) {
    const mod     = container.dataset.module;
    const getBank = QB_MAP[mod];
    if (!getBank) return;
    const bank = getBank();
    if (!bank || !bank.length) return;

    let questions = [];
    let current   = 0;
    let score     = 0;
    let answers   = []; // {chosen, correct, isCorrect}

    function sample() {
      questions = shuffle(bank).slice(0, QUIZ_SIZE);
      current = 0; score = 0; answers = [];
    }

    /* ── START SCREEN ── */
    function renderStart() {
      container.innerHTML = `
        <div class="qz-start">
          <div class="qz-start-icon">🎯</div>
          <h2 class="qz-start-title">Module ${mod} Assessment</h2>
          <p class="qz-start-desc">Test your knowledge with <strong>10 randomly selected questions</strong> drawn from a bank of <strong>${bank.length}</strong>. Each attempt is unique. A score of <strong>80% or higher</strong> (8 out of 10) is required to pass.</p>
          <div class="qz-stats-row">
            <div class="qz-stat"><span class="qz-stat-val">${bank.length}</span><span class="qz-stat-lbl">Question Bank</span></div>
            <div class="qz-stat"><span class="qz-stat-val">10</span><span class="qz-stat-lbl">Per Attempt</span></div>
            <div class="qz-stat"><span class="qz-stat-val">80%</span><span class="qz-stat-lbl">Pass Score</span></div>
            <div class="qz-stat"><span class="qz-stat-val">∞</span><span class="qz-stat-lbl">Attempts</span></div>
          </div>
          <button class="qz-btn qz-btn-primary" id="qz-start">Start Assessment →</button>
        </div>`;
      container.querySelector('#qz-start').onclick = () => { sample(); renderQ(); };
    }

    /* ── QUESTION SCREEN ── */
    function renderQ() {
      const q    = questions[current];
      const OPTS = ['A','B','C','D'];
      const pct  = (current / QUIZ_SIZE) * 100;

      container.innerHTML = `
        <div class="qz-q-screen">
          <div class="qz-prog-wrap"><div class="qz-prog-bar" style="width:${pct}%"></div></div>
          <div class="qz-meta-row">
            <span class="qz-counter">Question <strong>${current + 1}</strong> / ${QUIZ_SIZE}</span>
            <span class="qz-live-score">Score: ${score}/${current}</span>
          </div>
          <div class="qz-q-card">
            <div class="qz-q-badge">Q${current + 1}</div>
            <p class="qz-q-text">${q.q}</p>
          </div>
          <div class="qz-options" id="qz-opts">
            ${q.options.map((opt, i) => `
              <button class="qz-opt" data-i="${i}">
                <span class="qz-opt-letter">${OPTS[i]}</span>
                <span class="qz-opt-text">${opt}</span>
              </button>`).join('')}
          </div>
          <div class="qz-explanation" id="qz-exp" style="display:none"></div>
          <div class="qz-nav" id="qz-nav" style="display:none">
            <button class="qz-btn qz-btn-primary" id="qz-next">
              ${current === QUIZ_SIZE - 1 ? 'View Results →' : 'Next Question →'}
            </button>
          </div>
        </div>`;

      container.querySelectorAll('.qz-opt').forEach(btn => {
        btn.onclick = () => handleAnswer(+btn.dataset.i);
      });
    }

    /* ── HANDLE ANSWER ── */
    function handleAnswer(idx) {
      const q = questions[current];
      const ok = (idx === q.answer);
      if (ok) score++;
      answers.push({ chosen: idx, correct: q.answer, isCorrect: ok });

      container.querySelectorAll('.qz-opt').forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer) btn.classList.add('qz-opt-correct');
        if (i === idx && !ok) btn.classList.add('qz-opt-wrong');
      });

      const exp = container.querySelector('#qz-exp');
      exp.style.display = 'block';
      exp.innerHTML = `
        <div class="qz-exp-inner ${ok ? 'qz-exp-ok' : 'qz-exp-err'}">
          <div class="qz-exp-ico">${ok ? '✅' : '❌'}</div>
          <div><strong>${ok ? 'Correct!' : 'Incorrect.'}</strong><p>${q.explanation}</p></div>
        </div>`;

      const nav = container.querySelector('#qz-nav');
      nav.style.display = 'flex';
      nav.querySelector('#qz-next').onclick = () => {
        current++;
        if (current >= QUIZ_SIZE) renderResults();
        else renderQ();
      };
    }

    function renderResults() {
      const pct    = Math.round((score / QUIZ_SIZE) * 100);
      const passed = score >= PASS_SCORE;
      const OPTS   = ['A','B','C','D'];
      const C      = 339.29; // circumference r=54
      const dash   = (pct / 100) * C;

      // ── Mark module complete in progress tracker on pass ──
      if (passed && window.PA && window.PA.progress) {
        window.PA.progress.markModuleComplete('m' + mod);
      }

      container.innerHTML = `
        <div class="qz-results">
          <div class="qz-badge ${passed ? 'qz-badge-pass' : 'qz-badge-fail'}">
            ${passed ? '🏆 PASSED' : '📚 NOT PASSED'}
          </div>

          <div class="qz-ring-wrap">
            <svg viewBox="0 0 120 120" class="qz-ring">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="10"/>
              <circle cx="60" cy="60" r="54" fill="none"
                stroke="${passed ? '#10b981' : '#f43f5e'}" stroke-width="10"
                stroke-dasharray="${dash} ${C - dash}"
                stroke-linecap="round" transform="rotate(-90 60 60)"
                style="transition:stroke-dasharray 1s ease"/>
            </svg>
            <div class="qz-ring-text">
              <span class="qz-ring-score">${score}/${QUIZ_SIZE}</span>
              <span class="qz-ring-pct">${pct}%</span>
            </div>
          </div>

          <p class="qz-result-msg">
            ${passed
              ? '🎉 Excellent work — you\'ve demonstrated strong command of this material.'
              : `You need ${PASS_SCORE - score} more correct answer${PASS_SCORE - score > 1 ? 's' : ''} to pass. Review the explanations below and try again.`}
          </p>

          <div class="qz-review-hdr">📋 Question Review — click any item to expand</div>
          <div class="qz-review-list">
            ${answers.map((ua, i) => {
              const q = questions[i];
              return `
                <div class="qz-rev-item ${ua.isCorrect ? 'qz-rev-ok' : 'qz-rev-err'}">
                  <div class="qz-rev-hdr">
                    <span class="qz-rev-ico">${ua.isCorrect ? '✅' : '❌'}</span>
                    <span class="qz-rev-q">Q${i+1}: ${q.q}</span>
                    <span class="qz-rev-chevron">›</span>
                  </div>
                  <div class="qz-rev-body">
                    <p><strong>Your answer:</strong> ${OPTS[ua.chosen]}. ${q.options[ua.chosen]}</p>
                    ${!ua.isCorrect ? `<p><strong>Correct answer:</strong> ${OPTS[ua.correct]}. ${q.options[ua.correct]}</p>` : ''}
                    <p class="qz-rev-exp">${q.explanation}</p>
                  </div>
                </div>`;
            }).join('')}
          </div>

          <button class="qz-btn qz-btn-primary qz-retry" id="qz-retry">🔄 Try Again with New Questions</button>
        </div>`;

      container.querySelectorAll('.qz-rev-item').forEach(el => {
        el.querySelector('.qz-rev-hdr').onclick = () => el.classList.toggle('qz-rev-open');
      });
      container.querySelector('#qz-retry').onclick = renderStart;
    }

    renderStart();
  }

  /* ── Boot ── */
  function boot() {
    document.querySelectorAll('.quiz-wrapper[data-module]').forEach(initQuiz);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
