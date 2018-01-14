package server

import (
	"io/ioutil"
	"os"
)

// cache type
type cache struct{}

func (c cache) add(name string, content []byte) (err error) {
	var (
		file *os.File
	)

	if file, err = os.OpenFile("/server/cache/"+name, os.O_CREATE|os.O_WRONLY, 0666); err != nil {
		return
	}

	defer file.Close()

	if _, err = file.Write(content); err != nil {
		return
	}

	return
}

func (c cache) retrieve(name string) (result []byte, err error) {
	var file *os.File

	if file, err = os.OpenFile("/server/cache/"+name, os.O_RDONLY, 0666); err != nil {
		return
	}

	defer file.Close()

	if result, err = ioutil.ReadAll(file); err != nil {
		return
	}

	return
}
