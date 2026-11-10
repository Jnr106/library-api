
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  // Retrieve all books
  findAll() {
    return this.prisma.book.findMany({
      include: {
        genre: true,
      },
    });
  }

  // Retrieve one book by ID
async findOne(id: number) {
  const book = await this.prisma.book.findUnique({
    where: { id },
    include: {
      genre: true,
    },
  });

  if (!book) {
    throw new NotFoundException(`Book with ID ${id} not found`);
  }

  return book;
}

  // Create a new book
  create(createBookDto: CreateBookDto) {
    return this.prisma.book.create({
      data: createBookDto,
      include: {
        genre: true,
      },
    });
  }

  // Update an existing book
  update(id: number, updateBookDto: UpdateBookDto) {
    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
      include: {
        genre: true,
      },
    });
  }

  // Delete an existing book
  remove(id: number) {
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
