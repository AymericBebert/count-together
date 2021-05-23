#!/usr/bin/env sh

set -eu

echo "window['APP_CONFIG'] = {" >/usr/share/nginx/html/assets/config.js

env | while IFS= read -r line; do
  name=${line%%=*}
  value=${line#*=}
  case $name in NGX_*)
    echo "  \"$name\": $value," >>/usr/share/nginx/html/assets/config.js
    ;;
  esac
done

echo "};" >>/usr/share/nginx/html/assets/config.js

sed -i "s/CONFIG_TIMESTAMP/$(date +%s)/" /usr/share/nginx/html/index.html

if [ -n "${APP_SHORT_NAME:-}" ]; then
  sed -i "s/\"short_name\": \"CounT\"/\"short_name\": \"$APP_SHORT_NAME\"/" /usr/share/nginx/html/manifest.webmanifest
fi

exec "$@"
