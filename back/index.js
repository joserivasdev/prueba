const mysql = require("mysql");
const { promisify } = require("util");
const express = require("express");

//Configuración de la base de datos
const database = {
  host: "127.0.0.1", //localhost
  user: "root",
  password: "jose26423763",
  database: "prueba",
  port: 3306,
  charset: "utf8mb4",
};

const pool = mysql.createPool(database);

const dbConnection = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      return console.log(err);
    }

    if (connection) {
      connection.release();
    }

    console.log("Bases de datos online");
  });
};

//variable para hacer consultas
const dbQuery = promisify(pool.query).bind(pool);

//dbConnection();

//Iniciar el servidor
const app = express();

const serverPort = 3000;

app.route("/").get((req, res) => {
  //res.send("Hola mundo");
});

//Crear usuario
app.route("/usuarios").post(async () => {
  const { nombre, correo, password } = req.body;

  const usuario = {
    userName: nombre,
    userEmail: correo,
    userPassword: password,
  };

  try {
    await dbQuery("INSERT INTO usuarios SET ?", usuario);
    res.status(200).json({
      msg: "usuario creado",
      usuario,
    });
  } catch (error) {
    res.status(400);
  }
});

//Autenticar usuario
app.route("./usuarios/login").post(async (req, res) => {
  const { correo, password } = req.body;

  try {
    const userEmail = correo; 
    const [ respuesta ] = await dbQuery('SELECT * FROM usuarios WHERE userEmail = ?', userEmail );
    
    const usuarioExiste = { ...respuesta };

    const paresDeValores = Object.entries( usuarioExiste ).length;

    if( paresDeValores === 0 ){
    return res.status(400).json({
            msg: "Correo o contraseña incorrectos"
        });
    }
    if( password = usuarioExiste.userPassword ){
        return res.status(400).json({
            msg: "Correo o contraseña incorrectos"
        })
    }

    const token = await generarJWT( usuarioExiste.uid );

    if( token ) {
      res.status(200).cookie('SESSION_TOKEN', token ).json({
          logged: true 
     }); 
    }

} catch (error) {
    //aqui van los errores
    console.log(error);
}
});

app.listen(serverPort, () => {
  console.log(`Servidor corriendo en el puerto ${serverPort}`);
});
