import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { DATA_TYPES } from './utils'

const NumericAnalysis = ({ data, headers }) => {
  const [analysis, setAnalysis] = useState([])

  useEffect(() => {
    const performAnalysis = () => {
      const numericAnalysis = headers.reduce((acc, header, index) => {
        // Only analyze columns marked as numeric
        if (header.datatype === DATA_TYPES.NUMERIC) {
          // Extract data for the current column
          const allColumnData = data.map(row => row[index])

          // Clean and convert the data to numbers
          const columnData = allColumnData
            .map(val => {
              // Remove non-numeric characters except decimal point and minus sign
              const cleanVal =
                typeof val === 'string' ? val.replace(/[^0-9.-]/g, '') : val
              const numVal = parseFloat(cleanVal)
              return !isNaN(numVal) ? numVal : null
            })
            .filter(val => val !== null)

          // Skip analysis if no valid numeric data is found
          if (columnData.length === 0) {
            return acc
          }

          const sortedData = _.sortBy(columnData)

          // Perform statistical analysis on the column data
          const columnAnalysis = {
            column: header.column,
            count: columnData.length,
            missingValues: allColumnData.length - columnData.length,
            mean: _.mean(columnData),
            median:
              columnData.length % 2 === 0
                ? (sortedData[columnData.length / 2 - 1] +
                    sortedData[columnData.length / 2]) /
                  2
                : sortedData[Math.floor(columnData.length / 2)],
            min: _.min(columnData),
            max: _.max(columnData),
            sum: _.sum(columnData),
            variance:
              _.sum(
                _.map(columnData, n => Math.pow(n - _.mean(columnData), 2))
              ) / columnData.length,
            q1: sortedData[Math.floor(columnData.length / 4)],
            q3: sortedData[Math.floor((columnData.length * 3) / 4)],
            mode: _.head(_(columnData).countBy().entries().maxBy(_.last)),
            uniqueCount: _.uniq(columnData).length
          }

          // Calculate standard deviation
          columnAnalysis.stdDev = Math.sqrt(columnAnalysis.variance)

          acc.push(columnAnalysis)
        }
        return acc
      }, [])

      setAnalysis(numericAnalysis)
    }

    // Only perform analysis when we have data and column information
    if (data.length > 0 && headers.length > 0) {
      performAnalysis()
    }
  }, [data, headers])

  return (
    <div className='data-analysis container-fluid pt-3'>
      {analysis.length > 0 && (
        <>
          <h5>Numeric Data Analysis</h5>
          <div
            className='table-responsive'
            style={{ overflow: 'auto', fontSize: '0.9rem' }}
          >
            <table className='table table-hover table-bordered'>
              <thead>
                <tr>
                  <th
                    scope='col'
                    className='fw-medium position-sticky start-0 z-1 bg-secondary-subtle'
                    style={{ minWidth: '120px' }}
                  ></th>
                  {analysis.map(columnAnalysis => (
                    <th
                      scope='col'
                      className='fw-medium bg-secondary-subtle'
                      key={columnAnalysis.column}
                    >
                      {columnAnalysis.column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(analysis[0])
                  .filter(key => key !== 'column')
                  .map(statistic => (
                    <tr key={statistic}>
                      <th
                        scope='row'
                        className='fw-medium position-sticky start-0 z-1 bg-light'
                        style={{ minWidth: '120px' }}
                      >
                        {statistic}
                      </th>
                      {analysis.map(columnAnalysis => (
                        <td key={`${columnAnalysis.column}-${statistic}`}>
                          {typeof columnAnalysis[statistic] === 'number'
                            ? columnAnalysis[statistic].toFixed(2)
                            : columnAnalysis[statistic]}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default NumericAnalysis
