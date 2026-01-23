import 'module-alias/register';
import 'dotenv/config';

import App from './app';
import './workers/snapshot.crontask';

const app = new App();

app.start();
