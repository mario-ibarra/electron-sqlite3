const knex = require('knex');
const { Database } = require('sqlite3');
const config = require('../knexfile')
const db = knex(config.development)



module.exports = {
    add,
    listAll,
    findByName,
    update,
    remove
};


async function add(data){
    return await db("users")
            .insert(data)
            .then((rows) => {
                return rows;
            })
            
}

async function listAll(){
    return await db.select().table('users')
    .then((rows) => {
        return rows;
    })

}

function findByName(name) {
   db.from('users').select().where({name:name})
    .then((rows) => {
        for (row of rows) {
            console.log(`${row['fname']} ${row['lname']}`);
        }
    })
    .catch((err) => { console.log( err); throw err })
    .finally(() => {
        db.destroy();
    });
     
}


async function remove(id){
    return await db.from('users').del().where({id})
}


async function update(id, data){
    return await db('users')
    .where({'id':id})
    .update({
        'fname':data.fname,
        'lname':data.lname,
        'phono':data.phono,
        'email':data.email,
        'DOB':data.DOB
    })
}

