// Select elements
const form = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const categorySelect = document.querySelector('#note-category');
const searchInput = document.querySelector('#search-input');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');
const errorMessage = document.querySelector('#error-message');
const clearAllButton = document.querySelector('#clear-all');

const STORAGE_KEY = 'quicknotes';

// Notes array: each note has id, text, category, createdAt
let notes = loadNotes();

function loadNotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function updateCount() {
  if (notes.length === 0) {
    noteCount.textContent = 'You have no notes yet.';
  } else if (notes.length === 1) {
    noteCount.textContent = 'You have 1 note.';
  } else {
    noteCount.textContent = 'You have ' + notes.length + ' notes.';
  }
}

function render() {
  notesList.replaceChildren();
  updateCount();

  const searchWords = searchInput.value.trim().toLowerCase();
  const visibleNotes = notes.filter(function (note) {
    return note.text.toLowerCase().includes(searchWords);
  });

  if (notes.length > 0 && visibleNotes.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'No notes match your search.';
    empty.className = 'empty-message';
    notesList.appendChild(empty);
    return;
  }

  visibleNotes.forEach(function (note) {
    const li = document.createElement('li');
    li.className = 'note category-' + note.category.toLowerCase();

    const text = document.createElement('p');
    text.textContent = note.text;

    const meta = document.createElement('div');
    meta.className = 'note-meta';

    const label = document.createElement('span');
    label.className = 'category-label';
    label.textContent = note.category;

    const date = document.createElement('span');
    date.textContent = note.createdAt;

    meta.appendChild(label);
    meta.appendChild(date);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
      deleteNote(note.id);
    });

    li.appendChild(text);
    li.appendChild(meta);
    li.appendChild(deleteButton);
    notesList.appendChild(li);
  });
}

function deleteNote(id) {
  notes = notes.filter(function (note) {
    return note.id !== id;
  });
  saveNotes();
  render();
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const text = noteInput.value.trim();

  if (text === '') {
    errorMessage.textContent = 'Please type a note first.';
    return;
  }
  if (text.length > 200) {
    errorMessage.textContent = 'Notes must be 200 characters or fewer.';
    return;
  }

  errorMessage.textContent = '';

  const note = {
    id: Date.now(),
    text: text,
    category: categorySelect.value,
    createdAt: new Date().toLocaleString()
  };

  notes.push(note);
  saveNotes();
  noteInput.value = '';
  render();
});

searchInput.addEventListener('input', render);

// Bonus: clear all
clearAllButton.addEventListener('click', function () {
  if (notes.length === 0) {
    return;
  }
  if (confirm('Delete all notes?')) {
    notes = [];
    saveNotes();
    render();
  }
});

render();
