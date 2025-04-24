import React, { useState, useCallback, useMemo } from 'react'
import FileUploader from './FileUploader'
import ConvertData from './ConvertData'
import DisplayData from './DisplayData'
import NumericAnalysis from './NumericAnalysis'
import BoxplotVisualization from './BoxplotVisualization'
import DataVisualization from './DataVisualization'

import { DATA_TYPES } from './utils'

const CSVAnalyzer = () => {
  const [csvData, setCsvData] = useState([])
  const [headers, setHeaders] = useState([])
  const [processedData, setProcessedData] = useState([])

  const handleLoadData = useCallback(data => {
    if (data.length > 0) {
      const headerObjects = data[0].map(column => ({
        column,
        datatype: DATA_TYPES.STRING
      }))
      const newCsvData = data.slice(1)
      setHeaders(headerObjects)
      setCsvData(newCsvData)
      setProcessedData(newCsvData)
    }
  }, [])

  const handleProcessedData = useCallback(
    (newProcessedData, updatedHeaders) => {
      setProcessedData(newProcessedData)
      setHeaders(updatedHeaders)
    },
    []
  )

  // Memoize DisplayData as it's likely to render large datasets
  const memoizedDisplayData = useMemo(
    () => <DisplayData data={processedData} headers={headers} />,
    [processedData, headers]
  )

  // Memoize DataAnalysis if it performs complex calculations or renders charts
  const memoizedNumericAnalysis = useMemo(
    () => <NumericAnalysis data={processedData} headers={headers} />,
    [processedData, headers]
  )

  return (
    <div className='container mt-5'>
      <h2 className='mb-3'>CSV Analyzer</h2>
      <FileUploader onLoadData={handleLoadData} showPreview={false} />
      {processedData.length > 0 && (
        <>
          {memoizedDisplayData}
          <ConvertData
            headers={headers}
            data={csvData}
            onProcessedData={handleProcessedData}
          />
          {memoizedNumericAnalysis}
          <DataVisualization data={processedData} headers={headers} />
          <BoxplotVisualization data={processedData} headers={headers} />
        </>
      )}
    </div>
  )
}

export default CSVAnalyzer
