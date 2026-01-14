import { Switch, Route } from "wouter";
import { Layout } from "@/components/layout/AppShell";
import Dashboard from "@/pages/dashboard";
import Resources from "@/pages/resources";
import Projects from "@/pages/projects";
import Allocations from "@/pages/allocations";
import NotFound from "@/pages/not-found";
import { Toaster } from "@/components/ui/toaster";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/resources" component={Resources} />
        <Route path="/projects" component={Projects} />
        <Route path="/allocations" component={Allocations} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
