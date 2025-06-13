DROP DATABASE IF EXISTS usuarios;
CREATE DATABASE usuarios;
use usuarios;

CREATE TABLE usuario (
 idUsuario INT NOT NULL AUTO_INCREMENT,
 USERNAME VARCHAR(45) NULL ,
 PASSWORD VARCHAR(45) NULL ,
 TIPOUSUARIO VARCHAR(45) NULL,
 PRIMARY KEY (idUsuario) );
INSERT INTO usuario (USERNAME, PASSWORD, TIPOUSUARIO) VALUES ('admin', '1234','administrador');
INSERT INTO usuario (USERNAME, PASSWORD, TIPOUSUARIO) VALUES ('usuario', '123456','usuario');

CREATE TABLE preguntas(
	idPregunta int not null auto_increment,
    pregunta varchar(45) null,
    respuesta varchar(45) null,
    primary key (idPregunta));
    
    
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
FLUSH PRIVILEGES;
