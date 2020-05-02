FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./

COPY . .

# Install package dependencies
RUN npm install

# Build the add-in
ARG PRODUCTION_URL=localhost
RUN npm run build -- --env.PRODUCTION_URL=${PRODUCTION_URL}

# Expose the port 3000
EXPOSE 3000

CMD ["npm", "run", "start:http"]