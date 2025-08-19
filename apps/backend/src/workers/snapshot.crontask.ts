import cron from 'node-cron';
import SnapshotService from 'services/snapshot.service';

// Every day at 1am
cron.schedule('0 1 * * *', async () => {
  console.log('Running snapshot crontask every day at 1am');
  try {
    const snapshotService = new SnapshotService();
    await snapshotService.createTodaySnapshots();
    console.log('Snapshot crontask completed successfully');
  } catch (error) {
    console.error('Snapshot crontask failed:', error);
  }
});
