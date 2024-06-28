import "../App.css";
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useReducer,
} from "react";
import { Book } from "../alltypes";
import { state } from "../alltypes";
import { reducer } from "../hooks/bookReducer";

import "../App.css";
import axios from "axios";
interface BookListProps {
  booksPerPage: number;
}

const initialstate: state = {
  books: [],
  searchquery: "",
  currentpage: 1,
  booksperpage: 5,
};

const BookList: React.FC<BookListProps> = ({ booksPerPage }) => {
  const [addBook, setAddBook] = useState<Book[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [editBook, setEditBook] = useState<number>(0);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editPublicationYear, setEditPublicationYear] = useState<number>(0);

  const [userData, setUserData] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchItem, setSearchItem] = useState<boolean>(false);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks =
    userData && userData.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(userData && userData.length / booksPerPage);

  const [State, dispatch] = useReducer(reducer, initialstate);

  const handleSearch = useCallback(
    (searchTerm: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "SEARCH_BOOK", payload: searchTerm.target.value });
      setSearchItem(true);
    },
    [dispatch]
  );

  const getBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://book-store-api-8rtp.onrender.com/api/books"
      );
      let jsonData = await response.data;

      // Filter books if searchquery is not empty
      if (State.searchquery.trim() !== "") {
        jsonData = jsonData.filter(
          (book: Book) =>
            book.title
              .toLowerCase()
              .includes(State.searchquery.toLowerCase()) ||
            book.author.toLowerCase().includes(State.searchquery.toLowerCase())
        );
      }

      setUserData(jsonData);
    } catch (error) {
      console.log("Error fetching books", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // Disable the button and prevent further submissions

    const title = titleRef.current!.value;
    const author = authorRef.current!.value;
    const publicationYear = yearRef.current!.value;

    const book = {
      title,
      author,
      publicationYear,
    };

    try {
      const response = await axios.post(
        "https://book-store-api-8rtp.onrender.com/api/book",
        book
      );
      const jsonData = await response.data;
      setAddBook([...addBook, jsonData]);
      // Optionally reset the form fields here if desired
      titleRef.current!.value = "";
      authorRef.current!.value = "";
      yearRef.current!.value = "";
      if (response.status !== 201) {
        console.log("Error creating book");
      } else {
        console.log("Book created successfully");
      }
    } catch (error) {
      console.log("Error creating book", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  const [deleteData, setDeleteData] = useState<Book[]>([]);
  const [updateData, setUpdateData] = useState<Book[]>([]);

  const handleDeleteBook = async (id: number) => {
    const response = await axios.delete(
      `https://book-store-api-8rtp.onrender.com/api/book/${id}`
    );
    const jsonData = await response.data;
    setDeleteData(jsonData);
    if (response.status !== 200) {
      console.log("Error deleting book");
    } else {
      console.log("Book deleted successfully");
    }
    dispatch({ type: "DELETE_BOOK", payload: id });
  };

  //relender the page after delete and update
  useEffect(() => {
    getBooks();
  }, [deleteData, updateData, addBook, searchItem, State.searchquery]);

  const handleUpdateBook = async (book: Book) => {
    setEditBook(book.id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditPublicationYear(book.publicationYear);
  };

  const handleSaveEdit = async (id: number) => {
    const response = await axios.put(
      `https://book-store-api-8rtp.onrender.com/api/book/${id}`,
      {
        title: editTitle,
        author: editAuthor,
        publicationYear: editPublicationYear,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) { // Assuming 200 is the success status code for updates
      const updatedBook = response.data;
      // Update the book in userData without altering the order
      const updatedBooks = userData.map(book => {
        if (book.id === id) {
          return { ...book, ...updatedBook };
        }
        return book;
      });
      setUserData(updatedBooks);
      console.log("Book updated successfully");
    } else {
      console.log("Error updating book");
    }
    setUpdateData(updateData)
    setEditBook(0); // Reset edit state
  };

  const handlePageChange = useCallback((Num: number) => {
    setCurrentPage(Num);
  }, []);

  return (
    <div className="booklist">
      <div className="search">
        <input
          type="text"
          placeholder="Enter book to search..."
          value={State.searchquery}
          onChange={handleSearch}
          title="text"
        />
      </div>
      <form className="forminput">
        <input ref={titleRef} type="text" placeholder="Title" required />
        <input ref={authorRef} type="text" placeholder="Author" required />
        <input
          ref={yearRef}
          type="number"
          placeholder="Publication Year"
          required
        />
        <button
          type="button"
          className="addbtn"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Book"}
        </button>
      </form>
      <table border={1}>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publication Year</th>
            <th id="actions">Actions</th>
          </tr>
          {loading && (
            <tr className="loadingtd">
              <td className="loading">Loading... 🔄</td>
            </tr>
          )}
          {currentBooks &&
            currentBooks.map((filterBooks) => (
              <tr key={filterBooks.id}>
                <td>
                  {editBook === filterBooks.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      title="title"
                    />
                  ) : (
                    filterBooks.title
                  )}
                </td>
                <td>
                  {editBook === filterBooks.id ? (
                    <input
                      type="text"
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                      title="author"
                    />
                  ) : (
                    filterBooks.author
                  )}
                </td>
                <td>
                  {editBook === filterBooks.id ? (
                    <input
                      type="number"
                      value={editPublicationYear}
                      onChange={(e) =>
                        setEditPublicationYear(parseInt(e.target.value))
                      }
                      title="publicationYear"
                    />
                  ) : (
                    filterBooks.publicationYear
                  )}
                </td>
                <td>
                  {editBook === filterBooks.id ? (
                    <button onClick={() => handleSaveEdit(filterBooks.id)}>
                      Save
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleUpdateBook(filterBooks)}>
                        Update
                      </button>
                      <button onClick={() => handleDeleteBook(filterBooks.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => {
            handlePageChange(currentPage - 1);
          }}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => {
            handlePageChange(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;
