import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Filter } from 'bad-words'

const AddProject = ({ onAddProject }) => {
  const [text, setText] = useState('')

  const filter = new Filter()

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddProject()
    }
  }

  const handleAddProject = () => {
    if (text.trim() !== '') {
      const cleanText = filter.clean(text)
      onAddProject(cleanText)
      setText('')
    }
  }

  return (
    <div className='d-flex'>
      <textarea
        className='form-control'
        id='projectInput'
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Enter Project Description'
        rows={2}
        style={{
          resize: 'none',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0
        }}
      />
      <button
        className='btn btn-success d-flex align-items-center justify-content-center'
        style={{
          width: '50px',
          flexShrink: 0,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0
        }}
        onClick={handleAddProject}
      >
        <Plus size={24} />
      </button>
    </div>
  )
}

export default AddProject
