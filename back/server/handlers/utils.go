package handlers

import (
	"log"
	"net/http"
	"os"
)

func init() {
	log.SetFlags(log.Lshortfile)
}

var infoLogger = log.New(os.Stdout, "SERVER: ", log.Ltime|log.Ldate)

// handle CORS POST
func corsPOSTHandler(rw http.ResponseWriter) int {
	rw.Header().Add("Access-Control-Allow-Method", "POST")
	rw.Header().Add("Access-Control-Allow-Headers", "content-type, user-id")
	return 204
}

// transform array to map
func mapray(v []string) map[string]string {
	result := make(map[string]string, len(v))
	for _, v := range v {
		if _, exists := result[v]; !exists {
			result[v] = v
		}
	}
	return result
}

// analyze existing map's entities and return unique values from given array as map
func conmap(v map[string]map[string]string, b []string) map[string]string {
	result := make(map[string]string)
	uniqs := make(map[string]string)

	for _, v := range v {
		for i, k := range v {
			if _, exists := uniqs[i]; !exists {
				uniqs[i] = k
			}
		}
	}

	for _, v := range b {
		if _, exists := uniqs[v]; !exists {
			result[v] = v
		}
	}

	return result

}