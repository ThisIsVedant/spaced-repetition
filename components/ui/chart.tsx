import {
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
} from 'recharts'

interface BarChartProps {
    data: any[]
    index: string
    categories: string[]
    colors: string[]
    valueFormatter?: (value: number) => string
    yAxisWidth?: number
    height?: number
}

export function BarChart({
                             data,
                             index,
                             categories,
                             colors,
                             valueFormatter = (v) => v.toString(),
                             yAxisWidth = 60,
                             height = 300
                         }: BarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <ReBarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={index} />
                <YAxis width={yAxisWidth} />
                <Tooltip formatter={(value: any) => valueFormatter(Number(value))} />
                <Legend />
                {categories.map((cat, i) => (
                    <Bar key={cat} dataKey={cat} fill={colors[i % colors.length]} />
                ))}
            </ReBarChart>
        </ResponsiveContainer>
    )
}

interface PieChartProps {
    data: any[]
    index: string
    category: string
    colors: string[]
    valueFormatter?: (value: number) => string
    className?: string
}

export function PieChart({
                             data,
                             index,
                             category,
                             colors,
                             valueFormatter = (v) => v.toString(),
                             className
                         }: PieChartProps) {
    return (
        <div className={className} style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <RePieChart >
                    <Pie
                        data={data}
                        dataKey={category}
                        nameKey={index}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, value }) => `${name}: ${valueFormatter(value)}`}
                    >
                        {data.map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => valueFormatter(Number(value))} />
                    <Legend />
                </RePieChart>
            </ResponsiveContainer>
        </div>
    )
}
