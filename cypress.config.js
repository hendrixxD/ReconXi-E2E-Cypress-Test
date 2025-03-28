
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
      GOOGLE_PASSWORD: "GOOGLE_PASSWORD"
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

// module.exports = defineConfig({
//   reporter: 'mochawesome',
//   reporterOptions: {
//     reportDir: 'cypress/reports',
//     overwrite: false,
//     html: true,
//     json: true,
//   },
// });

// cypress.config.js
// const { defineConfig } = require('cypress')

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: 'https://reconxi.com',
//     experimentalSessionAndOrigin: true,
//     env: {
//       GOOGLE_USER: 'test@example.com',
//       GOOGLE_PASSWORD: 'securepassword'
//     },
//     setupNodeEvents(on, config) {
//       // Configure file downloads
//       on('task', {
//         log(message) {
//           console.log(message)
//           return null
//         }
//       })
//     }
//   }
// })