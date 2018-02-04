package loggingServer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func init() {
	log.SetFlags(log.Llongfile | log.LstdFlags)
}

const hookURL = "https://api.goncharovnikita.com/tg/hooks/new/error"

// Serve starts tcp server for listening incoming reports
func Serve() {

}

// SendLog sends error message to telegram bot
func SendLog(m string) {
	const prefix = "ERROR FROM TREADER: "
	params := struct {
		ErrorMessage string `json:"error_message"`
	}{ErrorMessage: m}
	data, err := json.Marshal(params)
	if err != nil {
		log.Println(err)
		return
	}

	r, e := http.Post(hookURL, "application/json", bytes.NewReader(data))
	defer r.Body.Close()
	if e != nil {
		log.Println(e)
	}

	fmt.Printf("%s\n", r.Status)

}
