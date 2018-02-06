FROM node:9.4.0

RUN npm install --global npm@5.6.0

ENV APP_HOME /ec2_handler

RUN mkdir $APP_HOME
COPY package.json package-lock.json $APP_HOME/

ENV NODE_ENV=development

WORKDIR $APP_HOME
RUN npm install

COPY . $APP_HOME

CMD ["npm"]
