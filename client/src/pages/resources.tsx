import { useState } from "react";
import { db } from "@/lib/store";
import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreVertical, Mail, MapPin, Briefcase } from "lucide-react";
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
import { Resource } from "@/lib/types";

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

export default function ResourcesPage() {
  const [resources, setResources] = useState(db.getResources());
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Resource Form State
  const [formData, setFormData] = useState<Partial<Resource>>({
    availability: "100%",
    status: "Active",
    type: "RBM",
    secondarySkills: []
  });

  const filteredResources = resources.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.primarySkill.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    // Fill in required mock data for fields not in the simple form
    const newResource = db.addResource({
      ...formData as Resource,
      dateOfJoining: new Date().toISOString().split('T')[0],
      totalExperience: formData.totalExperience || 1,
      secondarySkills: formData.secondarySkills || [],
      contactNumber: "N/A",
      address: "N/A",
      city: "N/A",
      country: "N/A"
    });

    setResources(db.getResources());
    setIsAddOpen(false);
    toast({
      title: "Resource Added",
      description: `${newResource.name} has been added to the system.`
    });
    setFormData({ availability: "100%", status: "Active", type: "RBM" });
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
          <h2 className="text-3xl font-display font-bold text-white tracking-wide">Resources</h2>
          <p className="text-muted-foreground mt-1">Manage employee details and availability.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="glass-button gap-2">
              <Plus className="w-4 h-4" /> Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-white/10 text-white backdrop-blur-xl max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Add New Resource</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Full Name</Label>
                <Input 
                  className="glass-input" 
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Email</Label>
                <Input 
                  className="glass-input" 
                  type="email"
                  value={formData.email || ''}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Primary Skill</Label>
                <Input 
                  className="glass-input" 
                  value={formData.primarySkill || ''}
                  onChange={e => setFormData({...formData, primarySkill: e.target.value})}
                  required
                />
              </div>
               <div className="space-y-2">
                <Label>Availability</Label>
                <Select 
                  value={formData.availability} 
                  onValueChange={(v: any) => setFormData({...formData, availability: v})}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10 text-white">
                    <SelectItem value="100%">100%</SelectItem>
                    <SelectItem value="50%">50%</SelectItem>
                    <SelectItem value="Bench">Bench</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                 <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                 <Button type="submit" className="bg-primary hover:bg-primary/90">Create Resource</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources..." 
            className="pl-10 glass-input rounded-full" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="glass-button-secondary gap-2">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <motion.div 
            key={resource.id}
            variants={item}
            className="glass-panel p-5 rounded-xl group hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center font-bold text-lg text-white group-hover:border-primary/50 transition-colors">
                  {resource.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-primary transition-colors">{resource.name}</h3>
                  <p className="text-xs text-muted-foreground">{resource.type}</p>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-white p-1">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Briefcase className="w-4 h-4 text-primary/70" />
                <span>{resource.primarySkill}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-primary/70" />
                <span className="truncate">{resource.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-primary/70" />
                <span>{resource.city}, {resource.country}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className={`text-xs font-bold px-2 py-1 rounded border ${
                resource.availability === '100%' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                resource.availability === 'Bench' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
              }`}>
                {resource.availability === 'Bench' ? 'On Bench' : `Available: ${resource.availability}`}
              </span>
              <Button size="sm" variant="link" className="text-primary hover:text-primary/80 h-auto p-0">
                View Profile
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
