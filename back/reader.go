package main

import (
	"bytes"
	"fmt"
	"log"
	"os"
	"time"

	"gopkg.in/cheggaaa/pb.v1"

	"./reader"
	"./translate"
)

// read books
type fileReader struct{}

func (r fileReader) ReadBook(path string) {
	var (
		err      error
		file     *os.File
		words    []string
		rdr      reader.BookReader
		bookInfo reader.BookInfo
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

	if words, bookInfo, err = rdr.ReadBook(buf.Bytes()); err != nil {
		log.Fatal(err)
	}

	uniqueWords := getUniqueWords(words)

	fmt.Printf("%d unique words\n", len(uniqueWords))
	fmt.Printf("starting translate book %s...\n", path)
	fmt.Println(bookInfo.Author)
	fmt.Println(bookInfo.Genre)

	var t translate.ENRUTranslator

	bar := pb.StartNew(len(uniqueWords))
	for _, v := range uniqueWords {
		if _, e := t.Translate(v); e != nil {
			log.Fatal(e)
		}
		bar.Increment()
		time.Sleep(time.Millisecond)
	}
	bar.FinishPrint("Successfully read book!")

}
