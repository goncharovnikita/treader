// Package db responsible for connection and querying to database
package db

import (
	"log"

	"gopkg.in/mgo.v2"
)

var (
	connectionURL string
	dbName        string
	session       *mgo.Session
)

// Connect perform database connection with specified URL and database name
func Connect(url string, name string) {
	var err error
	log.SetFlags(log.Lshortfile | log.Ldate)
	log.SetPrefix("DB: ")
	connectionURL = url
	dbName = name
	if session, err = mgo.Dial(connectionURL); err != nil {
		log.Fatal(err)
	}
	log.Printf("database connection to %s established\n", connectionURL)
}
