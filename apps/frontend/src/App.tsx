import { columns } from "@/components/Booklist/columns";
import { DataTable } from "@/components/Booklist/DataTable";
import { Toaster } from "./components/ui/toaster";
import { Loader2 } from "lucide-react";
import { useBooks } from "@/hooks/use-books";

function App() {
  const { books, isLoading } = useBooks({
    onError: (error) => {
      console.error("Failed to fetch books:", error);
    },
  });

  return (
    <main>
      <div className="container mx-auto py-10">
        {isLoading && books.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <DataTable columns={columns} data={books} />
        )}
      </div>
      <Toaster />
    </main>
  );
}

export default App;
