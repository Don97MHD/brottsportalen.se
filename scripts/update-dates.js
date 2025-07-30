// scripts/update-dates.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// دالة مساعدة لتغيير سنة التاريخ إلى السنة الحالية
function shiftDateToCurrentYear(isoDateString) {
  const date = new Date(isoDateString);
  const currentYear = new Date().getFullYear();
  date.setFullYear(currentYear);
  return date;
}

async function main() {
  console.log('Starting to update event dates to the current year...');

  // 1. جلب كل الأحداث من قاعدة البيانات
  const allEvents = await prisma.event.findMany();

  if (allEvents.length === 0) {
    console.log('No events found in the database. Nothing to update.');
    return;
  }

  console.log(`Found ${allEvents.length} events. Proceeding with date updates...`);

  let updatedCount = 0;
  // 2. المرور على كل حدث وتحديث تاريخه
  for (const event of allEvents) {
    const newDate = shiftDateToCurrentYear(event.datetime);
    
    // 3. حفظ التغيير في قاعدة البيانات
    await prisma.event.update({
      where: { id: event.id },
      data: { datetime: newDate },
    });
    updatedCount++;
    console.log(`Updated event ${event.id} to date ${newDate.toISOString()}`);
  }

  console.log('-------------------------------------------');
  console.log(`Successfully updated the dates for ${updatedCount} events.`);
  console.log('Date update process finished.');
}

main()
  .catch((e) => {
    console.error('An error occurred during the date update process:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });