import "../App.css";
import React, { useState, useCallback, useEffect } from "react";
import { ActionType } from "../alltypes";
import { Book } from "../alltypes";

import "../App.css";
import axios from "axios";
interface BookListProps {
  dispatch: React.Dispatch<ActionType>;
  booksPerPage: number;
}

const bookList: React.FC<BookListProps> = ({ dispatch, booksPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editBook, setEditBook] = useState<number>(0);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editPublicationYear, setEditPublicationYear] = useState<number>(0);

  const [userData, setUserData] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
 

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks =
    userData && userData.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(userData && userData.length / booksPerPage);

  const getBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://book-store-api-8rtp.onrender.com/api/books"
      );
      const jsonData = await response.data;
      setUserData(jsonData);
    } catch (error) {
      console.log("Error fetching books", error);
    }finally{
      setLoading(false);
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
  }, [deleteData, updateData]);

  const handleUpdateBook = async (book: Book) => {
    setEditBook(book.id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditPublicationYear(book.publicationYear);
    const response = await axios.put(
      `https://book-store-api-8rtp.onrender.com/api/book/${book.id}`,
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
    const jsonData = await response.data;
    setUpdateData(jsonData);
    if (response.status !== 201) {
      console.log("Error updating book");
    } else {
      console.log("Book updated successfully");
    }
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
    const jsonData = await response.data;
    setUpdateData(jsonData);
    dispatch({
      type: "UPDATE_BOOK",
      payload: {
        id,
        title: editTitle,
        author: editAuthor,
        publicationYear: editPublicationYear,
      },
    });
    setEditBook(0);
  };

  const handlePageChange = useCallback((Num: number) => {
    setCurrentPage(Num);
  }, []);

  return (
    <div className="booklist">
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

export default bookList;
