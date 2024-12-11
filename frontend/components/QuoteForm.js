import React, { useReducer, useState } from 'react'
import { useCreateQuoteMutation } from '../state/quotesApi'

const CHANGE_INPUT = 'CHANGE_INPUT'
const RESET_FORM = 'RESET_FORM'

const initialState = {
  authorName: '',  
  quoteText: '',
}

const reducer = (state, action) => {
  switch (action.type) {
    case CHANGE_INPUT: {
      const { name, value } = action.payload
      return { ...state, [name]: value }
    }
    case RESET_FORM:
      return initialState
    default:
      return state
  }
}

export default function QuoteForm() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [createQuote, { isLoading: creatingQuote, error: creationError }] = useCreateQuoteMutation()
  const [validationErrors, setValidationErrors] = useState({})

  const onChange = ({ target: { name, value } }) => {
    dispatch({ type: CHANGE_INPUT, payload: { name, value } })
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const resetForm = () => {
    dispatch({ type: RESET_FORM })
    setValidationErrors({})
  }

  const validateForm = (authorName, quoteText) => {
    const errors = {}
    if (authorName.length <= 2) {
      errors.authorName = 'Author name must be longer than 2 characters'
    }
    if (quoteText.length <= 2) {
      errors.quoteText = 'Quote text must be longer than 2 characters'
    }
    return errors
  }

  const onNewQuote = async evt => {
    evt.preventDefault()
    
    const newQuote = {
      authorName: state.authorName.trim(),
      quoteText: state.quoteText.trim()
    }

    const errors = validateForm(newQuote.authorName, newQuote.quoteText)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      await createQuote(newQuote).unwrap()
      resetForm()
    } catch (err) {
      console.log('Error details:', {
        status: err.status,
        data: err.data,
        error: err
      })
      
      if (err.status === 422) {
        setValidationErrors({
          authorName: newQuote.authorName.length <= 2 ? 'Author name must be longer than 2 characters' : '',
          quoteText: newQuote.quoteText.length <= 2 ? 'Quote text must be longer than 2 characters' : ''
        })
      }
    }
  }

  return (
    <form id="quoteForm" onSubmit={onNewQuote}>
      <h3>New Quote Form</h3>
      {creatingQuote && (
        <div className="loading-message">Creating your quote...</div>
      )}
      {creationError && !Object.keys(validationErrors).length && (
        <div className="error-message">
          {creationError.status === 422
            ? 'Both author and quote must be longer than 2 characters.'
            : 'Failed to create quote. Please try again.'}
        </div>
      )}
      <label>
        <span>Author:</span>
        <input
          type="text"
          name="authorName"
          placeholder="type author name"
          onChange={onChange}
          value={state.authorName}
          disabled={creatingQuote}
        />
        {validationErrors.authorName && (
          <div className="validation-error">{validationErrors.authorName}</div>
        )}
      </label>
      <label>
        <span>Quote text:</span>
        <textarea
          name="quoteText"
          placeholder="type quote"
          onChange={onChange}
          value={state.quoteText}
          disabled={creatingQuote}
        />
        {validationErrors.quoteText && (
          <div className="validation-error">{validationErrors.quoteText}</div>
        )}
      </label>
      <label>
        <span>Create quote:</span>
        <button
          type="submit"
          disabled={creatingQuote || !state.authorName.trim() || !state.quoteText.trim()}
        >
          {creatingQuote ? 'Creating...' : 'DO IT!'}
        </button>
      </label>
    </form>
  )
}