import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  createNewNote,
  findNotes,
  getAllNotes,
  removeAllNotes,
  removeNote,
} from './notes.js';
import { startServer } from './server.js';

yargs(hideBin(process.argv))
  .command(
    'new <note>',
    'create a new note',
    (yargs) => {
      return yargs.positional('note', {
        describe: 'The content of the note you want to create',
        type: 'string',
      });
    },
    async (argv) => {
      const tags = argv?.tags ? argv.tags.split(',') : [];
      const newNote = await createNewNote(argv.note, tags);
      console.log(`Created ${newNote.id}`);
      return newNote;
    }
  )
  .option('tags', {
    alias: 't',
    type: 'string',
    description: 'tags to add to the note',
  })
  .command(
    'all',
    'get all notes',
    () => {},
    async (argv) => {
      console.log(await getAllNotes());
    }
  )
  .command(
    'find <filter>',
    'get matching notes',
    (yargs) => {
      return yargs.positional('filter', {
        describe:
          'The search term to filter notes by, will be applied to note.content',
        type: 'string',
      });
    },
    async (argv) => {
      const found = await findNotes(argv.filter);
      console.log(found);
      return found;
    }
  )
  .command(
    'remove <id>',
    'remove a note by id',
    (yargs) => {
      return yargs.positional('id', {
        type: 'string',
        description: 'The id of the note you want to remove',
      });
    },
    async (argv) => {
      const deletedId = await removeNote(argv.id);
      if (deletedId) {
        console.log(`Deleted ${deletedId}`);
      }
      return undefined;
    }
  )
  .command(
    'web [port]',
    'launch website to see notes',
    (yargs) => {
      return yargs.positional('port', {
        describe: 'port to bind on',
        default: 5000,
        type: 'number',
      });
    },
    async (argv) => {
      startServer(argv.port);
    }
  )
  .command(
    'clean',
    'remove all notes',
    () => {},
    async (argv) => {
      const count = await removeAllNotes();
      console.log(`Removed ${count} notes`);
    }
  )
  .demandCommand(1)
  .parse();
