package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"../../db"
)

// UpdateLexiconHandler updates user's lexicon
func UpdateLexiconHandler() http.Handler {
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
			responseStatus = corsPOSTHandler(rw)
		} else if r.Method == http.MethodPost {
			responseStatus = updateLexicon(r)
		} else {
			responseStatus = http.StatusMethodNotAllowed
		}
	})
}

// update lexicon handler
func updateLexicon(r *http.Request) int {
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
		return 401
	}

	defer r.Body.Close()

	if err = json.NewDecoder(r.Body).Decode(&params); err != nil {
		log.Print(err)
		return 500
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
				return 500
			}
			return 204
		}
		return 401
	}

	if _, ok := userStat.Lexicon[params.Lang]; !ok {
		userStat.Lexicon[params.Lang] = make(map[string]map[string]string)
		userStat.Lexicon[params.Lang] = map[string]map[string]string{
			time.Now().Format(time.UnixDate): mapray(params.Words),
		}

		if err = db.Update(userID, &userStat); err != nil {
			log.Println(err)
			return 500
		}
		return 204
	}

	if _, ok := userStat.Lexicon[params.Lang][time.Now().Format(time.UnixDate)]; ok {
		userStat.Lexicon[params.Lang][time.Now().Format(time.UnixDate)] = conmap(userStat.Lexicon[params.Lang], params.Words)
		if err = db.Update(userID, &userStat); err != nil {
			log.Println(err)
			return 500
		}
		return 204
	}

	userStat.Lexicon[params.Lang][time.Now().Format(time.UnixDate)] = make(map[string]string)
	userStat.Lexicon[params.Lang][time.Now().Format(time.UnixDate)] = conmap(userStat.Lexicon[params.Lang], params.Words)
	if err = db.Update(userID, &userStat); err != nil {
		log.Println(err)
		return 500
	}
	return 204
}
