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

// get unique words map from words array
func getUniqueWords(words []string) (result map[string]string) {
	result = map[string]string{}
	for _, v := range words {
		l := strings.ToLower(v)
		if _, exists := result[l]; !exists {
			result[l] = l
		}
	}

	return
}
