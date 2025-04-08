# בחר את התמונה של Node.js
FROM node:14

# הגדר את התיקיה שבה יותקן השרת
WORKDIR /usr/src/app

# העתק את קובץ ה־package.json
COPY package*.json ./

# התקן את כל החבילות
RUN npm install

# העתק את כל הקבצים
COPY . .

# חשוף את הפורט 3000
EXPOSE 3000

# הפעל את השרת
CMD [ "node", "server.js" ]

