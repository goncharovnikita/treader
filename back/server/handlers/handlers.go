package handlers

import (
	"net/http"
)

// Handle routing
func Handle() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("/update/lexicon", UpdateLexiconHandler())
	return mux
}
