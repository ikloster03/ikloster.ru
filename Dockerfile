FROM node:8.10

# Set a timezone
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY . .
RUN npm install
RUN npm run build

CMD node dist --port=8035