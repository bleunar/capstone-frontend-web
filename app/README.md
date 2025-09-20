# capstone-frontend-web

### How to: Setup Project
1. Clone the repository
2. duplicate the ".env.template" and rename the copy as ".env"
3. Inside the ".env" file, populate the variables that are missing
    NOTE: Properly assign the VITE_TARGET_AUTH and VITE_TARGET_SYSTEM
4. run command "npm install" to setup dependencies
5. run command "npm run dev" to start development server

### SETUP NOTES: 
    - Make sure to properly assign the **HOST_TARGET_SYSTEM** for the system to communicate well with the API endpoint
    - If the project is in production and runs locally, leave the **HOST_ALLOWED** blank and set the **HOST** to "localhost", else assign the domain where the web client is hostedd to work.
