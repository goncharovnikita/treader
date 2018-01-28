package db_test

import (
	"log"
	"testing"

	"github.com/stretchr/testify/assert"

	"../db"
)

func TestGetOne(t *testing.T) {
	db.Connect(dbURL, dbName)

	var testModel db.Book
	var result db.Book
	testModel.FictionBook = "test_book"
	testModel.Description.DocumentInfo.ID = "1"

	if err := db.Insert(&testModel); err != nil {
		cleanup()
		log.Fatal(err)
	}

	if err := db.GetOne("1", &result); err != nil {
		cleanup()
		log.Fatal(err)
	}

	assert.Equal(t, "test_book", result.FictionBook)

	cleanup()
}
