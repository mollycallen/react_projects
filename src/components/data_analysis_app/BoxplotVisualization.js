import React, { useState, useMemo } from 'react'
import { DATA_TYPES } from './utils'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

const BoxplotVisualization = ({ data, headers }) => {
  const [selectedNumericColumn, setSelectedNumericColumn] = useState('')

  const numericColumns = headers
    .filter(header => header.datatype === DATA_TYPES.NUMERIC)
    .map(header => header.column)

  const chartData = useMemo(() => {
    if (!selectedNumericColumn) return []
    const values = data
      .map(row =>
        parseFloat(
          row[headers.findIndex(h => h.column === selectedNumericColumn)]
        )
      )
      .sort((a, b) => a - b)
    const q1 = values[Math.floor(values.length * 0.25)]
    const median = values[Math.floor(values.length * 0.5)]
    const q3 = values[Math.floor(values.length * 0.75)]
    const iqr = q3 - q1
    const min = q1 - 1.5 * iqr
    const max = q3 + 1.5 * iqr
    return [
      {
        name: selectedNumericColumn,
        min,
        q1,
        median,
        q3,
        max
      }
    ]
  }, [data, headers, selectedNumericColumn])

  return (
    <div className='mt-4'>
      <h3>Data Visualization</h3>
      <div className='mb-3'>
        <label htmlFor='numericColumnSelect' className='form-label'>
          Select numeric column:
        </label>
        <select
          id='numericColumnSelect'
          className='form-select'
          value={selectedNumericColumn}
          onChange={e => setSelectedNumericColumn(e.target.value)}
        >
          <option value=''>Select a numeric column</option>
          {numericColumns.map(column => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
      </div>
      {selectedNumericColumn && (
        <ResponsiveContainer width='100%' height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='min' stackId='a' fill='#8884d8' />
            <Bar dataKey='q1' stackId='a' fill='#82ca9d' />
            <Bar dataKey='median' stackId='a' fill='#ffc658' />
            <Bar dataKey='q3' stackId='a' fill='#82ca9d' />
            <Bar dataKey='max' stackId='a' fill='#8884d8' />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default BoxplotVisualization
