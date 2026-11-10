import { Body, Controller, Delete,Get, Param, Patch, Post } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(Number(id));
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Patch(':id')
update(
  @Param('id') id: string,
  @Body() updateBookDto: UpdateBookDto,
) {
  return this.booksService.update(Number(id), updateBookDto);
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.booksService.remove(Number(id));
}
}