import RfmChart from './RfmChart.jsx'
import RoundsChart from './RoundsChart.jsx'
import SentimentChart from './SentimentChart.jsx'
import StatTile from './StatTile.jsx'
import { GenieMock, FunnelChart, Ga4Funnel, AdsSpark, DotMap, DonutChart, KpiTiles, SocialSpark, OrderStatus, PipelineDiagram } from './mini.jsx'

export const charts = {
  rfm: RfmChart, rounds: RoundsChart, sentiment: SentimentChart, stat: StatTile,
  genie: GenieMock, funnel: FunnelChart, dotmap: DotMap, donut: DonutChart,
  kpis: KpiTiles, ga4: Ga4Funnel, ads: AdsSpark, social: SocialSpark, orders: OrderStatus, pipeline: PipelineDiagram,
}
