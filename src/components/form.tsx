import { useRef } from "react";
import "../App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Book } from "../alltypes";
import {reducer} from '../hooks/bookReducer'
import {state} from '../alltypes'
import {useReducer } from 'react'

const initialstate: state = {
  books: [],
  searchquery: "",
  currentpage: 1,
  booksperpage: 5,
};
const [State, dispatch] = useReducer(reducer,initialstate)


const BookForm = () => {
  const [input, setInput] = useState({ title: "", author: "", year: "" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [addBook, setAddBook] = useState<Book[]>([]);

  const handleSubmit = async () => {
    if (!input.title.trim() || !input.author.trim() || !input.year.trim())
      return;

    const book = {
      title: input.title,
      author: input.author,
      publicationYear: input.year,
    };

    try {
      const response = await axios.post(
        "https://book-store-api-8rtp.onrender.com/api/book",
        book
      );
      dispatch({ type: "CREATE_BOOK", payload: response.data });
      setInput({ title: "", author: "", year: "" });
      inputRef.current?.focus();
      const jsonData = await response.data;
      setAddBook([...addBook, jsonData]);
      if (response.status !== 201) {
        console.log("Error creating book");
      } else {
        console.log("Book created successfully");
      }
    } catch (error) {
      console.log("Error creating book", error);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    handleSubmit();
  }, [addBook]);

  return (
    <form className="forminput">
      <input
        ref={inputRef}
        type="text"
        name="title"
        value={input.title}
        onChange={handleInputChange}
        placeholder="Title"
      />
      <input
        type="text"
        name="author"
        value={input.author}
        onChange={handleInputChange}
        placeholder="Author"
      />
      <input
        type="number"
        name="year"
        value={input.year}
        onChange={handleInputChange}
        placeholder="Year"
      />
      <button type="submit" className="addbtn" onClick={handleSubmit}>
        Add Book
      </button>
    </form>
  );
};

export default BookForm;
