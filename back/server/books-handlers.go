package server

import (
	"encoding/json"
	"fmt"
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
			fmt.Printf("%s %s %d %s\n", r.URL, r.Method, responseStatus, time.Since(start))
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
					db.Book
					db.UserBook
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

			for i, v := range user.Books {
				var b db.Book
				if err = db.GetOne(i, &b); err != nil {
					log.Println(err)
					return
				}
				result[b.ID] = struct {
					db.Book
					db.UserBook
				}{
					b,
					v,
				}
			}

			if response, err = json.Marshal(result); err != nil {
				log.Println(err)
				responseStatus = 500
				return
			}

			rw.Write(response)
		} else {
			responseStatus = http.StatusMethodNotAllowed
		}
	})
}
