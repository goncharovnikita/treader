package main

import (
	"log"
)

func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func main() {
	// s := server.Server

	// s.Start()

	var r fileReader

	r.ReadBook("test_books/The_Murder_of_Roger_Ackroyd-Agatha_Christie.fb2")
}
