import { Book } from "../alltypes";
import { ActionType } from "../alltypes";
import { state } from "../alltypes";


export const reducer = (state: state, action: ActionType): state => {
  switch (action.type) {
    case "SET_BOOK":
      return { ...state, books: action.payload };
    case "SEARCH_BOOK":
      return { ...state, searchquery: action.payload };
    case "setCurrentPage_BOOK":
      return { ...state, currentpage: action.payload };
    case "CREATE_BOOK":
      return { ...state, books: [...state.books, action.payload] };
    case "READ_BOOK":
        return {
            ...state,
            books: state.books && state.books.map((book: Book) =>
                book.id === action.payload ? { ...book } : book
            ),
            }
    case "UPDATE_BOOK":
      return {
        ...state,
        books: state.books && state.books.map((book: Book) =>
          book.id === action.payload.id ? action.payload : book
        ),
      };
    case "DELETE_BOOK":
      return {
        ...state,
        books: state.books && state.books.filter((book: Book) => book.id !== action.payload),
      };
    default:
      return state;
  }
};

// export const useBooksReducer = () => {
//   const [storedBooks, setStoredBooks] = useLocalStorage("books", []);
//   const [state, dispatch] = useReducer(reducer, { ...initialstate, books: storedBooks });

//   useEffect(() => {
//     setStoredBooks(state.books);
//   }, [state.books]);

//   return [state, dispatch] as [state, React.Dispatch<ActionType>];
// };

// export default useBooksReducer;