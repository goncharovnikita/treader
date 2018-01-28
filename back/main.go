package main

import (
	"log"

	"./config"
	"./db"
	"./server"
)

func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func main() {
	s := server.Server

	db.Connect(config.DBURL, config.DBName)
	s.Start()
}
