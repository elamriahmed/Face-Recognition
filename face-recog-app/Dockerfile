FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Remove node_modules and package-lock.json if they exist
# RUN rm -rf node_modules package-lock.json

# Install dependencies
# --legacy-peer-deps is used to bypass peer dependency conflicts
RUN npm install --legacy-peer-deps --force

# Attempt to install the optional dependency for rollup, but allow failure
#  RUN npm install @rollup/rollup-linux-x64-gnu --save-optional --force || true

# Copy the rest of the application files
COPY . .

# Expose the port
EXPOSE 3000

# Default command to run your app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

