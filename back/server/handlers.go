package server

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/centrypoint/fb2"

	"../reader"
	"../translate"
)

// new book response type
type newBookResponse struct {
	Book fb2.FB2 `json:"book"`
}

// translate word response type
type translateWordResponse struct {
	Result string `json:"result"`
}

// handle new book
func newBookHandler() http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		fmt.Println(r.Method)
		rw.Header().Add("Access-Control-Allow-Origin", "*")
		rw.Header().Add("Access-Control-Allow-Headers", "content-type")
		rw.Header().Add("content-type", "application/octet-stream")
		start := time.Now()
		if r.Method == http.MethodOptions {
			rw.Header().Add("Access-Control-Allow-Method", "POST")
			rw.WriteHeader(http.StatusNoContent)
			fmt.Printf("%s %s %d %s\n", r.URL, r.Method, 204, time.Since(start))
		} else if r.Method == http.MethodPost {
			var (
				bookInfo fb2.FB2
				data     []byte
				err      error
				response []byte
				rdr      reader.FB2Reader
			)

			defer r.Body.Close()

			if data, err = ioutil.ReadAll(r.Body); err != nil {
				log.Println(err)
				rw.WriteHeader(500)
				fmt.Printf("%s %s %d %s\n", r.URL, r.Method, 500, time.Since(start))
				return
			}

			if _, bookInfo, err = rdr.ReadBook(data); err != nil {
				log.Println(err)
				rw.WriteHeader(500)
				fmt.Printf("%s %s %d %s\n", r.URL, r.Method, 500, time.Since(start))
				return
			}

			if response, err = json.Marshal(newBookResponse{Book: bookInfo}); err != nil {
				log.Println(err)
				rw.WriteHeader(500)
				fmt.Printf("%s %s %d %s\n", r.URL, r.Method, 500, time.Since(start))
				return
			}

			rw.Write(response)
			fmt.Printf("%s %s %d %s\n", r.URL, r.Method, 204, time.Since(start))
			return
		} else {
			rw.WriteHeader(http.StatusMethodNotAllowed)
			fmt.Printf("%s %s %d %s\n", r.URL, r.Method, 405, time.Since(start))
		}
	})
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
