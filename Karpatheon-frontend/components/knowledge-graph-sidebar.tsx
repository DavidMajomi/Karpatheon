// 'use client'

// import { TrendingUp, Clock, Lightbulb } from 'lucide-react'
// import { Card } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'

// export function KnowledgeGraphSidebar() {
//   return (
//     <aside className="w-80 border-l border-border/50 bg-background/50 p-6 overflow-y-auto">
//       <div className="space-y-6">
//         {/* Graph Stats */}
//         <div>
//           <h3 className="mb-3 font-serif text-lg font-semibold text-foreground">Knowledge Overview</h3>
//           <div className="space-y-2">
//             <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
//               <span className="text-sm text-muted-foreground">Total Topics</span>
//               <span className="font-mono text-sm font-semibold text-primary">127</span>
//             </div>
//             <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
//               <span className="text-sm text-muted-foreground">Connections</span>
//               <span className="font-mono text-sm font-semibold text-accent">284</span>
//             </div>
//             <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
//               <span className="text-sm text-muted-foreground">Depth Score</span>
//               <span className="font-mono text-sm font-semibold text-foreground">8.4/10</span>
//             </div>
//           </div>
//         </div>

//         {/* Trending Topics */}
//         <div>
//           <div className="mb-3 flex items-center gap-2">
//             <TrendingUp className="h-4 w-4 text-primary" />
//             <h3 className="font-serif text-lg font-semibold text-foreground">Trending in Your Graph</h3>
//           </div>
//           <div className="space-y-2">
//             {[
//               { topic: 'Transformers', growth: '+24%', queries: 18 },
//               { topic: 'Neural Networks', growth: '+19%', queries: 15 },
//               { topic: 'Computer Vision', growth: '+12%', queries: 11 },
//             ].map((item) => (
//               <Card key={item.topic} className="border-border/50 bg-background/50 p-3 hover:bg-background/80 transition-colors cursor-pointer">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="font-medium text-sm text-foreground">{item.topic}</div>
//                     <div className="text-xs text-muted-foreground">{item.queries} queries this week</div>
//                   </div>
//                   <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
//                     {item.growth}
//                   </Badge>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Recent Explorations */}
//         <div>
//           <div className="mb-3 flex items-center gap-2">
//             <Clock className="h-4 w-4 text-accent" />
//             <h3 className="font-serif text-lg font-semibold text-foreground">Recent Explorations</h3>
//           </div>
//           <div className="space-y-2">
//             {[
//               { topic: 'AI Ethics', time: '2 hours ago' },
//               { topic: 'Quantum Computing', time: '5 hours ago' },
//               { topic: 'Blockchain', time: 'Yesterday' },
//             ].map((item) => (
//               <div key={item.topic} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3 hover:bg-background/80 transition-colors cursor-pointer">
//                 <span className="text-sm text-foreground">{item.topic}</span>
//                 <span className="text-xs text-muted-foreground">{item.time}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Suggestions */}
//         <div>
//           <div className="mb-3 flex items-center gap-2">
//             <Lightbulb className="h-4 w-4 text-primary" />
//             <h3 className="font-serif text-lg font-semibold text-foreground">Expand Your Knowledge</h3>
//           </div>
//           <div className="space-y-2">
//             {[
//               'Edge Computing',
//               'Federated Learning',
//               'Synthetic Data',
//             ].map((topic) => (
//               <Button 
//                 key={topic} 
//                 variant="outline" 
//                 className="w-full justify-start border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
//                 size="sm"
//               >
//                 {topic}
//               </Button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </aside>
//   )
// }
