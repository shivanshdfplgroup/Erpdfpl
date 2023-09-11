// const { Pool, Client } = require('pg');

// // Create a connection pool


// const connectToDB = async () => {

//     const pool = new Pool({
//         user: 'postgres',
//         host: 'localhost',
//         database: 'test',
//         password: 'postgres',
//         port: 5432,
//     });

    
//     try {
//         await pool.connect();
//         console.log('Connected with Main DB');
    
//     }catch (err) {
//         console.log(err);
//   }
// };

// module.exports = connectToDB;