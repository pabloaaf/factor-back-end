const { entryEmptyError } = require('./useError.help');

const isEntryEmpty = Entry => {
  if (Object.keys(Entry).length === 0) {
    entryEmptyError();
  }
  return false;
};

module.exports = isEntryEmpty;
