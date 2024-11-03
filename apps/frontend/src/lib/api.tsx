const BACKEND_URL = "http://localhost:3000/";

async function getAllBooks() {
  const response = await fetch(`${BACKEND_URL}books/`);
  const data = await response.json();
  return data;
}

export { getAllBooks };
