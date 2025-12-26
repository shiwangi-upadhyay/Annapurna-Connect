// prisma.config.ts
import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

// This line forces it to read your .env file
dotenv.config();

export default defineConfig({
  datasource: {
    // Now this will actually have a value
    url: process.env.DATABASE_URL,
  },
  schema: "prisma/schema.prisma",
});