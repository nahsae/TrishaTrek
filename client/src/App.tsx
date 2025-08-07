// Import Router from Wouter and alias it to avoid shadowing our own Router component.
import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import Trivia from "@/pages/trivia";
import Timeline from "@/pages/timeline";
import Gallery from "@/pages/gallery";
import Leaderboard from "@/pages/leaderboard";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

// Extract the application's route definitions into their own component. We avoid
// shadowing the `Router` import from Wouter so that we can use the router
// provided by Wouter with a base path.
function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/trivia" component={Trivia} />
      <Route path="/timeline" component={Timeline} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    // Configure Wouter to use the repository name as a base path. Without
    // this, routes won't match correctly when the app is hosted under a
    // subpath like `/TrishaTrek` on GitHub Pages. See:
    // https://github.com/molefrog/wouter#basename
    <WouterRouter base="/TrishaTrek">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Layout>
            <AppRoutes />
          </Layout>
        </TooltipProvider>
      </QueryClientProvider>
    </WouterRouter>
  );
}

export default App;
