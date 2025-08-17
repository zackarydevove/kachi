import cron from 'node-cron';
import SnapshotService from 'services/snapshot.service';

// Every day at 1am
cron.schedule('0 1 * * *', () => {
  console.log('running a task every day at 1am');
  const snapshotService = new SnapshotService();
  snapshotService.createTodaySnapshots();
});
