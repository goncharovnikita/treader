package server

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"../db"
)

// handle /get/books
func getBooksHandler() http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		var responseStatus int
		start := time.Now()
		defer func() {
			if responseStatus != 200 {
				rw.WriteHeader(responseStatus)
			}
			infoLogger.Printf("%s %s %d %s\n", r.URL, r.Method, responseStatus, time.Since(start))
		}()
		if r.Method == http.MethodOptions {
			rw.Header().Add("Access-Control-Allow-Headers", "user-id")
			responseStatus = http.StatusNoContent
		} else if r.Method == http.MethodGet {
			var (
				err      error
				user     db.User
				response []byte
				result   = make(map[string]struct {
					Book     db.Book     `json:"Book"`
					BookInfo db.UserBook `json:"BookInfo"`
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
					Book     db.Book     `json:"Book"`
					BookInfo db.UserBook `json:"BookInfo"`
				}{
					Book:     b,
					BookInfo: v,
				}
			}

			if response, err = json.Marshal(result); err != nil {
				log.Println(err)
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

// updateBookInfo updates book information
func updateBookInfoHandler() http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		var responseStatus int
		start := time.Now()
		defer func() {
			if responseStatus != 200 {
				rw.WriteHeader(responseStatus)
			}
			infoLogger.Printf("%s %s %d %s\n", r.URL, r.Method, responseStatus, time.Since(start))
		}()
		if r.Method == http.MethodOptions {
			rw.Header().Add("Access-Control-Allow-Headers", "content-type, user-id")
			rw.Header().Add("Access-Control-Allow-Method", "POST")
			responseStatus = http.StatusNoContent
		} else if r.Method == http.MethodPost {
			var (
				err    error
				user   db.User
				params db.UserBook
			)

			userID := r.Header.Get("user-id")
			if len(userID) < 1 {
				responseStatus = 401
				return
			}

			if err = db.GetOne(userID, &user); err != nil {
				log.Println(err)
				responseStatus = 500
				return
			}

			defer r.Body.Close()

			if err = json.NewDecoder(r.Body).Decode(&params); err != nil {
				log.Println(err)
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

			user.Books[params.ID] = newBook

			if err = db.Update(userID, &user); err != nil {
				log.Println(err)
				responseStatus = 500
				return
			}

			responseStatus = 204
		} else {
			responseStatus = http.StatusMethodNotAllowed
		}
	})
}
