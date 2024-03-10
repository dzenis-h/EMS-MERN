module.exports = {
  apps: [
    {
      name: "balkan-dreams-test-backend",
      script: "./build/bin/www.js",
      instances: 1,
      autoRestart: true,
    },
  ],
};
