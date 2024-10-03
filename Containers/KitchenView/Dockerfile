FROM node:14
WORKDIR C:\Users\46735\tentor\burgerorderer-project\Containers\KitchenView
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
EXPOSE 4000