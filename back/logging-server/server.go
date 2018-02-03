package loggingServer

import (
	"log"
	"net"
)

func init() {
	log.SetFlags(log.Llongfile | log.LstdFlags)
}

// Serve starts tcp server for listening incoming reports
func Serve() {
	log.Println("Starting tcp server on 8081 port...")
	ln, err := net.Listen("tcp", ":8081")
	if err != nil {
		log.Fatal(err)
	}

	for {
		defer func() {
			if err := recover(); err != nil {
				log.Println(err)
			}
		}()
		conn, err := ln.Accept()
		if err != nil {
			log.Println(err)
		}

		go func(c net.Conn) {
			defer c.Close()
			c.Write([]byte("hello!"))
		}(conn)

	}
}
