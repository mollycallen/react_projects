import React, { useState, useRef, useEffect } from 'react'
import Papa from 'papaparse'
import { ChevronUp, ChevronDown } from 'lucide-react'

const FileUploader = ({ onLoadData, showPreview = true }) => {
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewHeight, setPreviewHeight] = useState('auto')
  const previewRef = useRef(null)

  useEffect(() => {
    if (previewRef.current) {
      setPreviewHeight(
        isPreviewOpen ? `${previewRef.current.scrollHeight}px` : '0px'
      )
    }
  }, [isPreviewOpen, preview])

  const isValidFileType = file => {
    const validExtensions = ['csv', 'tsv']
    const validMimeTypes = ['text/csv', 'text/tab-separated-values']

    const fileExtension = file.name.split('.').pop().toLowerCase()
    const fileMimeType = file.type

    return (
      validExtensions.includes(fileExtension) &&
      validMimeTypes.includes(fileMimeType)
    )
  }

  const handleFileUpload = event => {
    const file = event.target.files[0]
    setError('')
    setPreview('')

    if (!file) return

    if (!isValidFileType(file)) {
      setError('Invalid file type. Please upload a CSV or TSV file.')
      return
    }

    Papa.parse(file, {
      complete: result => {
        if (result.errors.length > 0) {
          setError("Error parsing file. Please ensure it's a valid CSV or TSV.")
          return
        }
        const previewText = result.data
          .slice(0, 5)
          .map(row => row.join(', '))
          .join('\n')
        setPreview(previewText)
        setIsPreviewOpen(false) // Close preview when new file is uploaded
        onLoadData(result.data)
      }
    })
  }

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen)
  }

  return (
    <div style={{ width: 'fitContent', maxWidth: '100%', overflow: 'hidden' }}>
      <input
        type='file'
        accept='.csv,.tsv'
        onChange={handleFileUpload}
        className='form-control mb-3'
      />
      {error && (
        <div className='alert alert-danger mt-3' role='alert'>
          {error}
        </div>
      )}
      {showPreview && preview && (
        <div className='card mt-3'>
          <div className='card-header d-flex justify-content-between align-items-center'>
            <h5 className='mb-0'>File Preview</h5>
            <button
              className='btn btn-link p-0'
              type='button'
              onClick={togglePreview}
              aria-expanded={isPreviewOpen}
            >
              {isPreviewOpen ? (
                <ChevronUp size={24} />
              ) : (
                <ChevronDown size={24} />
              )}
            </button>
          </div>
          <div
            ref={previewRef}
            style={{
              maxHeight: previewHeight,
              overflow: 'hidden',
              transition: 'max-height 0.3s ease-out'
            }}
          >
            <div className='card-body p-0'>
              <div
                className='bg-white p-2'
                style={{
                  overflowX: 'auto'
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: '0.8rem',
                    whiteSpace: 'pre',
                    fontFamily: 'monospace'
                  }}
                >
                  {preview}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader
