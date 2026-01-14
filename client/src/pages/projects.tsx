import { useState } from "react";
import { db } from "@/lib/store";
import { motion } from "framer-motion";
import { Plus, Search, Calendar, Folder, MoreHorizontal } from "lucide-react";
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
import { Project } from "@/lib/types";

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState(db.getProjects());
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Project Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    status: "Active",
  });

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.clientName) return;
    
    const newProject = db.addProject({
      ...formData as Project,
      startDate: new Date().toISOString().split('T')[0],
      description: formData.description || "No description provided."
    });

    setProjects(db.getProjects());
    setIsAddOpen(false);
    toast({
      title: "Project Created",
      description: `${newProject.name} has been initiated.`
    });
    setFormData({ status: "Active" });
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
          <h2 className="text-3xl font-display font-bold text-white tracking-wide">Projects</h2>
          <p className="text-muted-foreground mt-1">Track active engagements and client details.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="glass-button gap-2">
              <Plus className="w-4 h-4" /> New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-white/10 text-white backdrop-blur-xl max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Create New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2 col-span-2">
                <Label>Project Name</Label>
                <Input 
                  className="glass-input" 
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Client Name</Label>
                <Input 
                  className="glass-input" 
                  value={formData.clientName || ''}
                  onChange={e => setFormData({...formData, clientName: e.target.value})}
                  required
                />
              </div>
               <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(v: any) => setFormData({...formData, status: v})}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10 text-white">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Description</Label>
                <Input 
                  className="glass-input" 
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                 <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                 <Button type="submit" className="bg-primary hover:bg-primary/90">Create Project</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search projects..." 
            className="pl-10 glass-input rounded-full" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <motion.div 
            key={project.id}
            variants={item}
            className="glass-panel p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-primary/30 transition-all duration-300"
          >
            <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-primary">
              <Folder className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{project.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  project.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  project.status === 'On Hold' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  'bg-gray-500/10 text-gray-400 border-gray-500/20'
                }`}>
                  {project.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">Client: <span className="text-white">{project.clientName}</span></span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> 
                  Started: {project.startDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
              <div className="text-right hidden md:block">
                <p className="text-xs text-muted-foreground">Manager</p>
                <p className="text-sm font-medium text-white">{project.rbmProjectManager || 'Unassigned'}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white ml-auto">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
