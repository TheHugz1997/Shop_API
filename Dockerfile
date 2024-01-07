# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install dotenv module
RUN npm install dotenv cookie-parser

# Install Cassandra driver
RUN npm install cassandra-driver

# Copy the rest of the application code to the container
COPY . .

# Expose the port that your app will run on
EXPOSE 3200

# Command to run your application
CMD ["npm", "start"]