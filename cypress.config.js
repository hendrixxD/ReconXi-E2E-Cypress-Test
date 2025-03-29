
require('dotenv').config()

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'mochawesome',
  projectId: 'zkwb19',
  e2e: {
    baseUrl: 'https://reconxi.com',
    experimentalSessionAndOrigin: true,
    env: {
      GOOGLE_USER: "GOOGLE_USER",
      GOOGLE_PASSWORD: "GOOGLE_PASSWORD",
      googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      googleClientId: process.env.REACT_APP_GOOGLE_CLIENTID,
      googleClientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
    },
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
    },
    setupNodeEvents(on, config) {
      // Configure file downloads
      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })
    }
  },
});