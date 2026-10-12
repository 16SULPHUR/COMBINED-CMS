import * as migration_20261012_194429_initial from './20261012_194429_initial';
import * as migration_20261012_195032_media_storage from './20261012_195032_media_storage';

export const migrations = [
  {
    up: migration_20261012_194429_initial.up,
    down: migration_20261012_194429_initial.down,
    name: '20261012_194429_initial',
  },
  {
    up: migration_20261012_195032_media_storage.up,
    down: migration_20261012_195032_media_storage.down,
    name: '20261012_195032_media_storage'
  },
];
