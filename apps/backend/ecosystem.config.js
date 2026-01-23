module.exports = {
  apps: [
    {
      name: 'kachi',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
