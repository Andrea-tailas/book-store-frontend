import { useRef, useState ,useEffect} from "react";
import "../App.css";
import axios from "axios";
import { Book } from "../alltypes";

const BookForm = () => {
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const [addBook, setAddBook] = useState<Book[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // New state to control submission

  useEffect(() => {
    // This function could be used to fetch and display books
    const fetchBooks = async () => {
      try {
        const response = await axios.get("https://book-store-api-8rtp.onrender.com/api/books");
        setAddBook(response.data);
      } catch (error) {
        console.error("Failed to fetch books", error);
      }
    };

    fetchBooks();
  }, [addBook.length]);

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
      titleRef.current!.value = '';
      authorRef.current!.value = '';
      yearRef.current!.value = '';
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

  return (
    <form className="forminput">
      <input ref={titleRef} type="text" placeholder="Title" required />
      <input ref={authorRef} type="text" placeholder="Author" required />
      <input ref={yearRef} type="number" placeholder="Publication Year" required />
      <button type="button" className="addbtn" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Book'}
      </button>
    </form>
  );
};

export default BookForm;