#!/bin/sh
set -e
cd /var/www/html

# Safety net: Render should provide APP_KEY. If it doesn't, use a temporary one.
if [ -z "$APP_KEY" ]; then
  echo "WARNING: APP_KEY not set - generating a temporary key. Set APP_KEY in Render!"
  export APP_KEY="$(php artisan key:generate --show)"
fi

php artisan package:discover --ansi
php artisan migrate --force

exec php artisan serve --host=0.0.0.0 --port="${PORT:-10000}"
