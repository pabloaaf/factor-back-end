const { invalidEntryError } = require('./useError.help');

const entryContainsSchema = (entry, schemaKeys) => {
  entry = Object.keys(entry);

  const filtered = entry.filter(key => schemaKeys.indexOf(key) !== -1);

  if (entry.length !== filtered.length) {
    invalidEntryError();
  }

  return false;
};

module.exports = entryContainsSchema;
