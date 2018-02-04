package handlers

import (
	"net/http"
)

// HandleUser handle users routing
func HandleUser() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("/update/lexicon", UpdateLexiconHandler())
	mux.Handle("/add/book", AddBookToUserHandler())
	mux.Handle("/get/statistics", GetUserStatisticHandler())
	return mux
}

// HandleBook handle book routing
func HandleBook() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("/new", NewBookHandler())
	return mux
}
