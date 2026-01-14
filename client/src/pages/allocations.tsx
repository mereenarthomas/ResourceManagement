import { useState } from "react";
import { db } from "@/lib/store";
import { motion } from "framer-motion";
import { Plus, Search, Calendar, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Allocation } from "@/lib/types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function AllocationsPage() {
  const [allocations, setAllocations] = useState(db.getAllocations());
  const resources = db.getResources();
  const projects = db.getProjects();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Allocation Form State
  const [formData, setFormData] = useState<Partial<Allocation>>({
    percentage: 100,
    isBillable: true,
    billingProject: true
  });

  const getResourceName = (id: string) => resources.find(r => r.id === id)?.name || id;
  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || id;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resourceId || !formData.projectId || !formData.role) return;
    
    const newAllocation = db.addAllocation({
      ...formData as Allocation,
      startDate: new Date().toISOString().split('T')[0],
      billingStartDate: new Date().toISOString().split('T')[0],
      timesheetRequired: true,
      billingRate: formData.billingRate || 0
    });

    setAllocations(db.getAllocations());
    setIsAddOpen(false);
    toast({
      title: "Allocation Created",
      description: `Resource allocated successfully.`
    });
    setFormData({ percentage: 100, isBillable: true });
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-wide">Allocations</h2>
          <p className="text-muted-foreground mt-1">Manage resource assignments across projects.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="glass-button gap-2">
              <Plus className="w-4 h-4" /> Allocate Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-white/10 text-white backdrop-blur-xl max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">New Allocation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Resource</Label>
                <Select 
                  value={formData.resourceId} 
                  onValueChange={(v) => setFormData({...formData, resourceId: v})}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select Resource" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10 text-white">
                    {resources.map(r => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Project</Label>
                <Select 
                  value={formData.projectId} 
                  onValueChange={(v) => setFormData({...formData, projectId: v})}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10 text-white">
                     {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Role on Project</Label>
                <Input 
                  className="glass-input" 
                  value={formData.role || ''}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  required
                />
              </div>
               <div className="space-y-2">
                <Label>Allocation %</Label>
                <Input 
                  type="number"
                  className="glass-input" 
                  value={formData.percentage}
                  onChange={e => setFormData({...formData, percentage: parseInt(e.target.value)})}
                  max={100}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Billing Rate ($/hr)</Label>
                 <Input 
                  type="number"
                  className="glass-input" 
                  value={formData.billingRate}
                  onChange={e => setFormData({...formData, billingRate: parseInt(e.target.value)})}
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                 <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                 <Button type="submit" className="bg-primary hover:bg-primary/90">Allocate</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-panel overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-muted-foreground font-medium uppercase text-xs tracking-wider border-b border-white/5">
              <tr>
                <th className="p-4">Resource</th>
                <th className="p-4">Project</th>
                <th className="p-4">Role</th>
                <th className="p-4">Start Date</th>
                <th className="p-4">Allocation</th>
                <th className="p-4">Rate</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allocations.map((alloc) => (
                <motion.tr 
                  key={alloc.id} 
                  variants={item}
                  className="group hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 font-medium text-white">{getResourceName(alloc.resourceId)}</td>
                  <td className="p-4 text-gray-300">{getProjectName(alloc.projectId)}</td>
                  <td className="p-4 text-gray-400">{alloc.role}</td>
                  <td className="p-4 text-gray-400 font-mono">{alloc.startDate}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${alloc.percentage}%` }} 
                        />
                      </div>
                      <span className="text-xs text-white">{alloc.percentage}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">${alloc.billingRate}/hr</td>
                  <td className="p-4 text-right">
                    <span className={`text-xs px-2 py-1 rounded border ${
                      alloc.isBillable 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {alloc.isBillable ? 'Billable' : 'Non-Billable'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {allocations.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No allocations found. Create one to get started.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
