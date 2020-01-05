FROM keymetrics/pm2:latest-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#ENV NPM_CONFIG_LOGLEVEL warn
#ENV NODE_ENV=production

COPY package*.json ./
COPY pm2.json ./


#RUN npm install
#RUN npm install pm2 -g
# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

COPY . .

EXPOSE 3000
#CMD ["node","index.js"]
CMD [ "pm2-runtime", "start", "pm2.json" ]