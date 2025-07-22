// cleanup-database.js
// Run this script to fix the duplicate key error: node cleanup-database.js

const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

async function cleanupDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rainbow_education');
    console.log('Connected to MongoDB');

    // Get the database
    const db = mongoose.connection.db;
    
    console.log('\n=== FIXING COURSE PAYMENTS COLLECTION ===');
    
    // 1. Drop the problematic index
    try {
      await db.collection('coursepayments').dropIndex('transactionId_1');
      console.log('✓ Dropped problematic transactionId_1 index');
    } catch (error) {
      console.log('Index might not exist, continuing...');
    }
    
    // 2. Clear all existing course payment records (since they're test data)
    const deleteResult = await db.collection('coursepayments').deleteMany({});
    console.log(`✓ Cleared ${deleteResult.deletedCount} existing payment records`);
    
    // 3. Create new proper indexes
    await db.collection('coursepayments').createIndex({ orderCode: 1 }, { unique: true });
    console.log('✓ Created unique index on orderCode');
    
    await db.collection('coursepayments').createIndex({ userId: 1 });
    console.log('✓ Created index on userId');
    
    await db.collection('coursepayments').createIndex({ status: 1 });
    console.log('✓ Created index on status');
    
    // Create sparse index on transactionId (allows multiple nulls)
    await db.collection('coursepayments').createIndex(
      { transactionId: 1 }, 
      { sparse: true, name: 'transactionId_sparse' }
    );
    console.log('✓ Created sparse index on transactionId');
    
    console.log('\n=== CHECKING OTHER COLLECTIONS ===');
    
    // Check if users collection has duplicate email index issue
    try {
      const userIndexes = await db.collection('users').indexes();
      const emailIndexes = userIndexes.filter(idx => 
        JSON.stringify(idx.key).includes('email')
      );
      
      if (emailIndexes.length > 1) {
        console.log('⚠ Warning: Multiple email indexes found in users collection');
        console.log('Consider dropping duplicate indexes to remove warnings');
      } else {
        console.log('✓ Users collection indexes look good');
      }
    } catch (error) {
      console.log('Could not check user indexes:', error.message);
    }
    
    console.log('\n=== CLEANUP COMPLETE ===');
    console.log('✓ Database cleanup successful');
    console.log('✓ PayOS payment creation should work now');
    console.log('\nYou can now restart your server and test payments again.');
    
  } catch (error) {
    console.error('Cleanup failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run cleanup
cleanupDatabase();