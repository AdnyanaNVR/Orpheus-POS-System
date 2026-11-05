import React, { useState } from 'react';
import { usePos } from '../../store/posStore';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Clock,
  Sliders,
  Download,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { setActiveTab } = usePos();
  const [selectedChannel, setSelectedChannel] = useState<'overview' | 'online' | 'instore'>('overview');
  const [selectedYear, setSelectedYear] = useState<'2025' | '2026'>('2026');
  const [activeHoverBar, setActiveHoverBar] = useState<number | null>(10); // Nov is index 10

  // 12 Months data matching screenshot
  const monthlyData = [
    { month: 'Jan', height: 28, revenue: '$18,200', orders: 240, growth: '+6.1%' },
    { month: 'Feb', height: 36, revenue: '$22,500', orders: 310, growth: '+8.4%' },
    { month: 'Mar', height: 42, revenue: '$25,900', orders: 375, growth: '+9.8%' },
    { month: 'Apr', height: 48, revenue: '$29,100', orders: 410, growth: '+11.2%' },
    { month: 'May', height: 56, revenue: '$32,400', orders: 460, growth: '+14.5%' },
    { month: 'Jun', height: 68, revenue: '$36,800', orders: 512, growth: '+16.2%' },
    { month: 'Jul', height: 74, revenue: '$38,200', orders: 530, growth: '+17.0%' },
    { month: 'Aug', height: 65, revenue: '$35,400', orders: 495, growth: '+15.1%' },
    { month: 'Sep', height: 72, revenue: '$37,600', orders: 520, growth: '+16.8%' },
    { month: 'Oct', height: 78, revenue: '$39,800', orders: 550, growth: '+18.2%' },
    { month: 'Nov', height: 88, revenue: '$42,300', orders: 596, growth: '+21.2%' }, // Highlighted white bar
    { month: 'Dec', height: 96, revenue: '$46,200', orders: 640, growth: '+24.5%' },
  ];

  // Heatmap matrix exact shades from screenshot
  // 4 rows x 7 days
  const heatmapRows = [
    {
      slot: '12 AM – 8 AM',
      cells: [
        'bg-[#232428]',
        'bg-[#232428]',
        'bg-[#232428]',
        'bg-[#232428]',
        'bg-[#282a30]',
        'bg-[#ffffff]',
        'bg-[#ffffff]',
      ],
    },
    {
      slot: '8 AM – 12 PM',
      cells: [
        'bg-[#282a30]',
        'bg-[#282a30]',
        'bg-[#2e3138]',
        'bg-[#2e3138]',
        'bg-[#4b515f]',
        'bg-[#ffffff]',
        'bg-[#ffffff]',
      ],
    },
    {
      slot: '12 PM – 4 PM',
      cells: [
        'bg-[#3b3f49]',
        'bg-[#4b515f]',
        'bg-[#7a8192]',
        'bg-[#4b515f]',
        'bg-[#8c94a8]',
        'bg-[#ffffff]',
        'bg-[#ffffff]',
      ],
    },
    {
      slot: '4 PM – 12 AM',
      cells: [
        'bg-[#5b6274]',
        'bg-[#8c94a8]',
        'bg-[#ffffff]',
        'bg-[#8c94a8]',
        'bg-[#8c94a8]',
        'bg-[#ffffff]',
        'bg-[#ffffff]',
      ],
    },
  ];

  const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6 pb-12 select-none font-sans">
      {/* SVG Pattern Definition for Striped / Hatched Bar Chart */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <pattern
            id="hatchPattern"
            width="6"
            height="6"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="6" stroke="#484d5c" strokeWidth="2" />
          </pattern>
        </defs>
      </svg>

      {/* Row 1: Title and 1,417 Live Now Pill */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Dashboard
        </h2>

        {/* Live indicator 1:1 */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16171a] border border-[#26282e] text-xs shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-bold text-white tabular-nums">1,417</span>
          <span className="text-[#8e8e93]">live now</span>
        </div>
      </div>

      {/* Row 2: Secondary Filter Toolbar 1:1 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Overview / Online / In store segmented pills + Date */}
        <div className="flex items-center gap-4">
          <div className="flex items-center p-1 rounded-full bg-[#18181b] border border-[#27272a]">
            {(['overview', 'online', 'instore'] as const).map((channel) => {
              const label = channel === 'overview' ? 'Overview' : channel === 'online' ? 'Online' : 'In store';
              const isActive = selectedChannel === channel;
              return (
                <button
                  key={channel}
                  onClick={() => setSelectedChannel(channel)}
                  className={`px-4 py-1 text-xs rounded-full transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#27272a] text-white font-medium shadow-xs'
                      : 'text-[#71717a] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#8e8e93]">
            <Clock className="w-3.5 h-3.5 text-[#71717a]" />
            <span>November 2026, month to date</span>
          </div>
        </div>

        {/* Right: Full analytics + Export buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18181b] border border-[#27272a] text-xs font-medium text-white hover:bg-[#222226] transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#a1a1aa]" />
            <span>Full analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('cashier')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-[#e4e4e7] transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Row 3: 4 High-Contrast KPI Cards (Exact 1:1 Match to image_15c12804.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active sales */}
        <div className="bg-[#e2e4e1] text-[#121316] rounded-[24px] p-6 flex flex-col justify-between shadow-xs border border-[#d6d9d4]">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#52525b] font-medium">
              <span>Active sales</span>
              <Info className="w-3.5 h-3.5 text-[#71717a]" />
            </div>

            <div className="flex items-end justify-between mt-3">
              <div>
                <p className="text-3xl font-extrabold text-[#111215] tracking-tight">
                  $48,320
                </p>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#15803d] mt-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>14.2%</span>
                  <span className="text-[#71717a] font-normal">vs last month</span>
                </div>
              </div>

              {/* 4 Vertical Bars Graphic */}
              <div className="flex flex-col items-center">
                <div className="flex items-end gap-1 h-9 mb-1">
                  <span className="w-1.5 h-4 bg-[#b8bbc2] rounded-full"></span>
                  <span className="w-1.5 h-6 bg-[#6b7280] rounded-full"></span>
                  <span className="w-1.5 h-7 bg-[#374151] rounded-full"></span>
                  <span className="w-1.5 h-9 bg-[#111215] rounded-full"></span>
                </div>
                <div className="w-10 border-b border-dashed border-[#9ca3af]"></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3">
            <button
              onClick={() => setActiveTab('cashier')}
              className="text-xs text-[#71717a] hover:text-[#111215] transition-colors cursor-pointer"
            >
              See orders
            </button>
          </div>
        </div>

        {/* Card 2: Revenue */}
        <div className="bg-[#e2e4e1] text-[#121316] rounded-[24px] p-6 flex flex-col justify-between shadow-xs border border-[#d6d9d4]">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#52525b] font-medium">
              <span>Revenue</span>
              <Info className="w-3.5 h-3.5 text-[#71717a]" />
            </div>

            <div className="flex items-end justify-between mt-3">
              <div>
                <p className="text-3xl font-extrabold text-[#111215] tracking-tight">
                  $42,300
                </p>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#15803d] mt-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>7.1%</span>
                  <span className="text-[#71717a] font-normal">vs last month</span>
                </div>
              </div>

              {/* Smooth Upward Curved Sparkline */}
              <div className="w-20 h-9">
                <svg viewBox="0 0 80 36" className="w-full h-full fill-none">
                  <path
                    d="M 2 28 Q 24 32, 44 14 T 78 8"
                    stroke="#111215"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 2 28 Q 24 32, 44 14 T 78 8 L 78 36 L 2 36 Z"
                    fill="rgba(17, 18, 21, 0.08)"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3">
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs text-[#71717a] hover:text-[#111215] transition-colors cursor-pointer"
            >
              See analytics
            </button>
          </div>
        </div>

        {/* Card 3: Units sold */}
        <div className="bg-[#e2e4e1] text-[#121316] rounded-[24px] p-6 flex flex-col justify-between shadow-xs border border-[#d6d9d4]">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#52525b] font-medium">
              <span>Units sold</span>
              <Info className="w-3.5 h-3.5 text-[#71717a]" />
            </div>

            <div className="flex items-end justify-between mt-3">
              <div>
                <p className="text-3xl font-extrabold text-[#111215] tracking-tight">
                  3,842
                </p>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#15803d] mt-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>6.4%</span>
                  <span className="text-[#71717a] font-normal">vs last month</span>
                </div>
              </div>

              {/* Donut progress 77% */}
              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="stroke-[#c8cbd1] fill-none"
                    strokeWidth="4"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="stroke-[#111215] fill-none"
                    strokeDasharray="77, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-[#111215]">77%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3">
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs text-[#71717a] hover:text-[#111215] transition-colors cursor-pointer"
            >
              See products
            </button>
          </div>
        </div>

        {/* Card 4: Conversion rate */}
        <div className="bg-[#e2e4e1] text-[#121316] rounded-[24px] p-6 flex flex-col justify-between shadow-xs border border-[#d6d9d4]">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#52525b] font-medium">
              <span>Conversion rate</span>
              <Info className="w-3.5 h-3.5 text-[#71717a]" />
            </div>

            <div className="flex items-end justify-between mt-3">
              <div>
                <p className="text-3xl font-extrabold text-[#111215] tracking-tight">
                  4.8%
                </p>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#b91c1c] mt-1.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>-0.2 pt</span>
                  <span className="text-[#71717a] font-normal">vs last month</span>
                </div>
              </div>

              {/* 8-9 Thin Histogram Bars */}
              <div className="flex items-end gap-1 h-9">
                {[6, 8, 12, 11, 15, 18, 16, 22, 26].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 bg-[#111215] rounded-xs"
                  ></span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3">
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs text-[#71717a] hover:text-[#111215] transition-colors cursor-pointer"
            >
              See funnel
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: Sales Performance Speedometer + Hatched Revenue Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Sales Performance Speedometer Card 1:1 */}
        <div className="lg:col-span-4 bg-[#131416] border border-[#222327] rounded-[28px] p-7 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <span>Sales performance</span>
              <Info className="w-3.5 h-3.5 text-[#71717a]" />
            </div>

            {/* Speedometer Gauge Visual 1:1 */}
            <div className="relative mt-7 flex flex-col items-center justify-center">
              <svg className="w-64 h-34 overflow-visible" viewBox="0 0 200 110">
                {/* Outer Dashed / Dotted Radial Ticks */}
                <path
                  d="M 12 100 A 88 88 0 0 1 188 100"
                  fill="none"
                  stroke="#383d4a"
                  strokeWidth="2.5"
                  strokeDasharray="2.5, 6"
                />

                {/* Dark Background Track Arc */}
                <path
                  d="M 22 100 A 78 78 0 0 1 178 100"
                  fill="none"
                  stroke="#23262f"
                  strokeWidth="15"
                  strokeLinecap="round"
                />

                {/* Active White Arc to 86% */}
                <path
                  d="M 22 100 A 78 78 0 0 1 168 56"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="15"
                  strokeLinecap="round"
                />

                {/* Indicator Ring/Node at 86% */}
                <circle
                  cx="168"
                  cy="56"
                  r="7.5"
                  fill="#131416"
                  stroke="#ffffff"
                  strokeWidth="4"
                />
              </svg>

              {/* Number and Badge inside Speedometer */}
              <div className="mt-[-24px] text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-extrabold text-white">86</span>
                  <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
                    ↑ +3
                  </span>
                </div>
                <p className="text-xs text-[#8e8e93] mt-0.5">of 100 points</p>
              </div>
            </div>

            {/* Text description 1:1 */}
            <div className="mt-7">
              <h4 className="text-sm font-bold text-white">Ahead of plan</h4>
              <p className="text-xs text-[#8e8e93] mt-1 leading-relaxed">
                Both channels beat last month. Online did most of the lifting.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1f2025]">
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs text-white hover:underline transition-all cursor-pointer font-medium"
            >
              Improve your score
            </button>
          </div>
        </div>

        {/* Right: Revenue Annual Chart with Striped / Hatched Bars 1:1 */}
        <div className="lg:col-span-8 bg-[#131416] border border-[#222327] rounded-[28px] p-7 flex flex-col justify-between shadow-sm relative">
          <div>
            {/* Header: Title + Year Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Revenue</h3>
                <Info className="w-3.5 h-3.5 text-[#71717a]" />
                <span className="text-xs text-[#8e8e93]">
                  $342,300 so far this year
                </span>
              </div>

              {/* Year Toggle [2025] [2026] */}
              <div className="flex items-center p-1 rounded-full bg-[#1c1d22] border border-[#292a32]">
                <button
                  onClick={() => setSelectedYear('2025')}
                  className={`px-3 py-0.5 text-xs rounded-full transition-colors cursor-pointer ${
                    selectedYear === '2025'
                      ? 'bg-[#292a32] text-white font-medium'
                      : 'text-[#71717a] hover:text-white'
                  }`}
                >
                  2025
                </button>
                <button
                  onClick={() => setSelectedYear('2026')}
                  className={`px-3 py-0.5 text-xs rounded-full transition-colors cursor-pointer ${
                    selectedYear === '2026'
                      ? 'bg-[#292a32] text-white font-medium'
                      : 'text-[#71717a] hover:text-white'
                  }`}
                >
                  2026
                </button>
              </div>
            </div>

            {/* Bar Chart Area with Hatched Bars and Popover on Nov */}
            <div className="relative mt-8 h-64 flex items-end justify-between gap-1 sm:gap-2.5 pl-9 pb-6 border-b border-[#212228]">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-[#555a66] font-mono pointer-events-none select-none">
                <span>$60k</span>
                <span>$45k</span>
                <span>$30k</span>
                <span>$15k</span>
                <span>$0</span>
              </div>

              {/* Dotted horizontal line at avg $31.1k */}
              <div className="absolute left-9 right-0 top-[48%] border-b border-dashed border-[#343844] flex items-center justify-end pointer-events-none">
                <span className="text-[10px] text-[#71717a] bg-[#131416] px-1 -mt-4 font-mono">
                  avg $31.1k
                </span>
              </div>

              {/* 12 Months Bars */}
              {monthlyData.map((item, idx) => {
                const isNov = item.month === 'Nov';
                const isHovered = activeHoverBar === idx;

                return (
                  <div
                    key={item.month}
                    className="relative flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
                    onMouseEnter={() => setActiveHoverBar(idx)}
                  >
                    {/* Floating Popover on Nov / Hovered Month (Exact 1:1 to screenshot) */}
                    {(isNov || isHovered) && (
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-20 w-44 bg-[#f4f5f2] text-[#121316] rounded-xl p-2.5 shadow-2xl text-[11px] pointer-events-none border border-[#e1e3de]">
                        <div className="font-bold text-[#111215] mb-1">
                          {item.month} 2026
                        </div>
                        <div className="flex justify-between text-[#52525b]">
                          <span>Revenue</span>
                          <span className="font-semibold text-[#111215]">{item.revenue}</span>
                        </div>
                        <div className="flex justify-between text-[#52525b]">
                          <span>Orders</span>
                          <span className="font-semibold text-[#111215]">{item.orders}</span>
                        </div>
                        <div className="flex justify-between text-[#52525b] mt-0.5">
                          <span>vs last year</span>
                          <span className="font-bold text-emerald-700">{item.growth}</span>
                        </div>
                      </div>
                    )}

                    {/* Bar: Solid White for Nov, Striped / Hatched for others */}
                    <div
                      style={{ height: `${item.height}%` }}
                      className={`w-full max-w-[26px] rounded-t-md transition-all ${
                        isNov
                          ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                          : 'bg-[#22242c] hover:bg-[#2c303a]'
                      }`}
                    >
                      {!isNov && (
                        <svg className="w-full h-full rounded-t-md">
                          <rect width="100%" height="100%" fill="url(#hatchPattern)" />
                        </svg>
                      )}
                    </div>

                    {/* Month Label */}
                    <span
                      className={`absolute -bottom-6 text-[11px] font-medium transition-colors ${
                        isNov ? 'text-white font-bold' : 'text-[#71717a] group-hover:text-white'
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Visits by Time Heatmap Matrix + Total Visits Donut Chart 1:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Visits by time Heatmap 1:1 */}
        <div className="lg:col-span-7 bg-[#131416] border border-[#222327] rounded-[28px] p-7 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <span>Visits by time</span>
              <Info className="w-3.5 h-3.5 text-[#71717a]" />
            </div>

            {/* Heatmap Legend 0 to 11k+ 1:1 */}
            <div className="flex items-center gap-1.5 text-[10px] text-[#71717a]">
              <span>0</span>
              <span className="w-2.5 h-2.5 rounded-xs bg-[#232428]"></span>
              <span className="w-2.5 h-2.5 rounded-xs bg-[#2e3138]"></span>
              <span className="w-2.5 h-2.5 rounded-xs bg-[#4b515f]"></span>
              <span className="w-2.5 h-2.5 rounded-xs bg-[#8c94a8]"></span>
              <span className="w-2.5 h-2.5 rounded-xs bg-[#ffffff]"></span>
              <span>11k+</span>
            </div>
          </div>

          {/* Heatmap Matrix with Rounded Pill Rectangles 1:1 */}
          <div className="space-y-2 mt-4">
            {/* Days of Week Header */}
            <div className="grid grid-cols-8 gap-2 text-[11px] text-[#71717a] font-medium text-center">
              <div></div>
              {daysList.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* 4 Time Slots Rows */}
            {heatmapRows.map((row) => (
              <div key={row.slot} className="grid grid-cols-8 items-center gap-2">
                <span className="text-[11px] text-[#71717a] whitespace-nowrap">
                  {row.slot}
                </span>
                {row.cells.map((bgClass, idx) => (
                  <div
                    key={idx}
                    className={`h-7 rounded-lg transition-transform hover:scale-105 cursor-pointer ${bgClass}`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Total visits with Donut Breakdown 1:1 */}
        <div className="lg:col-span-5 bg-[#131416] border border-[#222327] rounded-[28px] p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <span>Total visits</span>
              <Info className="w-3.5 h-3.5 text-[#71717a]" />
            </div>

            <div className="flex items-start justify-between mt-4">
              <div>
                <p className="text-3xl font-extrabold text-white tracking-tight">
                  214,860
                </p>
                <div className="flex items-center gap-1 text-xs text-[#8e8e93] mt-1 font-medium">
                  <span>vs last month</span>
                  <span className="text-emerald-400 font-bold">↑ 8.5%</span>
                </div>
              </div>

              {/* Donut Chart: 76% Website 1:1 */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Dark Track Arc */}
                  <path
                    className="stroke-[#272830] fill-none"
                    strokeWidth="5"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Thick White Segment 76% */}
                  <path
                    className="stroke-white fill-none"
                    strokeDasharray="76, 100"
                    strokeWidth="5"
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-sm font-extrabold text-white">76%</span>
                  <p className="text-[10px] text-[#71717a]">Website</p>
                </div>
              </div>
            </div>
          </div>

          {/* Channels Breakdown List 1:1 */}
          <div className="mt-7 pt-4 border-t border-[#212228] space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-white"></span>
                <span className="text-[#d4d4d8]">Website</span>
              </div>
              <span className="font-semibold text-white font-mono">162,400</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#71717a]"></span>
                <span className="text-[#a1a1aa]">In store</span>
              </div>
              <span className="font-semibold text-[#a1a1aa] font-mono">41,440</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#3f3f46]"></span>
                <span className="text-[#a1a1aa]">Click & collect</span>
              </div>
              <span className="font-semibold text-[#a1a1aa] font-mono">11,020</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
