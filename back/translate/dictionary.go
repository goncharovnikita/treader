package translate

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
)

// this file contain dictionary read/write

// Dictionary object
var Dictionary dictionary

func init() {
	d := dictionary{filename: "translate/dictionary.json"}

	d.open()

	Dictionary = d
}

// Dictionary type
type dictionary struct {
	Words    map[string]string
	filename string
	file     *os.File
}

// open and parse dictionary.json
func (d *dictionary) open() {
	var (
		err   error
		file  *os.File
		words map[string]string
		data  []byte
	)

	if file, err = os.OpenFile(d.filename, os.O_RDONLY, 0666); err != nil {
		log.Fatal(err)
	}

	defer file.Close()

	if data, err = ioutil.ReadAll(file); err != nil {
		log.Fatal(err)
	}

	if err = json.Unmarshal(data, &words); err != nil {
		log.Fatal(err)
	}

	d.Words = words
}

// Add add word to dictionary
func (d *dictionary) Add(en string, ru string) (err error) {
	var data []byte
	var file *os.File
	d.Words[en] = ru

	if file, err = os.OpenFile(d.filename, os.O_RDWR|os.O_TRUNC, 0666); err != nil {
		return
	}

	defer file.Close()

	if data, err = json.Marshal(d.Words); err != nil {
		return
	}

	if _, err = file.Write(data); err != nil {
		return
	}

	return
}
