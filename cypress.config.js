
require('dotenv').config()

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'zkwb19',
  e2e: {
    baseUrl: 'https://reconxi.com',
    experimentalSessionAndOrigin: true,
    env: {
      GOOGLE_USER: "GOOGLE_USER",
      GOOGLE_PASSWORD: "GOOGLE_PASSWORD"
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