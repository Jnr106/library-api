
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  // Retrieve, filter, search and paginate books
  findAll(
    genreId?: number,
    search?: string,
    page = 1,
    limit = 10,
  ) {
    if (genreId !== undefined && (!Number.isInteger(genreId) || genreId < 1)) {
      throw new BadRequestException('genreId must be a positive integer');
    }

    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException(
        'Page must be positive and limit must be between 1 and 100',
      );
    }

    return this.prisma.book.findMany({
      where: {
        ...(genreId !== undefined && { genreId }),
        ...(search && {
          OR: [
            {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              author: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
      skip: (page - 1) * limit,
      take: limit,
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
