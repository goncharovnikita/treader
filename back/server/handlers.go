package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"../translate"
)

// translate word response type
type translateWordResponse struct {
	Result string `json:"result"`
}

// translate book handler
func translateWordHandler() http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		rw.Header().Add("Access-Control-Allow-Origin", "*")
		start := time.Now()
		var (
			err        error
			translator translate.ENRUTranslator
			result     string
			response   []byte
		)

		query := r.URL.Query().Get("query")

		if len(query) < 1 {
			rw.WriteHeader(http.StatusNoContent)
			fmt.Printf("%s %s %d %s\n", r.URL, r.Method, 204, time.Since(start))
			return
		}

		if result, err = translator.Translate(query); err != nil {
			log.Println(err)
			rw.WriteHeader(http.StatusInternalServerError)
			fmt.Printf("%s %s %d %s\n", r.URL, r.Method, 500, time.Since(start))
			return
		}

		if response, err = json.Marshal(translateWordResponse{Result: result}); err != nil {
			log.Println(err)
			rw.WriteHeader(http.StatusInternalServerError)
			fmt.Printf("%s %s %d %s\n", r.URL, r.Method, 500, time.Since(start))
			return
		}

		rw.Write(response)
		fmt.Printf("%s %s %d %s\n", r.URL, r.Method, 200, time.Since(start))

		return
	})
}
