import cron from 'node-cron';
import SnapshotService from '@services/snapshot.service';

// Every day at 1am
cron.schedule('0 1 * * *', async () => {
  try {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    console.log(`Snapshot crontask running at ${hour}:${minute}:${second}`);
    await SnapshotService.createTodaySnapshots();
    console.log('Snapshot crontask completed');
  } catch (error) {
    console.error('Snapshot crontask failed:', error);
  }
});
