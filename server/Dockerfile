FROM vinli/nodejs:4
MAINTAINER Steven Gangstead<gangstead@vin.li>

ADD ./ /app
WORKDIR /app
RUN rm -rf node_modules && npm install

EXPOSE 3000:3000
ENV PORT 3000

CMD ["npm", "start"]
