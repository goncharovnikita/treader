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
func Connect(url, name, login, pwd string) {
	var err error
	log.SetFlags(log.Llongfile | log.Ldate)
	log.SetPrefix("DB: ")
	connectionURL = url
	dbName = name
	if session, err = mgo.Dial(connectionURL); err != nil {
		log.Fatal(err)
	}
	if err = session.Login(&mgo.Credential{Username: login, Password: pwd, Source: name}); err != nil {
		log.Fatal(err)
	}
	log.Printf("database connection to %s established\n", connectionURL)
}
