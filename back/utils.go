package main

import (
	"strings"
)

// this file contains utils

// get file extension from name
func getFileExtension(filename string) string {
	a := strings.Split(filename, ".")
	return a[len(a)-1]
}
