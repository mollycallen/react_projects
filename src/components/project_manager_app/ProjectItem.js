import React, { useState, useContext } from 'react'
import { Trash2, Pencil } from 'lucide-react'
import { ThemeContext } from '../../App' // Adjust the import path as necessary
import EditItem from './EditItem'

const ProjectItem = ({ project, index, onSaveEdit, onDeleteProject }) => {
  const [editing, setEditing] = useState(false)
  const { darkMode } = useContext(ThemeContext)

  const bgStyles = darkMode
    ? 'bg-secondary bg-opacity-25'
    : 'bg-secondary-subtle bg-opacity-25'

  const startEditing = () => {
    setEditing(true)
  }

  const saveEdit = newText => {
    onSaveEdit(project.id, newText)
    setEditing(false)
  }

  const cancelEdit = () => {
    setEditing(false)
  }

  return (
    <div
      className={`d-flex my-1 g-0 row align-items-center border-start border-3 border-primary ${
        index % 2 !== 0 ? bgStyles : ''
      }`}
    >
      <div className='col-7 d-flex align-items-center'>
        <div className='flex-grow-1 position-relative'>
          {editing ? (
            <EditItem
              initialText={project.text}
              onSave={saveEdit}
              onCancel={cancelEdit}
            />
          ) : (
            <div className='project-text text-wrap text-break ps-1'>
              <span>{project.text}</span>
              <button
                className='btn btn-link text-primary ms-1 mb-1 p-0 me-2'
                onClick={startEditing}
              >
                <Pencil size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className='col-5 d-flex justify-content-between align-items-center'>
        <div className='small' style={{ textWrap: 'nowrap' }}>
          {project.timestamp}
        </div>
        <button
          className='btn btn-link text-danger p-0 ms-0'
          onClick={() => onDeleteProject(project.id)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default React.memo(ProjectItem)
