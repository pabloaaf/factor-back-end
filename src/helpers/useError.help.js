const invalidEntryError = () => {
  const InvalidEntryError = new Error();
  InvalidEntryError.message = 'Entry data is not valid';
  InvalidEntryError.name = 'InvalidEntry';
  throw InvalidEntryError;
};

const invalidIdError = () => {
  const InvalidIdError = new Error();
  InvalidIdError.message = 'ID does not exist';
  InvalidIdError.name = 'InvalidID';
  throw InvalidIdError;
};

const entryEmptyError = () => {
  const EntryEmptyError = new Error();
  EntryEmptyError.message = 'Entry contains no content';
  EntryEmptyError.name = 'NoContent';
  throw EntryEmptyError;
};

module.exports = {
  invalidEntryError,
  invalidIdError,
  entryEmptyError
};
