FROM node:boron

# Create the app folder.
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Move all the source files into it.
COPY ./ /usr/src/app

EXPOSE 8080

# Let the madness begin!
CMD ["npm", "run", "prod-server", "8080"]
