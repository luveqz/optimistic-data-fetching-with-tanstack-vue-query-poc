const BASE_URL = "http://localhost:3000";

export type Book = {
  id: number;
  title: string;
  author: string;
  publishedYear: number;
};

export default {
  books: {
    list(): Promise<Book[]> {
      return fetch(`${BASE_URL}/books`).then((response) => response.json());
    },
    add(book: Book): Promise<Book["id"]> {
      return fetch(`${BASE_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      }).then((response) => response.json());
    },
  },
};
