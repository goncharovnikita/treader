package db_test

import (
	"log"
	"testing"

	"github.com/stretchr/testify/assert"

	"../db"
)

func TestGetOne(t *testing.T) {
	defer cleanup()
	db.Connect(dbURL, dbName)

	var testModel db.Book
	var result db.Book
	testModel.Description.TitleInfo.Genre = []string{"test_book"}
	testModel.Description.DocumentInfo.ID = "1"

	if err := db.Insert(&testModel); err != nil {
		log.Fatal(err)
	}

	if err := db.GetOne("1", &result); err != nil {
		log.Fatal(err)
	}

	assert.Equal(t, "test_book", result.Description.TitleInfo.Genre[0])

}
