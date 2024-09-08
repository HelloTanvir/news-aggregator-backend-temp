ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

RUN if [ "$NODE_ENV" = "production" ]; \
    then yarn install --production --frozen-lockfile; \
    else yarn install --frozen-lockfile; \
    fi

COPY . .

RUN if [ "$NODE_ENV" = "production" ]; \
    then yarn build; \
    fi

EXPOSE 5000

CMD ["yarn", "start:dev"]