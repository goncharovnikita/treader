package server

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"../reader"
)

// handle new book
func newBookHandler() http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		rw.Header().Add("Access-Control-Allow-Origin", "*")
		var (
			bookInfo reader.BookInfo
			data     []byte
			err      error
			// words    []string
			rdr reader.FB2Reader
		)

		defer r.Body.Close()

		if err = r.ParseForm(); err != nil {
			log.Println(err)
			rw.WriteHeader(500)
			return
		}

		fmt.Printf("%+v\n", r)

		if data, err = ioutil.ReadAll(r.Body); err != nil {
			log.Println(err)
			rw.WriteHeader(500)
			return
		}

		if _, bookInfo, err = rdr.ReadBook(data); err != nil {
			log.Println(err)
			rw.WriteHeader(500)
			return
		}

		fmt.Println(bookInfo.Author)
		fmt.Println(bookInfo.Genre)

		rw.WriteHeader(http.StatusNoContent)
		return
	})
}
