package db_test

import (
	"log"
	"testing"

	"../db"
)

var (
	dbURL  = "localhost"
	dbName = "treader_test"
)

func TestInsert(t *testing.T) {
	db.Connect(dbURL, dbName)

	var testModel db.Book
	testModel.FictionBook = "test_book"

	if err := db.Insert(&testModel); err != nil {
		cleanup()
		log.Fatal(err)
	}

	cleanup()
}
