import { APIError } from "./errors";

const BACKEND_URL = "http://localhost:3000/";

async function getAllBooks() {
  try {
    const response = await fetch(`${BACKEND_URL}books/`, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new APIError(
        "Failed to fetch books",
        response.status,
        await response.json().catch(() => null)
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError("Network error occurred", undefined, error);
  }
}

export { getAllBooks };
