import cron from 'node-cron';
import SnapshotService from 'services/snapshot.service';

// Every day at 1am
cron.schedule('0 1 * * *', async () => {
  try {
    const snapshotService = new SnapshotService();
    await snapshotService.createTodaySnapshots();
  } catch (error) {
    console.error('Snapshot crontask failed:', error);
  }
});
