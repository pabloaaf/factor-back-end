const getSchemaKeys = model => {
  const filterWords = ['__v', 'id', '_id'];
  filterWords.forEach(word => delete model.schema.tree[word]);

  const schemaKeys = Object.keys(model.schema.tree);

  return schemaKeys;
};

module.exports = getSchemaKeys;
