import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Legend
} from 'recharts'

const LineGraphDisplay = ({
  title = 'Data',
  location,
  dataConfig: { xAxisData, xAxisLabel, yAxisLabel, series },
  textColor,
  bgColor
}) => {
  // Combine the data into an array of objects
  const data = xAxisData.map((x, index) => {
    const point = { x }
    series.forEach(s => {
      point[s.dataKey] = s.data[index]
    })
    return point
  })

  return (
    <div className={`card shadow mt-2 ${textColor} ${bgColor}`}>
      <div className='card-body'>
        <h5 className='card-title mb-4'>
          {title}
          {location ? ` for ${location}` : ''}
        </h5>
        <ResponsiveContainer width='100%' height={400}>
          <LineChart
            data={data}
            margin={{ top: 25, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='x'
              height={70}
              interval={0}
              tick={{
                fontSize: 11,
                angle: -45,
                textAnchor: 'end'
              }}
              tickMargin={10}
            >
              <Label value={xAxisLabel} offset={-5} position='insideBottom' />
            </XAxis>
            <YAxis
              width={60}
              label={{
                value: yAxisLabel,
                angle: -90,
                position: 'insideLeft',
                offset: 15
              }}
            />
            <Tooltip />
            <Legend verticalAlign='top' height={36} />
            {series.map(s => (
              <Line
                key={s.dataKey}
                type='monotone'
                dataKey={s.dataKey}
                name={s.label}
                stroke={
                  s.color ||
                  `#${Math.floor(Math.random() * 16777215).toString(16)}`
                }
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default LineGraphDisplay
