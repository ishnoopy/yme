# Project Setup

Follow these steps to set up the project:

1. **Install Dependencies**
   - Run the following command to install all necessary dependencies:
     ```
     pnpm install
     ```

2. **Set Up Environment Variables**
   - Ensure you have a `.env` file in the root directory with the necessary environment variables. You can refer to the `.env.example` file for the required variables.


3. **Generate Prisma Client**
   - Run the following command to populate db with initial tables declared in prisma/schema.prisma:
     ```
     npm run prisma:sync
     ```
   - This will create a "generated" folder which contains the Prisma files.


4. **Start the Docker Containers**
   - Use the following command to start the Docker containers for the database and other services:
     ```
     docker compose -f docker/local/docker-compose-db.yaml --env-file .env up -d
     ```

5. **Run the Application**
   - Finally, start the application with the following command:
     ```
     pnpm start
     ```

Now your project should be up and running!