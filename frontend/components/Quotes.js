import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setHighlightedQuote,
  toggleVisibility,
} from '../state/quotesSlice'
import { useGetQuotesQuery, useDeleteQuoteMutation, useToggleFakeMutation } from '../state/quotesApi'

export default function Quotes() {
  const { data: quotes = [], isLoading, isError } = useGetQuotesQuery()
  const [deleteQuote, { isLoading: isDeleting }] = useDeleteQuoteMutation()
  const [toggleFake, { isLoading: isToggling }] = useToggleFakeMutation()

  const displayAllQuotes = useSelector(st => st.quotes.displayAllQuotes)
  const highlightedQuote = useSelector(st => st.quotes.highlightedQuote)
  const dispatch = useDispatch()
  
  if (isLoading) {
    return <div id="quotes">
      <h3>Loading quotes...</h3>
      <div className="loading-message">Please wait while we fetch the quotes...</div>
    </div>
  }

  if (isError) {
    return <div id="quotes">
       <h3>Error!</h3>
      <div className="error-message">Failed to load quotes. Please try again later.</div>
    </div>
  }

  const handleDelete = async (id) => {
    try {
      await deleteQuote(id)
    } catch (err) {
      console.error('Failed to delete quote:', err)
    }
  }

  const handleToggleFake = async (id, currentApocryphal) => {
    try {
      await toggleFake({ id, apocryphal: !currentApocryphal })
    } catch (err) {
      console.error('Failed to toggle fake status:', err)
    }
  }

  return (
    <div id="quotes">
      <h3>Quotes</h3>
      {(isDeleting || isToggling) && (
        <div className="loading-message">Processing your request...</div>
      )}
      <div>
        {
          quotes?.filter(qt => {
            return displayAllQuotes || !qt.apocryphal
          })
            .map(qt => (
              <div
                key={qt.id}
                className={`quote${qt.apocryphal ? " fake" : ''}${highlightedQuote === qt.id ? " highlight" : ''}`}
              >
                <div>{qt.quoteText}</div>
                <div>{qt.quoteAuthor}</div>
                <div className="quote-buttons">

                  <button
                  onClick={() => handleDelete(qt.id)}
                  disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'DELETE'}
                    </button>
                  <button onClick={() => dispatch(setHighlightedQuote(qt.id))}>HIGHLIGHT</button>
                  <button
                  onClick={() => handleToggleFake(qt.id, qt.apocryphal)}
                  disabled={isToggling}
                  >
                    {isToggling ? 'Updating...' : (qt.apocryphal ? 'REAL' : 'FAKE')}
                    </button>
                
              </div>
              </div>
            ))
        }
        {
          !quotes?.length && "No quotes here! Go write some."
        }
      </div>
      {!!quotes?.length && <button onClick={() => dispatch(toggleVisibility())}>
        {displayAllQuotes ? 'HIDE' : 'SHOW'} FAKE QUOTES
      </button>}
    </div>
  )
}
