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
post http://localhost:3000/user/create 201 "firstName=Jane&lastName=Doe"
get http://localhost:3000/user/5 200
put http://localhost:3000/user/update/5 200 "firstName=Janette&lastName=Doe"
delete http://localhost:3000/user/delete/5 200
get http://localhost:3000/user/5 404


# Les tests à faire avant de lancer ce fichier de test :

# curl http://localhost:3000/user/all

# curl -X POST -d 'firstName=Jane&lastName=Doe&age=21' http://localhost:3000/user/create
# curl -X POST -d 'firstName=Zie&lastName=Amara&age=26' http://localhost:3000/user/create
# curl -X POST -d 'firstName=Kim&lastName=Ray&age=17' http://localhost:3000/user/create
# curl -X POST -d 'firstName=Sow&lastName=Ali&age=9' http://localhost:3000/user/create
# curl -X POST -d 'firstName=John&lastName=Dri&age=30' http://localhost:3000/user/create

# curl http://localhost:3000/user/all
# curl http://localhost:3000/user/1
# curl http://localhost:3000/user/5

# curl -X PUT -d 'firstName=Janette&lastName=Doe' http://localhost:3000/user/update/1
# curl http://localhost:3000/user/1
# curl http://localhost:3000/user/all

# curl -X DELETE http://localhost:3000/user/delete/1
# curl http://localhost:3000/user/1
# curl http://localhost:3000/user/all
