import { useCallback,useReducer } from 'react'
import './App.css'
import Form from './components/form'
import BookList from './components/bookList'
// import useBooksReducer from './hooks/bookReducer'
import {reducer} from './hooks/bookReducer'
// import {Book} from './alltypes'
import {state} from './alltypes'

const initialstate: state = {
  books: [],
  searchquery: "",
  currentpage: 1,
  booksperpage: 5,
};



function App() {
  const [state, dispatch] = useReducer(reducer,initialstate)

  const handleSearch = useCallback((searchTerm: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SEARCH_BOOK', payload: searchTerm.target.value })
  }, [dispatch])

  // const filterBooks = state.books && state.books.filter((book) => book.title.toLowerCase().includes(state.searchquery.toLowerCase()))
  const booksPerPage:number=5;


  return (
    <>
    <div className="bookApp">
      <h1>Book App</h1>
     <div>
      <Form />
      <div className='search'>
      <input type='text' placeholder='Enter book to search...' value={state.searchquery} onChange={handleSearch} title="text"/>
      </div>
      <BookList  dispatch={dispatch}  booksPerPage={booksPerPage}/>
     </div>
    </div>
    </>
  )
}

export default App
