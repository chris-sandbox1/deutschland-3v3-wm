/* ============================================================
   Fan-Voting – Firebase Realtime Database
   Votes werden global in Firebase gespeichert und per onValue()
   in Echtzeit für alle Besucher synchronisiert.
   localStorage trackt nur, ob dieser Browser bereits abgestimmt hat.
   ============================================================ */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getDatabase, ref, onValue, runTransaction } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js';

const firebaseConfig = {
  apiKey:            "AIzaSyBVlhi6rzHL89rrD62g9Nl3e7Ukg2iM6q8",
  authDomain:        "deutschland-3v3-wm.firebaseapp.com",
  databaseURL:       "https://deutschland-3v3-wm-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "deutschland-3v3-wm",
  storageBucket:     "deutschland-3v3-wm.firebasestorage.app",
  messagingSenderId: "568662887834",
  appId:             "1:568662887834:web:f5f7f1c4cf25d63bfd3e23"
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

document.querySelectorAll('.poll').forEach(pollEl => {
  const pollKey = pollEl.dataset.poll;
  if (!pollKey) return;

  const userVoteKey = 'poll_uservote_' + pollKey;
  let userVote = localStorage.getItem(userVoteKey);
  let votes = {};

  // --- DOM aufbauen (Label + Balken + Prozent) ---
  const optionButtons = pollEl.querySelectorAll('.poll-option');
  optionButtons.forEach(btn => {
    const val   = btn.dataset.value;
    const label = btn.textContent.trim();
    votes[val]  = 0;
    btn.innerHTML = `
      <div class="option-bar" data-bar="${val}"></div>
      <div class="option-content">
        <span class="option-label">${label}</span>
        <span class="my-vote-badge">Mein Vote</span>
        <span class="option-pct" data-pct="${val}">0%</span>
      </div>
    `;
  });

  const statusEl = pollEl.querySelector('.poll-status');

  function totalVotes() {
    return Object.values(votes).reduce((s, v) => s + v, 0);
  }

  function renderResults(animate) {
    const total = totalVotes();
    optionButtons.forEach(btn => {
      const val   = btn.dataset.value;
      const count = votes[val] || 0;
      const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
      const bar   = btn.querySelector('.option-bar');
      const pctEl = btn.querySelector('.option-pct');
      if (pctEl) pctEl.textContent = pct + '%';
      if (bar) {
        if (animate) {
          setTimeout(() => { bar.style.transform = `scaleX(${pct / 100})`; }, 80);
        } else {
          bar.style.transition = 'none';
          bar.style.transform  = `scaleX(${pct / 100})`;
        }
      }
    });
    if (statusEl) {
      const t = totalVotes();
      statusEl.textContent = t + ' Stimme' + (t !== 1 ? 'n' : '') + ' abgegeben';
      if (userVote) statusEl.textContent += ' · Du hast bereits abgestimmt';
    }
  }

  function applyVotedState(votedVal) {
    pollEl.classList.add('voted');
    optionButtons.forEach(btn => {
      btn.disabled = true;
      btn.classList.toggle('my-vote', btn.dataset.value === votedVal);
    });

    // "Stimme zurücknehmen"-Button einfügen falls noch nicht vorhanden
    if (!pollEl.querySelector('.poll-undo-btn')) {
      const undoBtn = document.createElement('button');
      undoBtn.className    = 'poll-undo-btn';
      undoBtn.textContent  = 'Stimme zurücknehmen';

      undoBtn.addEventListener('click', () => {
        // Firebase: Stimme dekrementieren (min. 0)
        runTransaction(
          ref(db, 'polls/' + pollKey + '/' + votedVal),
          current => Math.max(0, (current || 1) - 1)
        );

        // localStorage: User-Vote entfernen
        localStorage.removeItem(userVoteKey);
        userVote = null;

        // UI-Zustand zurücksetzen
        pollEl.classList.remove('voted');
        optionButtons.forEach(btn => {
          btn.disabled = false;
          btn.classList.remove('my-vote');
        });
        undoBtn.remove();
        // renderResults() wird automatisch durch den onValue-Listener ausgelöst
      });

      pollEl.appendChild(undoBtn);
    }
  }

  // --- Firebase Echtzeit-Listener ---
  onValue(ref(db, 'polls/' + pollKey), snapshot => {
    // Lokale votes zurücksetzen, dann Firebase-Daten einlesen
    optionButtons.forEach(btn => { votes[btn.dataset.value] = 0; });
    const data = snapshot.val() || {};
    Object.keys(data).forEach(k => {
      if (votes[k] !== undefined) votes[k] = data[k];
    });
    renderResults(true);
  });

  // Falls dieser Browser bereits abgestimmt hat: Voted-State sofort anwenden
  if (userVote) {
    applyVotedState(userVote);
  }

  // --- Klick-Handler ---
  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (pollEl.classList.contains('voted')) return;
      const val = btn.dataset.value;

      // Firebase: Stimme atomar inkrementieren
      runTransaction(
        ref(db, 'polls/' + pollKey + '/' + val),
        current => (current || 0) + 1
      );

      // localStorage: merken welche Option gewählt wurde
      localStorage.setItem(userVoteKey, val);
      userVote = val;

      applyVotedState(val);
    });
  });
});
