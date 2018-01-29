// Package config responsible for providing all neccessary configuration
// data
package config

import (
	"log"
	"os"
)

var (
	// ServerPort is main server port for listening incoming connections
	ServerPort string
	// DBURL is database connection url
	DBURL string
	// DBName is database name
	DBName string
	// DBUsername is username to authenticate in database
	DBUsername string
	//DBPWD is user's password to authenticate in database
	DBPWD string
	// TranslateURL is url, which be used for translate queries
	TranslateURL string
)

func init() {
	ServerPort = os.Getenv("PORT")
	DBURL = os.Getenv("DBURL")
	TranslateURL = os.Getenv("TRANSLATE_URL")
	DBName = os.Getenv("DBName")
	DBPWD = os.Getenv("DBPWD")
	DBUsername = os.Getenv("DBUsername")
	errs := make([]string, 0)
	if len(ServerPort) < 1 {
		errs = append(errs, "server port not specified")
	}
	if len(DBURL) < 1 {
		errs = append(errs, "database url not specified")
	}
	if len(TranslateURL) < 1 {
		errs = append(errs, "translate url not specified")
	}
	if len(DBName) < 1 {
		errs = append(errs, "database name not specified")
	}
	if len(DBPWD) < 1 {
		errs = append(errs, "database password not specified")
	}
	if len(DBUsername) < 1 {
		errs = append(errs, "database username not specified")
	}

	if len(errs) > 0 {
		for _, v := range errs {
			log.Printf("%s\n", v)
		}
		log.Fatalln("could not parse configuration")
	}
}
