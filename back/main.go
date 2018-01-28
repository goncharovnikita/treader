package main

import (
	"log"

	_ "./config"
	"./server"
)

func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func main() {
	s := server.Server

	s.Start()
}
