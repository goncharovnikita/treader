package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

// Server server
var Server server

func init() {
	port := os.Getenv("PORT")
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

	h.Handle("/new/book/", newBookHandler())
	h.Handle("/translate", translateWordHandler())

	log.Fatal(http.ListenAndServe(s.port, h))
}
