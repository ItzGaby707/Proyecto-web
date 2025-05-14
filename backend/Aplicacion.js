let http = require('http');
let url = require('url');
let mysql = require('mysql');

http.createServer(function (request, response) 
{
  response.setHeader('Access-Control-Allow-Origin','*');
  response.writeHead(200, {'Content-Type': 'text/html'});
  let q = url.parse(request.url, true).query;
  let user=q.User;
  console.log("user:"+user);
  let password=q.password;
  console.log("password:"+password);
  let tipousuario; 
  let respuesta;

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "usuarios"  
  });
  
  con.connect(function(err) 
  {
    if (err) throw err;
    console.log("CONECTADO!");
    con.query("SELECT * FROM login WHERE USERNAME='"+user+"' AND PASSWORD='"+password+"'", function (err, result, fields) 
    {
      if (err) throw err;
        console.log("CONECTADO2!");
        if (result.length>0)
        {
          console.log("CONECTADO21!");
          console.log(result[0].USERNAME);
          console.log(result[0].PASSWORD); 
          console.log(result[0].TIPOUSUARIO); 
          tipousuario=result[0].TIPOUSUARIO;
        if(user==result[0].USERNAME && password==result[0].PASSWORD)
        {
          console.log("Correcto, devolviendo usuario");
          respuesta = {status:"yes",tipo:tipousuario, user:user};
          response.end(JSON.stringify(respuesta));
      } 
        else
        {
          console.log("Incorrecto, devolviendo estatus!");
          respuesta = {status:"no",tipo:"nodefinido"};
          console.log(JSON.stringify(respuesta)); 
          response.end(JSON.stringify(respuesta));     
        }  
        }
        else
        {
          console.log("Incorrecto, devolviendo estatus!");
          respuesta = {status:"no",tipo:"nodefinido"};
          console.log(JSON.stringify(respuesta)); 
          response.end(JSON.stringify(respuesta));     
        }
      });  
  });
}).listen(9999, () => {
  console.log("backend corriendo en el 9999");
});
