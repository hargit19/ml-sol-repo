FROM nginx:1.19.7-alpine

# Add bash for boot cmd
RUN apk add bash

# Add nginx.conf to container
COPY  nginx.conf /etc/nginx/nginx.conf

# set workdir
WORKDIR /app

CMD ["nginx", "-g", "'daemon off;'"]