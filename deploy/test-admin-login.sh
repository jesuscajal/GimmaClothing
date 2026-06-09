#!/bin/bash
# Test login + session cookie
BASE=http://127.0.0.1:8080
JAR=/tmp/medusa-cookies.txt
rm -f "$JAR"

curl -s -c "$JAR" -b "$JAR" -X POST "$BASE/auth/user/emailpass" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gimmaclothing.com","password":"Gimma2026"}' | head -c 80
echo

curl -s -c "$JAR" -b "$JAR" -X POST "$BASE/auth/session" | head -c 80
echo

echo "users/me:"
curl -s -b "$JAR" "$BASE/admin/users/me" | head -c 200
echo

echo "cookies:"
cat "$JAR"
