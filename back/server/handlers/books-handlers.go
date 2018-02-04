package handlers

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"../../db"
	"../../db/models"
	"../../reader"
	"github.com/centrypoint/fb2"
	"gopkg.in/mgo.v2"
)

// GetBooksHandler handle /get/books
func GetBooksHandler() http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		var responseStatus int
		var err error
		start := time.Now()
		defer reqLogger(&rw, &responseStatus, r.URL, r.Method, &start)
		defer errLogger(&err)
		if r.Method == http.MethodOptions {
			rw.Header().Add("Access-Control-Allow-Headers", "user-id")
			responseStatus = http.StatusNoContent
		} else if r.Method == http.MethodGet {
			var (
				user     db.User
				response []byte
				result   = make(map[string]struct {
					Book     db.Book         `json:"Book"`
					BookInfo models.UserBook `json:"BookInfo"`
				})
			)
			userID := r.Header.Get("user-id")
			if len(userID) < 1 {
				responseStatus = 401
				return
			}

			if err = db.GetOne(userID, &user); err != nil {
				if err.Error() == "not found" {
					user.ID = userID
					if err = db.Insert(&user); err != nil {
						responseStatus = 500
						return
					}
					responseStatus = 200
					return
				}
			}
		_loop:
			for i, v := range user.Books {
				var b db.Book
				if err = db.GetOne(i, &b); err != nil {
					log.Println(err)
					continue _loop
				}
				result[b.ID] = struct {
					Book     db.Book         `json:"Book"`
					BookInfo models.UserBook `json:"BookInfo"`
				}{
					Book:     b,
					BookInfo: v,
				}
			}

			if response, err = json.Marshal(result); err != nil {
				responseStatus = 500
				return
			}

			responseStatus = 200
			rw.Write(response)
		} else {
			responseStatus = http.StatusMethodNotAllowed
		}
	})
}

// UpdateBookInfoHandler updates book information
func UpdateBookInfoHandler() http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		var responseStatus int
		var err error
		start := time.Now()
		defer reqLogger(&rw, &responseStatus, r.URL, r.Method, &start)
		defer errLogger(&err)
		if r.Method == http.MethodOptions {
			rw.Header().Add("Access-Control-Allow-Headers", "content-type, user-id")
			rw.Header().Add("Access-Control-Allow-Method", "POST")
			responseStatus = http.StatusNoContent
		} else if r.Method == http.MethodPost {
			var (
				user   db.User
				params models.UserBook
			)

			userID := r.Header.Get("user-id")
			if len(userID) < 1 {
				responseStatus = 401
				return
			}

			if err = db.GetOne(userID, &user); err != nil {
				responseStatus = 500
				return
			}

			defer r.Body.Close()

			if err = json.NewDecoder(r.Body).Decode(&params); err != nil {
				responseStatus = 500
				return
			}

			if _, ok := user.Books[params.ID]; !ok {
				log.Println("user don't have such book")
				responseStatus = 500
				return
			}

			newBook := user.Books[params.ID]

			if params.LastPage > 0 {
				newBook.LastPage = params.LastPage
			}
			if params.LastTotalPages > 0 {
				newBook.LastTotalPages = params.LastTotalPages
			}
			if len(params.LastOpenedDate) > 0 {
				newBook.LastOpenedDate = params.LastOpenedDate
			}
			if params.TotalOpenings > 0 {
				newBook.TotalOpenings = params.TotalOpenings
			}
			if params.LastReadWords > 0 {
				newBook.LastReadWords = params.LastReadWords
			}

			user.Books[params.ID] = newBook

			if err = db.Update(userID, &user); err != nil {
				responseStatus = 500
				return
			}

			responseStatus = 204
		} else {
			responseStatus = http.StatusMethodNotAllowed
		}
	})
}

// NewBookHandler add new book to database
// returns book information
func NewBookHandler() http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		rw.Header().Add("content-type", "application/octet-stream")
		start := time.Now()
		var responseStatus int
		var err error
		defer errLogger(&err)
		defer reqLogger(&rw, &responseStatus, r.URL, r.Method, &start)
		if r.Method == http.MethodOptions {
			responseStatus = corsPOSTHandler(rw)
		} else if r.Method == http.MethodPost {
			userID := r.Header.Get("user-id")
			if len(userID) < 1 {
				responseStatus = 401
				return
			}
			var (
				bookInfo fb2.FB2
				data     []byte
				rdr      reader.FB2Reader
			)

			defer r.Body.Close()

			if data, err = ioutil.ReadAll(r.Body); err != nil {
				responseStatus = 500
				return
			}

			if _, bookInfo, err = rdr.ReadBook(data); err != nil {
				responseStatus = 500
				return
			}

			var b db.Book = db.Book(bookInfo)
			if e := db.Insert(&b); e != nil {
				if !mgo.IsDup(e) {
					err = e
					responseStatus = 500
					return
				}
			}

			b.Modificate()

			if data, err = json.Marshal(b); err != nil {
				responseStatus = 500
				return
			}

			rw.Write(data)
			responseStatus = 200

		} else {
			responseStatus = http.StatusMethodNotAllowed
		}
	})
}
