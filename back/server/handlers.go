package server

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"../reader"
)

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
				bookInfo reader.BookInfo
				data     []byte
				err      error
				// words    []string
				rdr reader.FB2Reader
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

			fmt.Println(bookInfo.Author)
			fmt.Println(bookInfo.Genre)

			rw.WriteHeader(http.StatusNoContent)
			fmt.Printf("%s %s %d %s\n", r.URL, r.Method, 204, time.Since(start))
			return
		} else {
			rw.WriteHeader(http.StatusMethodNotAllowed)
			fmt.Printf("%s %s %d %s\n", r.URL, r.Method, 405, time.Since(start))
		}
	})
}
