import { db } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";
import { Users, FolderKanban, Briefcase, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const stats = db.getStats();
  const resources = db.getResources();

  // Mock data for the chart
  const chartData = [
    { name: 'Jan', value: 65 },
    { name: 'Feb', value: 72 },
    { name: 'Mar', value: 68 },
    { name: 'Apr', value: 85 },
    { name: 'May', value: 82 },
    { name: 'Jun', value: 90 },
  ];

  const StatIcon = ({ label }: { label: string }) => {
    if (label.includes("Resource")) return <Users className="w-5 h-5 text-primary" />;
    if (label.includes("Project")) return <FolderKanban className="w-5 h-5 text-blue-400" />;
    if (label.includes("Bench")) return <Briefcase className="w-5 h-5 text-orange-400" />;
    return <TrendingUp className="w-5 h-5 text-green-400" />;
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div>
        <h2 className="text-3xl font-display font-bold text-white tracking-wide">Executive Overview</h2>
        <p className="text-muted-foreground mt-1">Real-time resource allocation metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            variants={item}
            className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:bg-card/80 transition-all"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <StatIcon label={stat.label} />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <StatIcon label={stat.label} />
              </div>
              {stat.change && (
                <span className={`text-xs font-medium flex items-center gap-1 ${
                  stat.trend === 'up' ? 'text-green-400' : 
                  stat.trend === 'down' ? 'text-red-400' : 'text-muted-foreground'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : 
                   stat.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
                  {stat.change}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</h3>
              <p className="text-4xl font-display font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <motion.div variants={item} className="lg:col-span-2 glass-panel p-6 rounded-xl border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Resource Utilization Trend
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#555" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#555" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(0 0% 10% / 0.9)', border: '1px solid hsl(0 0% 20%)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity / Status */}
        <motion.div variants={item} className="glass-panel p-6 rounded-xl border-white/5 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            Bench Status
          </h3>
          <div className="space-y-4 flex-1">
             {resources.filter(r => r.availability === "Bench").slice(0, 5).map(resource => (
               <div key={resource.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                    {resource.name.split(' ').map(n => n[0]).join('')}
                 </div>
                 <div className="flex-1 overflow-hidden">
                   <p className="text-sm font-medium text-white truncate">{resource.name}</p>
                   <p className="text-xs text-muted-foreground truncate">{resource.primarySkill}</p>
                 </div>
                 <span className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                   Bench
                 </span>
               </div>
             ))}
             {resources.filter(r => r.availability === "Bench").length === 0 && (
               <div className="text-center text-muted-foreground text-sm py-8">
                 No resources currently on bench.
               </div>
             )}
          </div>
          <button className="w-full mt-4 py-2 text-xs font-medium text-muted-foreground hover:text-white border-t border-white/5 transition-colors uppercase tracking-wider">
            View All Resources
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
