# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:14-alpine as build

# Set the working directory
WORKDIR /app

# Add the source code to app
RUN npm install -g @angular/cli
COPY ./package.json .

# Install all the dependencies
RUN npm install
COPY . .
# Generate the build of the application
RUN npm run build

# Use official nginx image as the base image

FROM nginx:1.17.1-alpine as runtime

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist/client /usr/share/nginx/html
EXPOSE 4200