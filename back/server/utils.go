package server

import (
	"net/http"
)

// cors handler
func corsProvider(h http.Handler) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		rw.Header().Add("Access-Control-Allow-Origin", "*")
		h.ServeHTTP(rw, r)
	})
}
