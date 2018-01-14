package server

import (
	"net/http"
)

// handle new book
func newBookHandler() http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		// start := time.Now()
		return
	})
}
