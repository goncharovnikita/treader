// Package reader implements reading and
// parsing fb2 file formats
package reader

import (
	"fmt"
	"strings"
)

// FB2Reader implements BookReader
// form .fb2 format
type FB2Reader struct{}

// ReadBook implementation
func (f FB2Reader) ReadBook(data []byte) (words []string, bookInfo BookInfo, err error) {
	fmt.Printf("fb2 reader starts read %d bytes of data...\n", len(data))
	lines := 0
	tagOpened := false
	tagName := ""
	tags := []string{}
	bodyStartIndex := 0
	bodyEndIndex := 0
	descriptionStartIndex := 0
	descriptionEndIndex := 0
	for i, v := range data {
		if !tagOpened {
			if v == byte(60) {
				tagOpened = true
			}
		} else {
			if v == byte(62) {
				switch tagName {
				case "body":
					bodyStartIndex = i + 1
					break
				case "/body":
					bodyEndIndex = i - 7
					break
				case "description":
					descriptionStartIndex = i + 1
					break
				case "/description":
					descriptionEndIndex = i - 13
					break
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
	if words, err = f.readBody(data[bodyStartIndex:bodyEndIndex]); err != nil {
		return
	}

	if bookInfo, err = f.parseBookInfo(data[descriptionStartIndex:descriptionEndIndex]); err != nil {
		return
	}

	bookInfo.Content = strings.Split(string(data[bodyStartIndex:bodyEndIndex]), "\n")

	fmt.Printf("file contains %d lines, %d words\n", lines, len(words))
	fmt.Printf("body starts at index %d, ends at index %d\n", bodyStartIndex, bodyEndIndex)

	return
}

// parse book info
func (f FB2Reader) parseBookInfo(desc []byte) (bookInfo BookInfo, err error) {
	tagStart := false
	tag := ""
	genreStartIndex := 0
	genreEndIndex := 0
	authorStartIndex := 0
	authorEndIndex := 0
	for i, v := range desc {
		if tagStart {
			if v == byte(62) {
				tagStart = false
				switch tag {
				case "genre":
					genreStartIndex = i + 1
					break
				case "author":
					authorStartIndex = i + 1
					break
				case "/genre":
					genreEndIndex = i - 7
					break
				case "/author":
					authorEndIndex = i - 8
					break
				}
				tag = ""
			} else {
				tag += string(v)
			}
		} else {
			if v == byte(60) {
				tagStart = true
			}
		}
	}
	if authorEndIndex > 0 {
		bookInfo.Author = string(desc[authorStartIndex:authorEndIndex])
	}
	if genreEndIndex > 0 {
		bookInfo.Genre = string(desc[genreStartIndex:genreEndIndex])
	}
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
				} else if v > 64 && v < 91 || v > 96 && v < 123 {
					word += string(v)
				} else {
					words = append(words, word)
					word = ""
					wordStart = false
				}
			} else {
				if v == byte(60) {
					tagStart = true
				} else if v > 64 && v < 91 || v > 96 && v < 123 {
					wordStart = true
					word += string(v)
				}
			}
		}
	}
	return
}
