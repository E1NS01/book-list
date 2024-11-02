-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- Insert Tolkien Books
INSERT INTO "Book" (title) VALUES 
    ('The Hobbit'),
    ('The Fellowship of the Ring'),
    ('The Two Towers'),
    ('The Return of the King');

