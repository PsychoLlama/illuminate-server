FROM kkarczmarczyk/node-yarn

# Create the app folder.
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Move all the source files into it.
COPY ./ /usr/src/app

# Install all dependencies.
RUN yarn install

# Compile the source.
RUN yarn run prod-build

EXPOSE 8080

# Let the madness begin!
CMD ["yarn", "run", "prod-server", "8080"]
