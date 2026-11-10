
import { describe, it, expect, vi } from 'vitest';

vi.mock('../prisma/prisma.service.js', () => ({
  PrismaService: class PrismaService {},
}));

import { BooksService } from './books.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';

describe('BooksService', () => {
  it('should be defined', () => {
    const mockPrisma = {} as PrismaService;
    const service = new BooksService(mockPrisma);

    expect(service).toBeDefined();
  });
});
