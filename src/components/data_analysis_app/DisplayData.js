import React, { useState, useMemo } from 'react'
import _ from 'lodash'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { getDataTypeColor } from './utils'

const DisplayData = ({ data, headers }) => {
  const [rowSelection, setRowSelection] = useState('First')
  const [sortColumn, setSortColumn] = useState({
    column: null,
    direction: 'asc'
  })

  const sortedData = useMemo(() => {
    if (sortColumn.column === null) return data

    const columnIndex = headers.findIndex(h => h.column === sortColumn.column)
    const sorted = _.sortBy(data, row => {
      const value = row[columnIndex]
      return isNaN(value) ? value : Number(value)
    })

    return sortColumn.direction === 'desc' ? sorted.reverse() : sorted
  }, [data, headers, sortColumn])

  const getDisplayedRows = () => {
    switch (rowSelection) {
      case 'First':
        return sortedData.slice(0, 10)
      case 'Last':
        return sortedData.slice(-10)
      case 'Random':
        return _.sampleSize(sortedData, Math.min(10, sortedData.length))
      default:
        return sortedData.slice(0, 10)
    }
  }

  const handleSelectionChange = event => {
    setRowSelection(event.target.value)
  }

  const handleSort = column => {
    setSortColumn(prevSort => ({
      column,
      direction:
        prevSort.column === column && prevSort.direction === 'asc'
          ? 'desc'
          : 'asc'
    }))
  }

  const displayedRows = getDisplayedRows()

  return (
    <div className='display-data-container mt-4'>
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <select
          className='form-select w-auto'
          value={rowSelection}
          onChange={handleSelectionChange}
        >
          <option value='First'>First 10 Rows</option>
          <option value='Last'>Last 10 Rows</option>
          <option value='Random'>Random 10 Rows</option>
        </select>

        <div className='me-3'>Total Rows: {data.length}</div>
      </div>
      <div className='table-responsive'>
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          <table
            className='table table-bordered table-striped'
            style={{ fontSize: '.9rem' }}
          >
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className={`text-center p-0 position-sticky top-0 bg-white ${
                      sortColumn.column === header.column
                        ? 'bg-primary-subtle'
                        : ''
                    }`}
                  >
                    <div className='d-flex flex-column justify-content-between'>
                      <button
                        onClick={() => handleSort(header.column)}
                        className='btn btn-link p-2 text-decoration-none w-100'
                        style={{
                          fontWeight:
                            sortColumn.column === header.column
                              ? 'bold'
                              : 'normal'
                        }}
                      >
                        <div className='d-flex align-items-center justify-content-center'>
                          <span>{header.column}</span>
                          {sortColumn.column === header.column && (
                            <span className='ms-1'>
                              {sortColumn.direction === 'asc' ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </span>
                          )}
                        </div>
                      </button>
                      <div className='mb-1'>
                        <span
                          className={`badge fw-medium text-bg-${getDataTypeColor(
                            header.datatype
                          )}`}
                        >
                          {header.datatype}
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`text-center p-1 ${
                        sortColumn.column === headers[cellIndex].column
                          ? 'bg-primary-subtle'
                          : ''
                      }`}
                    >
                      {row[cellIndex] !== undefined ? row[cellIndex] : 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DisplayData
