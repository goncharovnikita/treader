package main

import (
	"bytes"
	"fmt"
	"log"
	"os"

	reader "./reader"
)

// read books
type fileReader struct{}

func (r fileReader) ReadBook(path string) {
	var (
		err   error
		file  *os.File
		words []string
		rdr   reader.BookReader
	)

	extension := getFileExtension(path)
	buf := new(bytes.Buffer)

	if file, err = os.OpenFile(path, os.O_RDONLY, 0666); err != nil {
		log.Fatal(err)
	}

	defer file.Close()

	if _, err = buf.ReadFrom(file); err != nil {
		log.Fatal(err)
	}

	switch extension {
	case "fb2":
		rdr = reader.FB2Reader{}
		break
	default:
		log.Fatalf("unsupported format: %s\n", extension)
	}

	if words, err = rdr.ReadBook(buf.Bytes()); err != nil {
		log.Fatal(err)
	}

	fmt.Println(words[:5])

}
