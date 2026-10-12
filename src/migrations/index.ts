import * as migration_20261012_194429_initial from './20261012_194429_initial';

export const migrations = [
  {
    up: migration_20261012_194429_initial.up,
    down: migration_20261012_194429_initial.down,
    name: '20261012_194429_initial',
  },
];
