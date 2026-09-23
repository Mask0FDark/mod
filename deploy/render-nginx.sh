#!/usr/bin/env sh
set -eu

: "${PUBLIC_HOST:?PUBLIC_HOST is required}"
CERT_NAME="${CERT_NAME:-$PUBLIC_HOST}"

sed   -e "s/__PUBLIC_HOST__/$PUBLIC_HOST/g"   -e "s/__CERT_NAME__/$CERT_NAME/g"   "$(dirname "$0")/nginx.conf.template"
