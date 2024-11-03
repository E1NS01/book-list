import { useState, useEffect } from "react";
import { Book, columns } from "@/components/Booklist/columns";
import { DataTable } from "@/components/Booklist/DataTable";
import { getAllBooks } from "@/lib/api";

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getAllBooks();
      console.log(data);
      setBooks(data);
    };

    fetchBooks();

    const interval = setInterval(() => {
      fetchBooks();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={books} />
    </div>
  );
}

export default App;
