// scripts/import-events.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to import events...');

  // 1. قراءة ملف JSON
  const filePath = path.join(process.cwd(), 'data', 'events.json');
  const eventsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  if (!Array.isArray(eventsData) || eventsData.length === 0) {
    console.log('No events found in events.json. Exiting.');
    return;
  }

  console.log(`Found ${eventsData.length} events in the JSON file.`);

  // 2. (اختياري) تنظيف جدول الأحداث القديم قبل الإضافة
  console.log('Clearing existing events from the database...');
  await prisma.event.deleteMany({});
  console.log('Existing events cleared.');

  // 3. إضافة البيانات الجديدة
  // Prisma's createMany is highly optimized for this
  console.log('Inserting new events into the database...');
  const result = await prisma.event.createMany({
    data: eventsData,
  });

  console.log(`Successfully inserted ${result.count} new events.`);
  console.log('Import finished.');
}

main()
  .catch((e) => {
    console.error('An error occurred during the import process:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });