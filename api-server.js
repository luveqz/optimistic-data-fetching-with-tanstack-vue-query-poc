import express from "express";
import cors from "cors";

import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = join(__dirname, "books.json");

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Helper function to read the JSON file
async function readBooks() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write to the JSON file
async function writeBooks(books) {
  await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2));
}

// GET /books - Returns a list of books
app.get("/books", async (req, res) => {
  const books = await readBooks();
  res.json(books);
});

// POST /books - Creates a new book
app.post("/books", async (req, res) => {
  const books = await readBooks();
  const newBook = {
    id: books.length + 1,
    ...req.body,
  };
  books.push(newBook);
  await writeBooks(books);
  res.status(201).json(newBook);
});

// PATCH /books/{id} - Edits a book
app.patch("/books/:id", async (req, res) => {
  const books = await readBooks();
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books[bookIndex] = { ...books[bookIndex], ...req.body };
  await writeBooks(books);
  res.json(books[bookIndex]);
});

// DELETE /books/{id} - Deletes a book
app.delete("/books/:id", async (req, res) => {
  const books = await readBooks();
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books.splice(bookIndex, 1);
  await writeBooks(books);
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
