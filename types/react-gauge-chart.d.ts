declare module 'react-gauge-chart' {
  export interface GaugeChartProps {
    id?: string
    nrOfLevels?: number
    colors?: string[]
    arcWidth?: number
    percent?: number
    textColor?: string
    needleColor?: string
    needleBaseColor?: string
    animate?: boolean
    animDelay?: number
    formatTextValue?: (value: string) => string
    hideText?: boolean
  }

  const GaugeChart: React.FC<GaugeChartProps>
  export default GaugeChart
}
