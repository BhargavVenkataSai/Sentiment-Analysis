FROM node:20-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --silent
COPY . .
RUN npx react-scripts build

FROM node:20-alpine as prod
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"] 