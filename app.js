const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { addBook, getBooks, getBooksById, updateBookById, deleteBookById } = require("./index.js");

const app = express();
const port = 3000;

// Configuración de Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Biblioteca Firebase",
      version: "1.0.0",
      description: "API para gestionar libros en una biblioteca",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./app.js", "./index.js"], // Archivos donde están tus rutas y controladores
};

const specs = swaggerJsdoc(options);

// Middleware
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rutas con documentación Swagger
/**
 * @swagger
 * /:
 *   get:
 *     summary: Endpoint de prueba
 *     responses:
 *       200:
 *         description: Devuelve un mensaje de Hello World
 */
app.get('/', (req, res) => {
  res.send('Hello World!')
});

/**
 * @swagger
 * /libros:
 *   get:
 *     summary: Obtener todos los libros
 *     responses:
 *       200:
 *         description: Lista de todos los libros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Libro'
 *       404:
 *         description: No hay libros en la colección
 *       500:
 *         description: Error al obtener los libros
 */
app.get('/libros', getBooks);

/**
 * @swagger
 * /libros/{id}:
 *   get:
 *     summary: Obtener un libro por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del libro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 *       404:
 *         description: Libro no encontrado
 *       500:
 *         description: Error al obtener el libro
 */
app.get('/libros/:id', getBooksById);

/**
 * @swagger
 * /agregar:
 *   post:
 *     summary: Agregar un nuevo libro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoLibro'
 *     responses:
 *       200:
 *         description: Libro creado exitosamente
 *       500:
 *         description: Error al añadir el libro
 */
app.post('/agregar', addBook);

/**
 * @swagger
 * /actualizar/{id}:
 *   put:
 *     summary: Actualizar un libro existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoLibro'
 *     responses:
 *       200:
 *         description: Libro actualizado exitosamente
 *       500:
 *         description: Error al actualizar el libro
 */
app.put('/actualizar/:id', updateBookById);

/**
 * @swagger
 * /eliminar/{id}:
 *   delete:
 *     summary: Eliminar un libro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Libro eliminado exitosamente
 *       500:
 *         description: Error al eliminar el libro
 */
app.delete('/eliminar/:id', deleteBookById);

// Definiciones de esquemas para Swagger
/**
 * @swagger
 * components:
 *   schemas:
 *     Libro:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID del libro
 *         titulo:
 *           type: string
 *           description: Título del libro
 *         autor:
 *           type: string
 *           description: Autor del libro
 *         año:
 *           type: integer
 *           description: Año de publicación
 *         genero:
 *           type: string
 *           description: Género literario
 *       example:
 *         id: abc123
 *         titulo: Cien años de soledad
 *         autor: Gabriel García Márquez
 *         año: 1967
 *         genero: Realismo mágico
 *     NuevoLibro:
 *       type: object
 *       properties:
 *         titulo:
 *           type: string
 *           description: Título del libro
 *         autor:
 *           type: string
 *           description: Autor del libro
 *         año:
 *           type: integer
 *           description: Año de publicación
 *         genero:
 *           type: string
 *           description: Género literario
 *       required:
 *         - titulo
 *         - autor
 *       example:
 *         titulo: El principito
 *         autor: Antoine de Saint-Exupéry
 *         año: 1943
 *         genero: Literatura infantil
 */

// Server
app.listen(port, () => {
  console.log("Servidor corriendo en el puerto", port);
  console.log(`Documentación Swagger disponible en http://localhost:${port}/api-docs`);
});