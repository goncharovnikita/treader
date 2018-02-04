
declare type UserStatistics = {
  ID: string;
  Lexicon;
}

declare type Lexicon = {
  [key: string]: { // Language
    [key: string]: { // Date
      [key: string]: string; // Word: word
    }
  }
}
