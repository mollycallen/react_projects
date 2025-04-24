import React, { useState, useEffect, useCallback } from 'react'
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs
} from 'firebase/firestore'
import { db } from '../../firebase.config'
import AddProject from './AddProject'
import ProjectList from './ProjectList'

export default function ProjectManager () {
  const [projects, setProjects] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const collectionRef = collection(db, 'todo')

  useEffect(() => {
    const getProjects = async () => {
      try {
        const snapshot = await getDocs(collectionRef)
        const todoData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }))
        setProjects(todoData)
      } catch (err) {
        console.log(err)
        setErrorMessage('An error occurred while fetching projects.')
      }
    }
    getProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddProject = async text => {
    const newProject = {
      text: text,
      timestamp: new Date().toLocaleString()
    }
    try {
      const docRef = await addDoc(collectionRef, newProject)
      setProjects(prevProjects => [
        ...prevProjects,
        { ...newProject, id: docRef.id }
      ])
    } catch (err) {
      console.log(err)
      setErrorMessage('An error occurred while adding the project.')
    }
  }

  const deleteProject = useCallback(async id => {
    try {
      const documentRef = doc(db, 'todo', id)

      await deleteDoc(documentRef)
      setProjects(prevProjects =>
        prevProjects.filter(project => project.id !== id)
      )
    } catch (err) {
      console.log(err)
      setErrorMessage('An error occurred while deleting the project.')
    }
  }, [])

  const saveEdit = useCallback(async (id, newText) => {
    const updatedProject = {
      text: newText,
      timestamp: new Date().toLocaleString()
    }

    try {
      const todoDocument = doc(db, 'todo', id)
      await updateDoc(todoDocument, updatedProject)
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === id ? { ...project, ...updatedProject } : project
        )
      )
    } catch (err) {
      console.log(err)
      setErrorMessage('An error occurred while updating the project.')
    }
  }, [])

  return (
    <div className='mt-4 w-100'>
      <AddProject onAddProject={handleAddProject} />
      {errorMessage && (
        <div
          className='alert alert-danger alert-dismissible fade show mt-3'
          role='alert'
        >
          {errorMessage}
          <button
            type='button'
            className='btn-close'
            onClick={() => setErrorMessage(null)}
            aria-label='Close'
          ></button>
        </div>
      )}
      <ProjectList
        key={projects.length}
        projects={projects}
        onSaveEdit={saveEdit}
        onDeleteProject={deleteProject}
      />
    </div>
  )
}
