import React, { useState, useMemo } from 'react'
import { DATA_TYPES } from './utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from 'recharts'

const DataVisualization = ({ data, headers }) => {
  const [selectedXColumn, setSelectedXColumn] = useState('')
  const [selectedYColumn, setSelectedYColumn] = useState('')

  const availableColumns = headers
    .filter(
      header =>
        header.datatype === DATA_TYPES.DATE ||
        header.datatype === DATA_TYPES.NUMERIC
    )
    .map(header => ({
      column: header.column,
      datatype: header.datatype
    }))

  const chartData = useMemo(() => {
    if (!selectedXColumn || !selectedYColumn) return []

    const xHeaderIndex = headers.findIndex(h => h.column === selectedXColumn)
    const yHeaderIndex = headers.findIndex(h => h.column === selectedYColumn)
    const xDataType = headers[xHeaderIndex].datatype
    const yDataType = headers[yHeaderIndex].datatype

    let processedData = data.map(row => {
      let xValue = row[xHeaderIndex]
      let yValue = row[yHeaderIndex]

      // Parse the values based on their data types
      if (xDataType === DATA_TYPES.DATE) {
        xValue = new Date(xValue).getTime() // Convert to timestamp
      } else if (xDataType === DATA_TYPES.NUMERIC) {
        xValue = parseFloat(xValue)
      }

      if (yDataType === DATA_TYPES.DATE) {
        yValue = new Date(yValue).getTime() // Convert to timestamp
      } else if (yDataType === DATA_TYPES.NUMERIC) {
        yValue = parseFloat(yValue)
      }

      return {
        xValue,
        yValue,
        originalXValue: row[xHeaderIndex],
        originalYValue: row[yHeaderIndex]
      }
    })

    // Sort data based on x-axis values
    processedData.sort((a, b) => a.xValue - b.xValue)

    return processedData
  }, [data, headers, selectedXColumn, selectedYColumn])

  const formatValue = (value, columnName) => {
    if (value === undefined || value === null) return ''

    const header = headers.find(h => h.column === columnName)
    if (!header) return value

    if (header.datatype === DATA_TYPES.DATE) {
      const date = new Date(typeof value === 'number' ? value : value)
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const year = date.getFullYear().toString().slice(-2)
      return `${month}-${day}-${year}`
    }
    return value
  }

  const getAxisType = columnName => {
    if (!columnName) return 'number'
    const header = headers.find(h => h.column === columnName)
    return header?.datatype === DATA_TYPES.DATE ? 'number' : 'number'
  }

  return (
    <div className='mt-4'>
      <h3>Data Visualization</h3>
      <div className='row mb-3'>
        <div className='col-md-6'>
          <label htmlFor='xColumnSelect' className='form-label'>
            Select X-axis column:
          </label>
          <select
            id='xColumnSelect'
            className='form-select'
            value={selectedXColumn}
            onChange={e => setSelectedXColumn(e.target.value)}
          >
            <option value=''>Select a column</option>
            {availableColumns.map(({ column, datatype }) => (
              <option key={column} value={column}>
                {column} ({datatype})
              </option>
            ))}
          </select>
        </div>
        <div className='col-md-6'>
          <label htmlFor='yColumnSelect' className='form-label'>
            Select Y-axis column:
          </label>
          <select
            id='yColumnSelect'
            className='form-select'
            value={selectedYColumn}
            onChange={e => setSelectedYColumn(e.target.value)}
          >
            <option value=''>Select a column</option>
            {availableColumns.map(({ column, datatype }) => (
              <option key={column} value={column}>
                {column} ({datatype})
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedXColumn && selectedYColumn && (
        <ResponsiveContainer width='100%' height={400}>
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 60,
              bottom: 70
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='xValue'
              type={getAxisType(selectedXColumn)}
              domain={['auto', 'auto']}
              tickFormatter={value => formatValue(value, selectedXColumn)}
              height={70}
            >
              <Label value={selectedXColumn} position='bottom' offset={0} />
            </XAxis>
            <YAxis
              dataKey='yValue'
              type={getAxisType(selectedYColumn)}
              domain={['auto', 'auto']}
              tickFormatter={value => formatValue(value, selectedYColumn)}
            >
              <Label
                value={selectedYColumn}
                position='left'
                angle={-90}
                offset={30}
              />
            </YAxis>
            <Tooltip
              formatter={(value, name) => {
                if (name === 'yValue') {
                  return formatValue(value, selectedYColumn)
                }
                return formatValue(value, selectedXColumn)
              }}
              labelFormatter={value => formatValue(value, selectedXColumn)}
            />
            <Line
              type='monotone'
              dataKey='yValue'
              stroke='#8884d8'
              name={selectedYColumn}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default DataVisualization
