
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
      tbl.increments(); //id field
      tbl.text('fname', 128).notNullable();
      tbl.text('lname', 128).notNullable();
      tbl.text('phono', 128).notNullable();
      tbl.text('email', 255).notNullable().unique();
      tbl.text('DOB', 128).notNullable();

      tbl.timestamps(true, true);
    })
    .createTable('works', tbl => {
        tbl.increments()  //id field
        tbl.string('title').notNullable().index();
        tbl.text('description').notNullable();
        tbl.timestamps(true, true);

        // Foreign key info to users table
        tbl.integer('users_id').unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExits('users').dropTableIfExits('works')
};

