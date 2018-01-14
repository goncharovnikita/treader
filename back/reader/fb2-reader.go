// Package reader implements reading and
// parsing fb2 file formats
package reader

import "fmt"

// FB2Reader implements BookReader
// form .fb2 format
type FB2Reader struct{}

// ReadBook implementation
func (f FB2Reader) ReadBook(data []byte) (words []string, err error) {
	fmt.Printf("fb2 reader starts read %d bytes of data...\n", len(data))
	lines := 0
	tagOpened := false
	tagName := ""
	tags := []string{}
	bodyStartIndex := 0
	bodyEndIndex := 0
	for i, v := range data {
		if !tagOpened {
			if v == byte(60) {
				tagOpened = true
			}
		} else {
			if v == byte(62) {
				if tagName == "body" {
					bodyStartIndex = i + 1
				} else if tagName == "/body" {
					bodyEndIndex = i - 7
				}
				tagOpened = false
				tags = append(tags, tagName)
				tagName = ""
			} else {
				tagName += string(v)
			}
		}
		if v == byte(10) {
			lines++
		}
	}
	words, err = f.readBody(data[bodyStartIndex:bodyEndIndex])
	fmt.Printf("file contains %d lines, %d words\n", lines, len(words))
	fmt.Printf("body starts at index %d, ends at index %d\n", bodyStartIndex, bodyEndIndex)

	return
}

// read body of .fb2 file
func (f FB2Reader) readBody(body []byte) (words []string, err error) {
	wordStart := false
	word := ""
	tagStart := false
	for _, v := range body {
		// if tag was started, check next symbol for '<'
		if tagStart {
			if v == byte(62) {
				tagStart = false
			}
		} else {
			// if word was started
			if wordStart {
				// if symbol is a character
				if v == byte(60) {
					tagStart = true
				} else if v > 32 {
					word += string(v)
				} else {
					words = append(words, word)
					word = ""
					wordStart = false
				}
			} else {
				if v == byte(60) {
					tagStart = true
				} else if v > 32 {
					wordStart = true
					word += string(v)
				}
			}
		}
	}
	return
}
