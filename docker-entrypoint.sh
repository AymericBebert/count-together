#!/usr/bin/env sh

set -eu

echo "window['APP_CONFIG'] = {" >/config.js
echo "  \"version\": \"$(cat /version.txt)\"," >>/config.js

env | while IFS= read -r line; do
  name=${line%%=*}
  value=${line#*=}
  case $name in NGX_*)
    echo "  \"$(echo "$name" | cut -c5-)\": $value," >>/config.js
    ;;
  esac
done

echo "};" >>/config.js

sed -i "s/CONFIG_TIMESTAMP/$(date +%s)/" /usr/share/nginx/html/index.html

CONFIG_BLOCK="<!--APP_CONFIG INSERTED-->
<script>
$(cat /config.js)
</script>"
NGX_GTAG=$(echo "$NGX_GTAG" | sed -e 's/^"//' -e 's/"$//')
GTAG_BLOCK=$(echo "$GTAG_BLOCK" | sed -e "s/NGX_GTAG/$NGX_GTAG/")
# shellcheck disable=SC2005
echo "$(awk -v r="$CONFIG_BLOCK" '{gsub(/<!--APP_CONFIG-->/,r)}1' /usr/share/nginx/html/index.html)" >/usr/share/nginx/html/index.html

if [ -n "${APP_SHORT_NAME:-}" ]; then
  sed -i "s/\"short_name\": \"CounT\"/\"short_name\": \"$APP_SHORT_NAME\"/" /usr/share/nginx/html/manifest.webmanifest
fi

exec "$@"
