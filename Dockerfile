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

ENV IG_ACCESS_TOKEN=EAAJevylfTkgBO9w4ZBgZA6M6iS7QBzQPXzoqhs0RqD7ZBHz33vty2FTHZCOgQsqwP3GU0gJl8rUu7ZBWVmSJlxAbTQkidqu1nd8AAnnaXQGj9OHlriNeO0Bpl85ZAPU1h0yPC2R7lR3YVYMsezZBDjLKVzgG5VpgMF2VZCdnyIrlPrOGBD38On1EvmsZD

# הפעל את השרת
CMD [ "node", "server.js" ]

