FROM node:alpine AS builder
ENV NODE_ENV production
WORKDIR /app
COPY ./package.json ./
RUN npm install
# Copy app files
COPY . .
# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginx:alpine as production
RUN apk add --update nodejs npm 

# Copy built assets from builder
COPY --from=builder /app/ /app/
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

ENTRYPOINT npx react-inject-env set \
&& cp -R /app/build/* /usr/share/nginx/html \
&& cp -R /build/* /usr/share/nginx/html \
&& 'nginx' '-g' 'daemon off;'