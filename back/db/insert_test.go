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
	defer cleanup()
	db.Connect(dbURL, dbName)

	var testModel db.Book
	testModel.Description.TitleInfo.Genre = []string{"test_book"}

	if err := db.Insert(&testModel); err != nil {
		log.Fatal(err)
	}

}
