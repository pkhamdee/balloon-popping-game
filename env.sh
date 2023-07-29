#!/bin/sh

ENV_JS_FILE=./build/env.js

# Recreate config file
rm -rf $ENV_FILE && touch $ENV_JS_FILE

# Add assignment
echo "window.env = {" >> $ENV_JS_FILE

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [ -n "$line" ];
do
  line_ctr=$(($line_ctr + 1))

  # Add comma to each entry
  [ $line_ctr -gt 1 ] && echo "," >> $ENV_JS_FILE

  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  # value=$(printf '%s\n' "${!varname}")
  value=$(eval 'printf "%s\n" "${'"$varname"'}"')

  # Otherwise use value from .env file
  [ -z $value ] && value=${varvalue}

  # Append configuration property to JS file
  echo -n "  \"$varname\": \"$value\"" >> $ENV_JS_FILE
  
done < .env

echo "}" >> $ENV_JS_FILE