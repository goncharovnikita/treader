
export class BooksHelper {
  public static GetTitle(b: Book): string {
    return b.Description.TitleInfo.BookTitle;
  }

  public static GetAuthor(b: Book): string {
    const aPath      = b.Description.DocumentInfo.Author[0];
    if (!aPath) { return 'Unknown Author'; }
    const firstName  = aPath.FirstName ? aPath.FirstName : '';
    const middleName = aPath.MiddleName ? aPath.MiddleName : '';
    const lastName   = aPath.LastName ? aPath.LastName : '';
    return `${firstName} ${middleName} ${lastName}`;
  }
}
