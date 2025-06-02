var admin = require("firebase-admin");
const { response, request } = require("express");

var serviceAccount = require("./herramientassoft-3755d-firebase-adminsdk-fbsvc-51285f2253.json");
const { error } = require("console");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const database = admin.firestore();

const bibliotecaREF = database.collection("biblioteca");

// Funcion para obtener todos los libros de la coleccion "biblioteca"

const getBooks = async (req = request, res = response) => {
  try {
    const resultSet = await bibliotecaREF.get();
    if (resultSet.empty) {
      return res.status(404).json({
        message: "No hay datos en la colección."
      });
    }
    
    const books = [];
    resultSet.forEach((doc) => {
      books.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los libros",
      error
    });
  }
}

// Funcion para obtener un libro por id

const getBooksById = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const doc = await bibliotecaREF.doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        message: "Libro no encontrado"
      });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el libro",
      error
    });
  }
}

// Función para añadir un libro a la colección "biblioteca"

const addBook = async (req = request, res = response) => {
  try {
    const book = req.body;
    const docRef = await bibliotecaREF.add(book);
    res.status(200).json({
      message: "se ha creado un libro exitosamente",
      id: docRef.id,
    })
  } catch (error) {
    res.status(500).json({
      message: "Error al añadir un libro",
      error
    })
  }

}

// Funcion para actualizar un libro por id

const updateBookById = async (req = request, res = response) => {
  const { id } = req.params;
  const bookData = req.body;

  try {
    await bibliotecaREF.doc(id).update(bookData);
    res.status(200).json({
      message: "Libro actualizado exitosamente"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el libro",
      error
    });
  }
}

// Funcion para eliminar un libro por id
const deleteBookById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    await bibliotecaREF.doc(id).delete();
    res.status(200).json({
      message: "Libro eliminado exitosamente"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el libro",
      error
    });
  }
}

module.exports = {
  addBook,
  getBooks,
  getBooksById,
  updateBookById,
  deleteBookById
}