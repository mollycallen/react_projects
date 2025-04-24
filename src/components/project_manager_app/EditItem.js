import React, { useState } from 'react'
import { Check, X } from 'lucide-react'

const EditItem = ({ initialText, onSave, onCancel }) => {
  const [editedText, setEditedText] = useState(initialText)

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      onSave(editedText)
    }
  }

  const handleSave = () => {
    onSave(editedText)
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <>
      <input
        type='text'
        className='form-control pe-5'
        value={editedText}
        onChange={e => setEditedText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <div
        className='position-absolute'
        style={{
          right: '5px',
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      >
        <button
          className='btn btn-link text-success p-1 m-0'
          onClick={handleSave}
        >
          <Check size={20} />
        </button>
        <button
          className='btn btn-link text-danger p-1 m-0'
          onClick={handleCancel}
        >
          <X size={20} />
        </button>
      </div>
    </>
  )
}

export default EditItem
