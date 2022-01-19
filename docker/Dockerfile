FROM php:8-apache

RUN apt-get update -y && apt-get install -y libonig-dev

RUN docker-php-ext-install -j$(nproc) pdo pdo_mysql mbstring mysqli exif && docker-php-ext-enable mysqli

RUN a2enmod rewrite
RUN a2disconf serve-cgi-bin

RUN service apache2 restart

COPY ./docker/php.ini /etc/php/php.ini
COPY . /var/www/html

LABEL ORIGIN herogu.garageisep.com

EXPOSE 80
LABEL org.opencontainers.image.source https://github.com/totodore/storyland