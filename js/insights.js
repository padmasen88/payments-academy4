/* =============================================
   PAYMENTS ACADEMY 3.0 — DYNAMIC EXTENSIONS JS
   ============================================= */

(function () {
  'use strict';

  // Glossary database for tooltips
  const GLOSSARY_TOOLTIPS = {
    'ACH': 'Automated Clearing House — US batch net settlement system.',
    'RTGS': 'Real-Time Gross Settlement — instant interbank settlement individually.',
    'FedNow': 'Federal Reserve instant gross settlement rail launched 2023.',
    'PCI DSS': 'Payment Card Industry Data Security Standard.',
    'Interchange': 'Fee paid by acquirer to issuer during card clearing.',
    'Reg E': 'Regulation E — federal consumer electronic transfer rules.',
    'BSA': 'Bank Secrecy Act — US AML and reporting mandate.',
    'KYC': 'Know Your Customer — identity verification checks.',
    'Durbin': 'Durbin Amendment — interchange caps on debit transactions.',
    'ISO 20022': 'International XML/JSON data messaging standard.'
  };

  // Insights & References Database for all 7 modules
  const MODULE_EXTENSIONS = {
    '1': {
      insights: `
        <h3>💡 Practitioner Insights &amp; Case Studies</h3>
        <div class="trend-card">
          <h4>Interview Q&amp;A: Clearing vs. Settlement</h4>
          <p><strong>Question:</strong> "Explain to a product manager the difference between clearing and settlement, using a physical check example."</p>
          <p><strong>Answer:</strong> Clearing is the message exchange (writing checking parameters, scanning, and routing details between banks). Settlement is the actual cash transfer — moving bank reserve balances on Fed ledger files to resolve check debt.</p>
        </div>
        <div class="trend-card">
          <h4>Common Mistake: Ledger Deferral</h4>
          <p>Developers often mistake user app ledger updates (showing a balance increase) for actual money movement. If interbank settlement fails in the background, you face significant credit and reconciliation risk.</p>
        </div>
      `,
      references: `
        <h3>📚 References &amp; Adjacent Topics</h3>
        <ul class="sidebar-nav" style="background:none; border:none; padding:0;">
          <li><a href="https://www.nacha.org" target="_blank" style="padding:0.5rem 0;">Nacha Operating Rules &amp; Guidelines</a></li>
          <li><a href="https://www.frbservices.org" target="_blank" style="padding:0.5rem 0;">Federal Reserve Operating Circular 6 (Bills)</a></li>
        </ul>
      `
    },
    '2': {
      insights: `
        <h3>💡 Practitioner Insights &amp; Case Studies</h3>
        <div class="trend-card">
          <h4>Interview Q&amp;A: FedNow vs. Fedwire</h4>
          <p><strong>Question:</strong> "Why would a corporation use FedNow instead of Fedwire?"</p>
          <p><strong>Answer:</strong> Cost and availability. Fedwire costs more per message and closes on weekends. FedNow is open 24/7/365, settling transactions in under 10 seconds for fractions of a cent, though it has lower transaction limits.</p>
        </div>
        <div class="trend-card">
          <h4>Best Practice: Idempotency Keys</h4>
          <p>Always enforce unique idempotency keys in API headers for instant payment routing. In a timeout scenario, client retries must not execute duplicate reserve debits.</p>
        </div>
      `,
      references: `
        <h3>📚 References &amp; Adjacent Topics</h3>
        <ul class="sidebar-nav" style="background:none; border:none; padding:0;">
          <li><a href="https://www.iso20022.org" target="_blank" style="padding:0.5rem 0;">ISO 20022 Message Schema Library</a></li>
          <li><a href="https://www.frbservices.org/financial-services/fednow" target="_blank" style="padding:0.5rem 0;">FedNow Service Circular 12 Regulations</a></li>
        </ul>
      `
    },
    '3': {
      insights: `
        <h3>💡 Practitioner Insights &amp; Case Studies</h3>
        <div class="trend-card">
          <h4>Interview Q&amp;A: Apple Pay Tokenization</h4>
          <p><strong>Question:</strong> "Does Apple Pay store my actual credit card number?"</p>
          <p><strong>Answer:</strong> No. Apple Pay swaps the PAN for a Device PAN (DPAN) in the secure enclave. During transaction authorization, the network Token Service Provider decrypts the DPAN back to PAN for the issuer.</p>
        </div>
      `,
      references: `
        <h3>📚 References &amp; Adjacent Topics</h3>
        <ul class="sidebar-nav" style="background:none; border:none; padding:0;">
          <li><a href="https://www.emvco.com" target="_blank" style="padding:0.5rem 0;">EMVco Payment Tokenization Specifications</a></li>
        </ul>
      `
    },
    '4': {
      insights: `
        <h3>💡 Practitioner Insights &amp; Case Studies</h3>
        <div class="trend-card">
          <h4>Interview Q&amp;A: The 4-Party Loop</h4>
          <p><strong>Question:</strong> "How does the issuer earn money in a card payment?"</p>
          <p><strong>Answer:</strong> Through Interchange. When the cardholder spends, the issuer retains a percentage fee (e.g. 1.8%) from the settlement file, transferring the remainder to the acquirer.</p>
        </div>
      `,
      references: `
        <h3>📚 References &amp; Adjacent Topics</h3>
        <ul class="sidebar-nav" style="background:none; border:none; padding:0;">
          <li><a href="https://usa.visa.com" target="_blank" style="padding:0.5rem 0;">Visa Core Rules and Policy Manuals</a></li>
        </ul>
      `
    },
    '5': {
      insights: `
        <h3>💡 Practitioner Insights &amp; Case Studies</h3>
        <div class="trend-card">
          <h4>Interview Q&amp;A: Friendly Fraud</h4>
          <p><strong>Question:</strong> "What is friendly fraud, and how do you mitigate it?"</p>
          <p><strong>Answer:</strong> Friendly fraud occurs when a cardholder legitimately purchases an item but disputes the charge anyway. Mitigation requires submitting compelling evidence (device IP, delivery photo, matching signatures).</p>
        </div>
      `,
      references: `
        <h3>📚 References &amp; Adjacent Topics</h3>
        <ul class="sidebar-nav" style="background:none; border:none; padding:0;">
          <li><a href="https://www.pcisecuritystandards.org" target="_blank" style="padding:0.5rem 0;">PCI Security Standards Directory</a></li>
        </ul>
      `
    },
    '6': {
      insights: `
        <h3>💡 Practitioner Insights &amp; Case Studies</h3>
        <div class="trend-card">
          <h4>Interview Q&amp;A: Durbin Capping Exemptions</h4>
          <p><strong>Question:</strong> "Why do some challenger banks issue free debit accounts?"</p>
          <p><strong>Answer:</strong> Smaller banks (under $10B in assets) are exempt from Durbin interchange caps. They collect ~1.5% interchange on card spend rather than the capped $0.22, funding consumer accounts.</p>
        </div>
      `,
      references: `
        <h3>📚 References &amp; Adjacent Topics</h3>
        <ul class="sidebar-nav" style="background:none; border:none; padding:0;">
          <li><a href="https://www.consumerfinance.gov" target="_blank" style="padding:0.5rem 0;">CFPB Regulation E Compliance Codes</a></li>
        </ul>
      `
    },
    '7': {
      insights: `
        <h3>💡 Practitioner Insights &amp; Case Studies</h3>
        <div class="trend-card">
          <h4>Interview Q&amp;A: Stablecoin Reserves</h4>
          <p><strong>Question:</strong> "What makes a stablecoin 'stable'?"</p>
          <p><strong>Answer:</strong> Collateral reserves. Standard stablecoins (like USDC) back tokenized coins 1:1 with short-term US treasuries and cash held in segregated custodian bank ledgers.</p>
        </div>
      `,
      references: `
        <h3>📚 References &amp; Adjacent Topics</h3>
        <ul class="sidebar-nav" style="background:none; border:none; padding:0;">
          <li><a href="https://www.bis.org" target="_blank" style="padding:0.5rem 0;">BIS Project mBridge corridor frameworks</a></li>
        </ul>
      `
    }
  };

  // Add styles for Glossary Tooltips dynamically
  function addTooltipStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      .glossary-term {
        border-bottom: 1px dashed var(--accent-teal);
        cursor: help;
        position: relative;
        display: inline-block;
      }
      .glossary-term::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        background: #040810;
        border: 1px solid var(--border-accent);
        color: #fff;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.75rem;
        width: 200px;
        white-space: normal;
        display: none;
        z-index: 100;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
      }
      .glossary-term:hover::after {
        display: block;
      }
    `;
    document.head.appendChild(style);
  }

  // Inject tabs and panels
  function injectTabs() {
    const quizWrapper = document.querySelector('.quiz-wrapper');
    if (!quizWrapper) return;
    
    const moduleId = quizWrapper.dataset.module;
    const moduleData = MODULE_EXTENSIONS[moduleId];
    if (!moduleData) return;

    const tabsContainer = document.querySelector('.chapter-tabs');
    const panelsContainer = document.getElementById(tabsContainer.dataset.panels);
    if (!tabsContainer || !panelsContainer) return;

    // 1. Insert Tabs before Assessment tab button
    const assessTab = tabsContainer.querySelector('[data-tab="assessment"]');
    
    const insightsTab = document.createElement('button');
    insightsTab.className = 'chapter-tab';
    insightsTab.dataset.tab = 'insights';
    insightsTab.innerHTML = '💡 Insights';
    
    const refsTab = document.createElement('button');
    refsTab.className = 'chapter-tab';
    refsTab.dataset.tab = 'references';
    refsTab.innerHTML = '📚 References';

    tabsContainer.insertBefore(insightsTab, assessTab);
    tabsContainer.insertBefore(refsTab, assessTab);

    // 2. Insert Panels before Assessment panel
    const assessPanel = panelsContainer.querySelector('[data-tab="assessment"]');

    const insightsPanel = document.createElement('div');
    insightsPanel.className = 'chapter-panel';
    insightsPanel.dataset.tab = 'insights';
    insightsPanel.innerHTML = `<div class="content-section" data-section-id="insights" id="insights">${moduleData.insights}</div>`;

    const refsPanel = document.createElement('div');
    refsPanel.className = 'chapter-panel';
    refsPanel.dataset.tab = 'references';
    refsPanel.innerHTML = `<div class="content-section" data-section-id="references" id="references">${moduleData.references}</div>`;

    panelsContainer.insertBefore(insightsPanel, assessPanel);
    panelsContainer.insertBefore(refsPanel, assessPanel);

    // 3. Add to sidebar navigation
    const aside = document.querySelector('aside');
    if (aside) {
      const assessmentHeader = aside.querySelector('.sidebar-title:last-of-type');
      const assessmentList = aside.querySelector('.sidebar-nav:last-of-type');
      
      if (assessmentHeader && assessmentList) {
        const extraNav = document.createElement('ul');
        extraNav.className = 'sidebar-nav';
        extraNav.innerHTML = `
          <li><a href="#insights" data-section="insights">Module Insights</a></li>
          <li><a href="#references" data-section="references">Module References</a></li>
        `;
        aside.insertBefore(extraNav, assessmentHeader);
      }
    }
  }

  // Simple string replacer to add tooltips in main copy text
  function addGlossaryTooltips() {
    const panels = document.querySelectorAll('.chapter-panel p, .chapter-panel li');
    panels.forEach(el => {
      let html = el.innerHTML;
      Object.keys(GLOSSARY_TOOLTIPS).forEach(term => {
        const regex = new RegExp(`\\b(${term})\\b`, 'g');
        html = html.replace(regex, `<span class="glossary-term" data-tooltip="${GLOSSARY_TOOLTIPS[term]}">$1</span>`);
      });
      el.innerHTML = html;
    });
  }

  // Boot
  function bootInsights() {
    addTooltipStyles();
    injectTabs();
    // Wrap after tab injection
    setTimeout(addGlossaryTooltips, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootInsights);
  } else {
    bootInsights();
  }
})();
