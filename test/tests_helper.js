import dotenv from 'dotenv';
import 'sepia'; /* eslint import/no-extraneous-dependencies: [0] */

import { sequelize, App } from '../models';

dotenv.config();

beforeAll(async () => {
  sequelize.sync();
  App.truncate();
});
