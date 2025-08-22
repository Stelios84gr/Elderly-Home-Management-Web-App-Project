# version of node to use
FROM node:22
# Directory to save image
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm Install# Bundle app source
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]