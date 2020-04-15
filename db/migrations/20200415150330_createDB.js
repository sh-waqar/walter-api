exports.up = (knex) => {
  const User = knex.schema.createTable('User', (t) => {
    t.increments('id').primary();

    t.string('name').notNullable();
    t.string('email').unique().notNullable();
    t.string('password').notNullable();

    t.datetime('createdAt');
    t.datetime('updatedAt');
  });

  const Account = knex.schema.createTable('Account', (t) => {
    t.increments('id').primary();

    t.string('name').notNullable();
    t.string('currency').notNullable();
    t.string('color').notNullable();
    t.float('balance').notNullable();
    t.integer('userId').unsigned().references('User.id').notNullable();

    t.datetime('createdAt');
    t.datetime('updatedAt');
  });

  const Record = knex.schema.createTable('Record', (t) => {
    t.increments('id').primary();

    t.float('amount').notNullable();
    t.string('description');
    t.string('expenseType').notNullable();
    t.datetime('timestamp').notNullable();
    t.integer('accountId').unsigned().references('Account.id').notNullable();
    t.integer('categoryId').unsigned().references('Category.id').notNullable();

    t.datetime('createdAt');
    t.datetime('updatedAt');
  });

  const Category = knex.schema.createTable('Category', (t) => {
    t.increments('id').primary();

    t.string('name').notNullable();
    t.string('icon');
    t.string('expenseType').notNullable();
    t.boolean('isVisible').notNullable();
    t.integer('userId').unsigned().references('User.id');

    t.datetime('createdAt');
    t.datetime('updatedAt');
  });

  const Label = knex.schema.createTable('Label', (t) => {
    t.increments('id').primary();

    t.string('name').notNullable();
    t.string('color').notNullable();
    t.integer('userId').unsigned().references('User.id').notNullable();

    t.datetime('createdAt');
    t.datetime('updatedAt');
  });

  const RecordLabel = knex.schema.createTable('RecordLabel', (t) => {
    t.increments('id').primary();

    t.integer('recordId').unsigned().references('Record.id').notNullable();
    t.integer('labelId').unsigned().references('Label.id').notNullable();
  });

  return Promise.all([User, Account, Record, Category, Label, RecordLabel]);
};

exports.down = (knex) => {
  return Promise.all([
    knex.schema.dropTable('User'),
    knex.schema.dropTable('Account'),
    knex.schema.dropTable('Record'),
    knex.schema.dropTable('Category'),
    knex.schema.dropTable('Label'),
    knex.schema.dropTable('RecordLabel'),
  ]);
};
