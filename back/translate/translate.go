// Package translate implements translations from
// english to russian
package translate

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

var (
	translateURL string
)

func init() {
	translateURL = os.Getenv("TRANSLATE_URL")
	if len(translateURL) < 1 {
		log.Fatalln("Could not translate, translate url not specified")
	}
	translateURL += "?client=gtx&sl=en&tl=ru&dt=t&q="
}

// Translator interface
type Translator interface {
	Translate(string) (string, error)
}

// ENRUTranslator implements translator
// from english to russian
type ENRUTranslator struct{}

// translateResponse type
type translateResponse []interface{}

// Translate implementation
func (t ENRUTranslator) Translate(word string) (result string, err error) {
	var (
		body      []byte
		response  *http.Response
		tResponse translateResponse
		raw       interface{}
	)

	if response, err = http.Get(translateURL + word); err != nil {
		return
	}

	defer response.Body.Close()

	if body, err = ioutil.ReadAll(response.Body); err != nil {
		return
	}

	if err = json.Unmarshal(body, &raw); err != nil {
		return
	}

	tResponse = raw.([]interface{})

	tResponse = tResponse[0].([]interface{})

	tResponse = tResponse[0].([]interface{})

	result, _ = tResponse[0].(string)

	return
}
