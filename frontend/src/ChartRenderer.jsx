import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Label
} from 'recharts';

const PALETTE = ['#8884d8', '#82ca9d', '#ffc658', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ChartRenderer = ({ chartConfig }) => {
  if (!chartConfig || !chartConfig.data) return null;

  const { chartType, data, xAxis, yAxis, title } = chartConfig;

  const formattedData = React.useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return data.map(item => {
      let obj = {};
      if (Array.isArray(item)) {
        obj[xAxis] = item[0];
        obj[yAxis] = typeof item[1] === 'number' ? item[1] : (parseFloat(String(item[1]).replace(/[$,]/g, '')) || item[1]);
      } else if (typeof item === 'object' && item !== null) {
        obj[xAxis] = item[xAxis] !== undefined ? item[xAxis] : item[Object.keys(item)[0]];
        const v = item[yAxis] !== undefined ? item[yAxis] : item[Object.keys(item)[1]];
        obj[yAxis] = typeof v === 'number' ? v : (parseFloat(String(v).replace(/[$,]/g, '')) || v);
      }
      return obj;
    });
  }, [data, xAxis, yAxis]);

  const STYLES = {
    tooltip: { backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' },
    label: { fill: '#94a3b8', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' },
    axis: { stroke: '#64748b', fontSize: 11, tickLine: false, axisLine: false }
  };

  const AxisLabels = ({ x, y }) => (
    <>
      <XAxis dataKey={xAxis} {...STYLES.axis}><Label value={x} offset={-20} position="insideBottom" style={STYLES.label} /></XAxis>
      <YAxis {...STYLES.axis}><Label value={y} angle={-90} position="insideLeft" offset={-30} style={STYLES.label} /></YAxis>
    </>
  );

  const renderComponent = () => {
    switch (chartType?.toLowerCase()) {
      case 'bar':
        return (
          <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <AxisLabels x={xAxis} y={yAxis} />
            <Tooltip contentStyle={STYLES.tooltip} itemStyle={{ color: '#f8fafc' }} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey={yAxis} fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <AxisLabels x={xAxis} y={yAxis} />
            <Tooltip contentStyle={STYLES.tooltip} itemStyle={{ color: '#f8fafc' }} />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey={yAxis} stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie data={formattedData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey={yAxis} nameKey={xAxis}>
              {formattedData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
            </Pie>
            <Tooltip contentStyle={STYLES.tooltip} itemStyle={{ color: '#f8fafc' }} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        );
      case 'area':
        return (
          <AreaChart data={formattedData} margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <AxisLabels x={xAxis} y={yAxis} />
            <Tooltip contentStyle={STYLES.tooltip} itemStyle={{ color: '#f8fafc' }} />
            <Area type="monotone" dataKey={yAxis} stroke="#6366f1" fill="url(#areaGrad)" strokeWidth={3} />
          </AreaChart>
        );
      default:
        return <p className="text-slate-500 text-xs italic">Visualization type not supported.</p>;
    }
  };

  return (
    <div className="w-full h-60 md:h-80 my-4 p-4 bg-slate-900/40 rounded-2xl border border-white/5 ring-1 ring-white/5 overflow-hidden">
      {title && <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 ml-1">{title}</h3>}
      <ResponsiveContainer width="100%" height="90%">{renderComponent()}</ResponsiveContainer>
    </div>
  );
};

export default ChartRenderer;
