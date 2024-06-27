export interface Book {
    id: number;
    title: string;
    author: string;
    publicationYear: number;
    isEditing?: boolean;
    // read: boolean;
}
export type ActionType =
| { type: 'SET_BOOK'; payload: Book[]}
| { type: 'SEARCH_BOOK'; payload: string }
  | { type: 'CREATE_BOOK'; payload: Book }
  | { type: 'setCurrentPage_BOOK'; payload: number }
  | { type: 'READ_BOOK'; payload: number }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'DELETE_BOOK'; payload: number }

  export interface state {
    books: Book[];
    searchquery: string;
    currentpage: number;
    booksperpage: number;
  }