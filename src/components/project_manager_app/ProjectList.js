import { useEffect, useState, useCallback } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import ProjectItem from './ProjectItem'

const ProjectList = ({ projects, onSaveEdit, onDeleteProject }) => {
  const [sort, setSort] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [sortedProjects, setSortedProjects] = useState([])

  const sortProjects = useCallback(() => {
    let sorted = [...projects]
    if (sort === 'project') {
      sorted.sort((a, b) => a.text.localeCompare(b.text))
    } else if (sort === 'date') {
      sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    }
    if (sortDirection === 'desc') {
      sorted.reverse()
    }
    setSortedProjects(sorted)
  }, [sort, sortDirection, projects])

  useEffect(() => {
    sortProjects()
  }, [sortProjects])

  const handleSort = field => {
    if (sort === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSort(field)
      setSortDirection('asc')
    }
  }

  return (
    <div className='mt-4 w-100'>
      {sortedProjects.length > 0 && (
        <div className='row mb-2 mx-1 border-bottom border-secondary-subtle '>
          <div className='col-7'>
            <button
              className='btn btn-link p-0 m-0 text-decoration-none'
              onClick={() => handleSort('project')}
            >
              Project
              {sort === 'project' &&
                (sortDirection === 'asc' ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                ))}
            </button>
          </div>
          <div className='col-5'>
            <button
              className='btn btn-link p-0 m-0 text-decoration-none'
              onClick={() => handleSort('date')}
            >
              Date
              {sort === 'date' &&
                (sortDirection === 'asc' ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                ))}
            </button>
          </div>
        </div>
      )}
      <div
        className='project-list-container'
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%'
        }}
      >
        {sortedProjects.map((project, index) => (
          <ProjectItem
            key={project.id}
            project={project}
            index={index}
            onSaveEdit={onSaveEdit}
            onDeleteProject={onDeleteProject}
          />
        ))}
      </div>
    </div>
  )
}

export default ProjectList
