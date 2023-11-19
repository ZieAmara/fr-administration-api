#!/bin/sh

request() {
    method=${1}
    url=${2}
    expected_http_status=${3}
    parameters=${4}
    if [ -z "${parameters}" ]
    then
        echo "curl -X ${method} -o /dev/null -s -w "%{http_code}\n" --header 'Accept: application/json' ${url}"
        http_status=`curl -X ${method} -o /dev/null -s -w "%{http_code}\n" --header 'Accept: application/json' ${url}`
    else
        echo "curl -X ${method} -d ${parameters} -o /dev/null -s -w "%{http_code}\n" --header 'Accept: application/json' ${url}"
        http_status=`curl -X ${method} -d ${parameters} -o /dev/null -s -w "%{http_code}\n" --header 'Accept: application/json' ${url}`
    fi
    if [ ${http_status} != ${expected_http_status} ]
    then
        echo "${method} ${url} ${parameters} ${http_status} while expecting ${expected_http_status}"
        exit 1
    fi
}

get() {
    request GET ${1} ${2} ${3}
}

post() {
    request POST ${1} ${2} "${3}"
}

put() {
    request PUT ${1} ${2} ${3}
}

delete() {
    request DELETE ${1} ${2} ${3}
}

get http://localhost:3000/user/all 200
get http://localhost:3000/user/0 200
get http://localhost:3000/user/5 404
post http://localhost:3000/user/create 201 "firstname=Jane&lastname=Doe&age=23"
get http://localhost:3000/user/5 200
put http://localhost:3000/user/update/5 200 "firstname=Janette&lastname=Doe&age=32"
delete http://localhost:3000/user/delete/5 200
get http://localhost:3000/user/5 404

get http://localhost:3000/association/all 200
get http://localhost:3000/association/0 200
get http://localhost:3000/association/2 404
post http://localhost:3000/association/create 201 "idUsers[]=1&name=Assoc1"
get http://localhost:3000/association/2 200
post http://localhost:3000/user/create 201 "firstName=Jane&lastName=Doe&age=23"
put http://localhost:3000/association/update/2 200 "idUsers[]=1&idUsers[]=2&name=Assoc1"
delete http://localhost:3000/association/delete/2 200
get http://localhost:3000/association/2 404
get http://localhost:3000/association/0/members 200
delete http://localhost:3000/user/delete/5 200


# Les tests à faire avant de lancer ce fichier de test :

# curl http://localhost:3000/association/all


# curl -X POST -d 'idUsers[]=1&idUsers[]=2&idUsers[]=3&idUsers[]=4&name=Assoc1' http://localhost:3000/association/create
# curl -X POST -d 'idUsers[]=0&idUsers[]=2&idUsers[]=3&idUsers[]=4&name=Assoc2' http://localhost:3000/association/create
# curl -X POST -d 'idUsers[]=1&idUsers[]=3&idUsers=5&name=Assoc3' http://localhost:3000/association/create
# curl -X POST -d 'idUsers[]=0&idUsers[]=2&idUsers[]=4&name=Assoc4' http://localhost:3000/association/create

# curl http://localhost:3000/association/all
# curl http://localhost:3000/association/1
# curl http://localhost:3000/association/5

# curl -X PUT -d 'idUsers[]=0&idUsers[]=3' http://localhost:3000/association/update/1
# curl http://localhost:3000/association/1
# curl http://localhost:3000/association/all

# curl -X DELETE http://localhost:3000/association/delete/1
# curl http://localhost:3000/association/1
# curl http://localhost:3000/association/all

# curl http://localhost:3000/association/1/members