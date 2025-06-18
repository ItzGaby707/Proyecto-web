DROP DATABASE IF EXISTS usuarios;
CREATE DATABASE usuarios;
use usuarios;


CREATE TABLE usuario (
  idUsuario INT NOT NULL AUTO_INCREMENT,
  USERNAME VARCHAR(45) NOT NULL,
  PASSWORD VARCHAR(45) NOT NULL,
  TIPOUSUARIO ENUM('administrador', 'usuario') NOT NULL,
  PRIMARY KEY (idUsuario)
);
CREATE TABLE figuras (
  idFigura INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE preguntas (
  idPregunta INT AUTO_INCREMENT PRIMARY KEY,
  pregunta TEXT NOT NULL,
  idFigura INT NOT NULL,
  FOREIGN KEY (idFigura) REFERENCES figuras(idFigura)
);
CREATE TABLE ejercicios (
    idEjercicio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    creadoPor INT,
    FOREIGN KEY (creadoPor) REFERENCES usuario(idUsuario)
);
CREATE TABLE ejercicio_pregunta (
    idEjercicio INT,
    idPregunta INT,
    orden INT, 
    PRIMARY KEY (idEjercicio, idPregunta),
    FOREIGN KEY (idEjercicio) REFERENCES ejercicios(idEjercicio),
    FOREIGN KEY (idPregunta) REFERENCES preguntas(idPregunta)
);



INSERT INTO usuario (USERNAME, PASSWORD, TIPOUSUARIO)
VALUES ('admin', '1234', 'administrador'),
       ('usuario', '123456', 'usuario');

INSERT INTO figuras (nombre)
VALUES ('Circulo'), ('Cuadrado'), ('Triangulo'), ('Rombo'),
       ('Rectangulo'), ('Trapecio'), ('Cometa'), ('Hexagono'),('Pentagono'),('Semicirculo');
       
INSERT INTO preguntas (idPregunta, pregunta, idFigura) VALUES
(1, '¿Puedes representar el círculo?', 1),
(2, '¿Puedes representar el cuadrado?', 2),
(3, '¿Puedes representar el triángulo?', 3),
(4, '¿Puedes representar el rombo?', 4),
(5, '¿Puedes representar el rectángulo?', 5),
(6, '¿Puedes representar el trapecio?', 6),
(7, '¿Puedes representar el cometa?', 7),
(8, '¿Puedes representar el hexágono?', 8),
(9, '¿Puedes representar el pentágono?', 9),
(10, '¿Puedes representar el semicírculo?', 10);


INSERT INTO ejercicios (idEjercicio, nombre, descripcion, creadoPor) VALUES
(1, 'Figuras mixtas A', 'Ejercicio con preguntas 1 a 5', 1),
(2, 'Figuras mixtas B', 'Ejercicio con preguntas 6 a 10', 1),
(3, 'Formas geométricas combinadas', 'Ejercicio con mezcla de figuras', 1),
(4, 'Comprobación básica', 'Figuras pares por idPregunta', 1),
(5, 'Ejercicio introductorio', 'Combinación simple para empezar', 1);

INSERT INTO ejercicio_pregunta (idEjercicio, idPregunta, orden) VALUES
(1, 1, 1), (1, 2, 2), (1, 3, 3), (1, 4, 4), (1, 5, 5),
(2, 6, 1), (2, 7, 2), (2, 8, 3), (2, 9, 4), (2,10, 5),
(3, 1, 1), (3, 3, 2), (3, 5, 3), (3, 7, 4), (3, 9, 5),
(4, 2, 1), (4, 4, 2), (4, 6, 3), (4, 8, 4), (4,10, 5),
(5, 1, 1), (5, 6, 2), (5, 3, 3), (5, 9, 4), (5, 8, 5);




    
    
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
FLUSH PRIVILEGES;