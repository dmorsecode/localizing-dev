
# Localizing-Dev Project

This project aims to reduce language barriers in open-source software by connecting volunteer translators with developers to localize projects. Many open-source repositories are inaccessible to non-English speakers, which limits global participation. By facilitating community-driven translations through GitHub pull requests and minimizing the need for new tools, we strive to make software and documentation more inclusive and accessible to a broader audience.

This project leverages SvelteKit, Vite, and other tools for development. Below are the steps to download, set up, and run this project using Visual Studio Code (VSCode).

---

## **Prerequisites**

Ensure the following are installed on your system and working:

1. [**Node.js**](https://nodejs.org/en/download)
2. **npm** (comes with node.js)
3. [**VSCode**](https://code.visualstudio.com/download)
4. [**Docker Desktop**](https://www.docker.com/products/docker-desktop/) (follow the installation instructions for your OS)
5. Extensions for VSCode:
   - [Svelte for VSCode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

---

## **Downloading the Project**

1. Open a terminal on your machine.
2. Clone the project repository:
   ```bash
   git clone https://github.com/dmorsecode/localizing-dev.git
   ```
3. Navigate to the project directory:
   ```bash
   cd localizing-dev
   ```

---

## **Installing Node Modules**

Run the following command to install all the necessary packages:

```bash
npm install
```

---

## **Setting Up PostgreSQL Locally**

### **Install and Run PostgreSQL using Docker**

Follow these steps to set up and run PostgreSQL quickly in a container:

1. **Initialize PostgreSQL in a Docker container:**
   ```bash
   docker run --name postgres-local -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
   ```
    > **_NOTE:_** If this image is not currently on your computer, you will see a brief error, but docker should immediately download the image from docker hub and start the container.

2. **Verify the container is running:**
   ```bash
   docker ps
   ```
   You should see the PostgreSQL container listed.

3. **Create neondb database in Docker container:**
   ```bash
   docker exec -it postgres-local psql -U postgres -c "CREATE DATABASE neondb;"
   ```

4. Create or Update local environments file.
    - Using the .env.example file, create a .env.local file and add the following database connection info:
    ```bash
    DATABASE_URL="postgres://postgres:mysecretpassword@local:5432/neondb"
    ```

    > **_NOTE:_** .env will not be committed to the repository so make sure you have a backup of this file. Without this file, Drizzle will not work correctly.

5. **(Optional) Connect to PostgreSQL using a tool:**
   - Use tools like **pgAdmin**, **DBeaver**, or the `psql` command-line tool.
     - Host: `localhost`
     - Port: `5432`
     - Username: `postgres`
     - Password: `mysecretpassword`

6. **(Optional)Stop the container (when needed):**
   ```bash
   docker stop postgres-local
   ```

---

## **Running the Project**


### **1. Start the Development Server**

To start the project in development mode, run:

```bash
npm run dev
```

The server will start, and you can access the application at **http://localhost:5173**.

## **Working with the Database**

This project uses Drizzle ORM for database management. 

> **_NOTE:_** To use Drizzle, you must have created a .env file with a working database connection. This filename can be seen in drizzle.config.ts

Common commands include:

- **Push schema changes to the database:**
  ```bash
  npm run db:push
  ```
- **Run database migrations:**
  ```bash
  npm run db:migrate
  ```
- **Open the database studio:**
  ```bash
  npm run db:studio
  ```

---

## **Running Tests**

The project supports both unit and end-to-end tests.

- **Run all tests:**
  ```bash
  npm run test
  ```
- **Run unit tests only:**
  ```bash
  npm run test:unit
  ```
- **Run end-to-end tests:**
  ```bash
  npm run test:e2e
  ```

---

## **Using Storybook**

This project includes Storybook for component development and documentation.

- **Start Storybook:**  
  ```bash
  npm run storybook
  ```
- **Build Storybook:**  
  ```bash
  npm run build-storybook
  ```

You can access Storybook at **http://localhost:6006** after starting the server.

---

## **Common Issues**

- **Internal Server Error (500)** - Review the terminal output in VSCode for more clarity around this error. If this is the first time starting the project, it may have to do with the database connection as it is required to start the application.

---

## **Contributing**

Feel free to submit issues and pull requests to improve the project.

---