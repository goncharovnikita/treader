package db_test

import (
	"log"

	"gopkg.in/mgo.v2"
)

func cleanup() {
	connection, err := mgo.Dial("localhost")
	if err != nil {
		log.Fatal(err)
	}

	connection.DB(dbName).DropDatabase()
}
