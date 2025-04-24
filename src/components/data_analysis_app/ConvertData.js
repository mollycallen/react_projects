import React, { useState, useEffect, useRef } from 'react'
import { Calendar, Hash, Type } from 'lucide-react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import './styles/data_analysis.css'
import { getDataTypeColor } from './utils'

const ConvertData = ({ headers, data, onProcessedData }) => {
  const [columnTypes, setColumnTypes] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const convertButtonRef = useRef(null)

  useEffect(() => {
    // Initialize all columns
    const initialTypes = headers.reduce((acc, header) => {
      acc[header.column] = header.datatype
      return acc
    }, {})
    setColumnTypes(initialTypes)
  }, [headers])

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        convertButtonRef.current &&
        !convertButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelectColumn = (column, type) => {
    setColumnTypes(prevTypes => ({
      ...prevTypes,
      [column]: type
    }))
  }

  const processData = () => {
    // Process the data based on columnTypes
    const processedData = data.map(row =>
      row.map((value, index) => {
        const column = headers[index].column
        switch (columnTypes[column]) {
          case 'numeric':
            return convertToNumeric(value)
          case 'date':
            return convertToDate(value)
          default:
            return value
        }
      })
    )

    // Update headers with new types
    const updatedHeaders = headers.map(header => ({
      ...header,
      datatype: columnTypes[header.column]
    }))

    onProcessedData(processedData, updatedHeaders)
    setIsOpen(false)
  }

  const convertToNumeric = value => {
    if (typeof value !== 'string') return value
    const cleanedValue = value.replace(/[^\d.-]/g, '')
    const num = parseFloat(cleanedValue)
    return isNaN(num) ? value : num
  }

  const convertToDate = value => {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return value // Return original value if it's not a valid date
    }
    // Format date as YYYY-MM-DD
    return date.toISOString().split('T')[0]
  }

  const renderTooltip = (props, text) => (
    <Tooltip id={`tooltip-${text}`} {...props}>
      {text}
    </Tooltip>
  )

  return (
    <div className='convert-data-container mt-4 mb-3'>
      <div className='w-100'>
        <div className='dropdown w-100' ref={dropdownRef}>
          <button
            className='btn btn-secondary dropdown-toggle w-100'
            type='button'
            onClick={() => setIsOpen(!isOpen)}
          >
            Configure Column Types
          </button>
          {isOpen && (
            <div className='dropdown-menu show w-100'>
              <div className='container-fluid p-3'>
                <div className='row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3'>
                  {headers.map(header => (
                    <div key={header.column} className='col'>
                      <div className='d-flex justify-content-between align-items-center border rounded p-2'>
                        <span
                          className='text-truncate me-2'
                          title={header.column}
                        >
                          {header.column}
                        </span>
                        <div className='btn-group' role='group'>
                          <OverlayTrigger
                            placement='top'
                            overlay={props => renderTooltip(props, 'string')}
                          >
                            <button
                              className={`btn btn-sm px-1 ${
                                columnTypes[header.column] === 'string'
                                  ? 'btn-' + getDataTypeColor('string')
                                  : 'btn-outline-secondary'
                              }`}
                              onClick={() =>
                                handleSelectColumn(header.column, 'string')
                              }
                            >
                              <Type size={14} />
                            </button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement='top'
                            overlay={props => renderTooltip(props, 'numeric')}
                          >
                            <button
                              className={`btn btn-sm px-1 ${
                                columnTypes[header.column] === 'numeric'
                                  ? 'btn-' + getDataTypeColor('numeric')
                                  : 'btn-outline-secondary'
                              }`}
                              onClick={() =>
                                handleSelectColumn(header.column, 'numeric')
                              }
                            >
                              <Hash size={14} />
                            </button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement='top'
                            overlay={props => renderTooltip(props, 'date')}
                          >
                            <button
                              className={`btn btn-sm px-1 ${
                                columnTypes[header.column] === 'date'
                                  ? 'btn-' + getDataTypeColor('date')
                                  : 'btn-outline-secondary'
                              }`}
                              onClick={() =>
                                handleSelectColumn(header.column, 'date')
                              }
                            >
                              <Calendar size={14} />
                            </button>
                          </OverlayTrigger>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='row mt-3'>
                  <div className='col d-flex justify-content-end'>
                    <button
                      className='btn btn-primary'
                      onClick={processData}
                      ref={convertButtonRef}
                    >
                      Convert Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConvertData
