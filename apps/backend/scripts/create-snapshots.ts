#!/usr/bin/env ts-node

import SnapshotService from 'services/snapshot.service';

async function createSnapshots() {
  // Get date from command line arguments
  const dateArg = process.argv[2];

  // Get account IDs (everything after the date)
  const accountIds: number[] = process.argv[3]
    ? process.argv.slice(3).map((id) => parseInt(id))
    : [];

  if (!dateArg) {
    console.error(
      'Usage: npm run create-snapshots <date> <accountId1> [accountId2] [accountId3] ...',
    );
    console.error('Example: npm run create-snapshots 2025-08-17 1 2 5');
    process.exit(1);
  }

  // Validate account IDs are numbers
  if (accountIds.length > 0 && accountIds.some((id) => isNaN(id))) {
    console.error('All account IDs must be valid numbers');
    process.exit(1);
  }

  // Validate date format (yyyy-mm-dd)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateArg)) {
    console.error('Invalid date format. Please use yyyy-mm-dd format.');
    console.error('Example: 2025-08-17');
    process.exit(1);
  }

  try {
    const snapshotService = new SnapshotService();
    await snapshotService.createTodaySnapshots(
      dateArg,
      accountIds ?? undefined,
    );
  } catch (error) {
    console.error('Failed to create snapshots:', error);
    process.exit(1);
  }
}

createSnapshots();
