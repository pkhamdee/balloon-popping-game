#Start Json server for backend api
json-server --watch src/db/players.json --port 3030
json-server --watch src/db/merchant.json --port 3031

#Start react project
npm start

#access url
##dashboard
http://localhost:3000
##player
http://localhost:3000/player
##merchandise
http://localhost:3000/merchant
