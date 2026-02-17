Database Setup Guide

# Install Dependencies:
1. Install PgAdmin4
    - Windows: https://www.pgadmin.org/download/pgadmin-4-windows/
    - macOS: https://www.pgadmin.org/download/pgadmin-4-macos/

# Create Database:
1. Follow this tutorial: https://www.youtube.com/watch?v=3YnNkm3RDMI (You will need to remember the DB name and password for step 3)
2. In your project root, find ".env.example". Copy paste .env.example into a new ".env.local" file
3. Find "DB_NAME" and "DB_PASSWORD" in the .env.local file and replace them with the values you used in step 1

## Example:
1. I create database with name "my_db" and password "123"
2. I copy everything in .env.example into .env.local
3. I replace "DB_NAME=smartquote" with "DB_NAME=my_db" and "DB_PASSWORD=your_database_password_here" with "DB_PASSWORD=123"

# Running the Database
1. First run "npm run setup" in your terminal
2. Then run "npm run dev:full" in your terminal
    Note:
    - "npm run dev" starts only your frontend locally
    - "npm run dev:server" starts only your backend locally
    - "npm run dev:full" starts both your frontend and backend locally

# Data Corruption
1. If you think your database has corruptions, run the following commands:
    - "npm run db:migrate:rollback:all" (this drops all tables in your database)
    - "npm run setup"