import { ColumnDef } from "@tanstack/react-table";

export type Book = {
  id: number;
  title: string;
};

export const columns: ColumnDef<Book>[] = [
  { accessorKey: "id", header: "id" },
  { accessorKey: "title", header: "Title" },
];
