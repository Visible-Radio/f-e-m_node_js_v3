import { insertDB, saveDB, getDB } from './db.js';

export async function createNewNote(note, tags) {
  const newNote = {
    content: note,

    tags,
  };

  const newRecord = await insertDB('notes', newNote);
  return newRecord;
}

export async function getAllNotes() {
  const { notes } = await getDB();
  return notes;
}

export async function findNotes(searchString) {
  const { notes } = await getDB();

  return notes.filter(({ content }) => {
    const result = content.toLowerCase().includes(searchString.toLowerCase());
    return result;
  });
}

export async function removeNote(noteId) {
  const { notes, ...rest } = await getDB();
  const match = notes.find((note) => note.id === noteId);

  if (match) {
    const newNotes = notes.filter((note) => note.id !== noteId);
    await saveDB({ ...rest, notes: newNotes });
    return noteId;
  }
  return undefined;
}

export async function removeAllNotes() {
  const { notes, ...rest } = await getDB();
  await saveDB({ notes: [], ...rest });
  return notes.length;
}
