const { seedFilamentData } = require('../src/utils/seedFilamentData.js');

seedFilamentData().then(() => {
  console.log('✅ Seeding complete');
  process.exit(0);
});
