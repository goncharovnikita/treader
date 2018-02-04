package server

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"../config"
	"./handlers"
)

// Server server
var Server server
var infoLogger = log.New(os.Stdout, "SERVER: ", log.Ltime|log.Ldate)

func init() {
	log.SetFlags(log.Llongfile | log.Ldate)
	log.SetPrefix("SERVER: ")
	port := config.ServerPort
	if len(port) < 1 {
		log.Fatalln("could not start server - port not specified")
	}
	s := server{port: port}
	Server = s
}

// server type
type server struct {
	port string
}

// Start starts the server
func (s server) Start() {
	fmt.Printf("starting http server of %s port...\n", s.port)
	h := http.NewServeMux()

	h.Handle("/new/book", corsProvider(handlers.NewBookHandler())) // Deprecated
	h.Handle("/get/books", corsProvider(handlers.GetBooksHandler()))
	h.Handle("/update/book/info", corsProvider(handlers.UpdateBookInfoHandler()))
	h.Handle("/translate", translateWordHandler())
	h.Handle("/user/", corsProvider(http.StripPrefix("/user", handlers.HandleUser())))
	h.Handle("/book/", corsProvider(http.StripPrefix("/book", handlers.HandleBook())))

	log.Fatal(http.ListenAndServe(s.port, h))
}
