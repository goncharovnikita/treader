package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"../../db"
	"../../db/models"
)

// UpdateLexiconHandler updates user's lexicon
func UpdateLexiconHandler() http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		var responseStatus int
		var err error
		start := time.Now()
		defer reqLogger(&rw, &responseStatus, r.URL, r.Method, &start)
		defer errLogger(&err)
		if r.Method == http.MethodOptions {
			responseStatus = corsPOSTHandler(rw)
		} else if r.Method == http.MethodPost {
			responseStatus, err = updateLexicon(r)
		} else {
			responseStatus = http.StatusMethodNotAllowed
		}
	})
}

// update lexicon handler
func updateLexicon(r *http.Request) (int, error) {
	var (
		err    error
		params struct {
			Lang  string   `json:"lang"`
			Words []string `json:"words"`
		}
		userStat db.UserStatistic
	)

	userID := r.Header.Get("user-id")
	if len(userID) < 1 {
		return 401, nil
	}

	defer r.Body.Close()

	if err = json.NewDecoder(r.Body).Decode(&params); err != nil {
		return 500, err
	}

	userStat.ID = userID

	if err = db.GetOne(userID, &userStat); err != nil {
		if err.Error() == "not found" {
			userStat.Lexicon = make(map[string]map[string]map[string]string)
			userStat.Lexicon[params.Lang] = map[string]map[string]string{
				time.Now().Format(time.UnixDate): mapray(params.Words),
			}

			if err = db.Insert(&userStat); err != nil {
				log.Println(err)
				return 500, err
			}
			return 204, nil
		}
		return 401, nil
	}

	if _, ok := userStat.Lexicon[params.Lang]; !ok {
		userStat.Lexicon[params.Lang] = make(map[string]map[string]string)
		userStat.Lexicon[params.Lang] = map[string]map[string]string{
			time.Now().Format(time.UnixDate): mapray(params.Words),
		}

		if err = db.Update(userID, &userStat); err != nil {
			return 500, err
		}
		return 204, nil
	}

	if _, ok := userStat.Lexicon[params.Lang][time.Now().Format(time.UnixDate)]; ok {
		userStat.Lexicon[params.Lang][time.Now().Format(time.UnixDate)] = conmap(userStat.Lexicon[params.Lang], params.Words)
		if err = db.Update(userID, &userStat); err != nil {
			return 500, err
		}
		return 204, nil
	}

	userStat.Lexicon[params.Lang][time.Now().Format(time.UnixDate)] = make(map[string]string)
	userStat.Lexicon[params.Lang][time.Now().Format(time.UnixDate)] = conmap(userStat.Lexicon[params.Lang], params.Words)
	if err = db.Update(userID, &userStat); err != nil {
		return 500, err
	}
	return 204, nil
}

// AddBookToUserHandler adds book to user if it exists
func AddBookToUserHandler() http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		var responseStatus int
		var err error
		start := time.Now()
		defer reqLogger(&rw, &responseStatus, r.URL, r.Method, &start)
		defer errLogger(&err)
		if r.Method == http.MethodOptions {
			responseStatus = corsPOSTHandler(rw)
		} else if r.Method == http.MethodPost {
			userID := r.Header.Get("user-id")
			bookID := r.URL.Query().Get("book_id")
			if len(userID) < 1 {
				responseStatus = 401
				return
			}

			if len(bookID) < 1 {
				responseStatus = http.StatusBadRequest
				return
			}

			var (
				user db.User
				book db.Book
			)

			if err = db.GetOne(userID, &user); err != nil {
				responseStatus = 500
				return
			}

			if err = db.GetOne(bookID, &book); err != nil {
				responseStatus = 500
				return
			}

			if _, exists := user.Books[bookID]; exists {
				responseStatus = 204
				return
			}

			if len(user.Books) < 1 {
				user.Books = make(map[string]models.UserBook)
			}

			user.Books[bookID] = models.UserBook{
				ID:             bookID,
				LastPage:       0,
				LastTotalPages: 0,
				LastOpenedDate: "",
				TotalOpenings:  0,
				LastReadWords:  0,
				Read:           false,
			}

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

// GetUserStatisticHandler handle request for user's statistics
func GetUserStatisticHandler() http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		var responseStatus int
		var err error
		start := time.Now()
		defer reqLogger(&rw, &responseStatus, r.URL, r.Method, &start)
		defer errLogger(&err)
		if r.Method == http.MethodOptions {
			responseStatus = corsPOSTHandler(rw)
		} else if r.Method == http.MethodGet {
			userID := r.Header.Get("user-id")
			if len(userID) < 1 {
				responseStatus = 401
			}

			var (
				stats    db.UserStatistic
				response []byte
			)

			if err = db.GetOne(userID, &stats); err != nil {
				responseStatus = 500
				return
			}

			if response, err = json.Marshal(&stats); err != nil {
				responseStatus = 500
				return
			}

			rw.Write(response)
			responseStatus = 200

		} else {
			responseStatus = 405
		}
	})
}
