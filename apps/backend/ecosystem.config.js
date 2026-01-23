module.exports = {
  apps: [
    {
      name: 'kachi',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
