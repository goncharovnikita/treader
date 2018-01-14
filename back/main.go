package main

import (
	"log"

	"./server"
)

func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func main() {
	s := server.Server

	s.Start()
}
