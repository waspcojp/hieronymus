#!/bin/bash

if [ ! -f /app/docker-history/initialized.txt ]; then
  echo '** Create Database' 
  npx sequelize-cli db:create
  npx sequelize-cli db:migrate
  npx sequelize-cli db:seed:all

  echo '** initialize done'
  touch /app/docker-history/initialized.txt

  echo '** start Hieronymus'
  node /app/hieronymus/bin/www 
fi

exec "$@"
