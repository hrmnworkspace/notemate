import { db } from './firebase.js';
import {
  ref, push, onValue, remove, update
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const notesRef = ref(db, 'notes');

// Add note
document.getElementById('addBtn').addEventListener('click', () => {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  if (!title && !content) return;

  push(notesRef, {
    title: title || 'Untitled',
    content,
    createdAt: Date.now()
  });

  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
  document.getElementById('modal').style.display = 'none';
});

// Listen & render notes
onValue(notesRef, (snapshot) => {
  const grid = document.getElementById('notesGrid');
  grid.innerHTML = '';
  if (!snapshot.exists()) {
    grid.innerHTML = '<p class="empty-msg">No notes yet. Click + to add one.</p>';
    return;
  }
  const notes = [];
  snapshot.forEach(child => notes.push({ id: child.key, ...child.val() }));
  notes.sort((a, b) => b.createdAt - a.createdAt);
  notes.forEach(note => renderNote(note, grid));
});

function renderNote(note, container) {
  const card = document.createElement('div');
  card.className = 'note-card';
  card.innerHTML = `
    <div class="note-top">
      <h3 class="note-title">${escapeHtml(note.title)}</h3>
      <div class="note-actions">
        <button class="icon-btn edit-btn" data-id="${note.id}" title="Edit">✏️</button>
        <button class="icon-btn del-btn" data-id="${note.id}" title="Delete">🗑</button>
      </div>
    </div>
    <p class="note-content">${escapeHtml(note.content)}</p>
    <span class="note-date">${new Date(note.createdAt).toLocaleDateString()}</span>
  `;
  container.appendChild(card);
}

// Edit
document.getElementById('notesGrid').addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('del-btn')) {
    if (confirm('Delete this note?')) remove(ref(db, 'notes/' + id));
  }

  if (e.target.classList.contains('edit-btn')) {
    const card = e.target.closest('.note-card');
    const title = card.querySelector('.note-title').textContent;
    const content = card.querySelector('.note-content').textContent;
    document.getElementById('noteTitle').value = title === 'Untitled' ? '' : title;
    document.getElementById('noteContent').value = content;
    document.getElementById('modal').style.display = 'flex';

    document.getElementById('addBtn').onclick = () => {
      const newTitle = document.getElementById('noteTitle').value.trim();
      const newContent = document.getElementById('noteContent').value.trim();
      update(ref(db, 'notes/' + id), {
        title: newTitle || 'Untitled',
        content: newContent
      });
      document.getElementById('noteTitle').value = '';
      document.getElementById('noteContent').value = '';
      document.getElementById('modal').style.display = 'none';
      resetAddBtn();
    };
  }
});

function resetAddBtn() {
  const btn = document.getElementById('addBtn');
  btn.onclick = () => {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    if (!title && !content) return;
    push(notesRef, { title: title || 'Untitled', content, createdAt: Date.now() });
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('modal').style.display = 'none';
  };
}

// Modal open/close
document.getElementById('fab').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'flex';
});
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
  resetAddBtn();
});

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}