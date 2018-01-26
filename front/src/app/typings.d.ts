declare type Book = {
  Description: {
    TitleInfo: {
      Genre: string;
			Author:     AuthorType[]
			BookTitle:  string  
			Annotation: string  
			Keywords:   string  
			Date:       string  
			Coverpage: {
				Image: string[]
			}
			Lang:       string    
			SrcLang:    string    
			Translator: AuthorType
			Sequence:   string    
    }
    DocumentInfo: {
      Author:      AuthorType[]
      ProgramUsed: string      
      Date:        string      
      SrcURL:      string[]
      SrcOcr:      string      
      ID:          string      
      Version:     number     
      History:     string      
    }
  }
  Body: {
    Sections: {
      P: string[]
    }[]
  }
  PageNumber: number;
  TotalPages: number;
}

declare type AuthorType = {
  FirstName:  string
	MiddleName: string
	LastName:   string
	Nickname:   string
	HomePage:   string
	Email:      string
}