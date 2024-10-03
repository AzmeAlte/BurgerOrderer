FROM node:14
WORKDIR C:\Users\46735\tentor\burgerorderer-project\Containers\BurgerOrderer
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
EXPOSE 3000