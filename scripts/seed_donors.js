const fs = require('fs');
const path = require('path');

const donorsFile = path.join(__dirname, '../data/donors.json');

const sampleDonors = [
  { name: 'Alice', amount: 50, date: '2025-10-25' },
  { name: 'Bob', amount: 100, date: '2025-10-24' },
  { name: 'Charlie', amount: 25, date: '2025-10-23' }
];

fs.writeFileSync(donorsFile, JSON.stringify(sampleDonors, null, 2));
console.log('✅ Donor wall seeded successfully.');
