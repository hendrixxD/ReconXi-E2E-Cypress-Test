
const { defineConfig } = require("cypress");

require('dotenv').config()


module.exports = defineConfig({
  reporter: 'mochawesome',
  projectId: 'zkwb19',
  e2e: {
    baseUrl: 'https://reconxi.com',
    experimentalSessionAndOrigin: true,
    env: {
      // GOOGLE_USER: "GOOGLE_USER",
      // GOOGLE_PASSWORD: "GOOGLE_PASSWORD",
      // googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      // googleClientId: process.env.REACT_APP_GOOGLE_CLIENTID,
      // googleClientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
      email: process.env.EMAIL,
      password: process.env.PASSWORD,

      email: process.env.email_,
      password: process.env.password_
    },
    reporterOptions: {
      reportDir: 'cypress/reconxi-report',
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