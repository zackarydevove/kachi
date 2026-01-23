module.exports = {
  apps: [
    {
      name: 'kachi',
      script: 'npm',
      args: 'run start',
      env_file: '.env',
    },
  ],
};
