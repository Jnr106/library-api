import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const librarianName = process.env.LIBRARIAN_NAME;
  const librarianEmail = process.env.LIBRARIAN_EMAIL;
  const librarianPassword = process.env.LIBRARIAN_PASSWORD;

  if (!librarianName || !librarianEmail || !librarianPassword) {
    throw new Error('Missing librarian environment variables.');
  }

    // Create or update the librarian account
    const hashedPassword = await bcrypt.hash(librarianPassword, 12);

  await prisma.user.upsert({
    where: {
      email: process.env.LIBRARIAN_EMAIL,
    },
    update: {
      name: process.env.LIBRARIAN_NAME,
      password: hashedPassword,
      role: 'LIBRARIAN',
    },
    create: {
      name: process.env.LIBRARIAN_NAME,
      email: process.env.LIBRARIAN_EMAIL,
      password: hashedPassword,
      role: 'LIBRARIAN',
    },
  });
  // Create the three genres
  const fiction = await prisma.genre.upsert({
    where: { name: 'Fiction' },
    update: {},
    create: { name: 'Fiction' },
  });

  const technology = await prisma.genre.upsert({
    where: { name: 'Technology' },
    update: {},
    create: { name: 'Technology' },
  });

  const business = await prisma.genre.upsert({
    where: { name: 'Business' },
    update: {},
    create: { name: 'Business' },
  });

  // Sample books
  const books = [
    { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '9780385474542', publishedYear: 1958, genreId: fiction.id },
    { title: 'The Alchemist', author: 'Paulo Coelho', isbn: '9780061122415', publishedYear: 1988, genreId: fiction.id },
    { title: 'Americanah', author: 'Chimamanda Ngozi Adichie', isbn: '9780307455925', publishedYear: 2013, genreId: fiction.id },
    { title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', isbn: '9781400095209', publishedYear: 2006, genreId: fiction.id },

    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', publishedYear: 2008, genreId: technology.id },
    { title: 'The Pragmatic Programmer', author: 'David Thomas and Andrew Hunt', isbn: '9780135957059', publishedYear: 2019, genreId: technology.id },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '9780262046305', publishedYear: 2022, genreId: technology.id },

    { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', isbn: '9781612680194', publishedYear: 1997, genreId: business.id },
    { title: 'Think and Grow Rich', author: 'Napoleon Hill', isbn: '9781585424337', publishedYear: 1937, genreId: business.id },
    { title: 'The Lean Startup', author: 'Eric Ries', isbn: '9780307887894', publishedYear: 2011, genreId: business.id },
  ];

  // Insert books without creating duplicates
  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: book,
    });
  }

  console.log('Seed completed successfully!');
  console.log('3 genres and 10 books are available in the database.');
  console.log('Librarian account created or updated.');
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });