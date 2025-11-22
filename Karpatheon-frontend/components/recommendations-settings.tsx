'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Target, Brain, Zap, TrendingUp, X } from 'lucide-react'

export function RecommendationsSettings() {
  const [explorationBalance, setExplorationBalance] = useState([60])
  const [depthPreference, setDepthPreference] = useState([75])
  const [diversityScore, setDiversityScore] = useState([45])
  
  const [interests, setInterests] = useState([
    'Artificial Intelligence',
    'Machine Learning',
    'Product Strategy',
    'Leadership',
  ])
  
  const [excludedTopics, setExcludedTopics] = useState([
    'Cryptocurrency',
    'Gaming',
  ])

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest))
  }

  const removeExcluded = (topic: string) => {
    setExcludedTopics(excludedTopics.filter(t => t !== topic))
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl p-8">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
            Recommendations & Exploration
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Customize how Pantheon learns your preferences and suggests new knowledge paths.
          </p>
        </div>

        <div className="space-y-6">
          {/* Learning Preferences */}
          <Card className="border-border/50 bg-background/50 p-6">
            <div className="mb-6 flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-xl font-semibold text-foreground">Learning Preferences</h3>
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Exploration vs. Exploitation</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Balance between discovering new topics and deepening existing knowledge
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {explorationBalance[0]}% explore
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-20">Deepen</span>
                  <Slider
                    value={explorationBalance}
                    onValueChange={setExplorationBalance}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-20 text-right">Explore</span>
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Technical Depth</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      How technical and detailed recommendations should be
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                    {depthPreference[0]}% depth
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-20">Overview</span>
                  <Slider
                    value={depthPreference}
                    onValueChange={setDepthPreference}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-20 text-right">Deep</span>
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Topic Diversity</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Range of different subjects in recommendations
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-muted/50 text-foreground border-border/50">
                    {diversityScore[0]}% diverse
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-20">Focused</span>
                  <Slider
                    value={diversityScore}
                    onValueChange={setDiversityScore}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-20 text-right">Diverse</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Smart Features */}
          <Card className="border-border/50 bg-background/50 p-6">
            <div className="mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-xl font-semibold text-foreground">Smart Features</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                <div>
                  <Label className="text-foreground">AI-Powered Suggestions</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get personalized topic recommendations based on your learning patterns
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                <div>
                  <Label className="text-foreground">Auto-Connect Topics</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically find connections between your explorations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                <div>
                  <Label className="text-foreground">Serendipity Mode</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Occasionally suggest surprising topics outside your usual interests
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                <div>
                  <Label className="text-foreground">Trend Alerts</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Notify when topics you follow have major developments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Interest Areas */}
          <Card className="border-border/50 bg-background/50 p-6">
            <div className="mb-6 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-xl font-semibold text-foreground">Interest Areas</h3>
            </div>

            <div className="mb-6">
              <Label className="text-foreground mb-3 block">Primary Interests</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {interests.map((interest) => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 gap-2 pr-1 pl-3 py-1"
                  >
                    {interest}
                    <button
                      onClick={() => removeInterest(interest)}
                      className="rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="border-border/50 hover:bg-muted/50">
                + Add Interest
              </Button>
            </div>

            <div>
              <Label className="text-foreground mb-3 block">Excluded Topics</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {excludedTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="secondary"
                    className="bg-muted/50 text-muted-foreground border-border/50 gap-2 pr-1 pl-3 py-1"
                  >
                    {topic}
                    <button
                      onClick={() => removeExcluded(topic)}
                      className="rounded-full p-0.5 hover:bg-muted transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="border-border/50 hover:bg-muted/50">
                + Exclude Topic
              </Button>
            </div>
          </Card>

          {/* Algorithm Transparency */}
          <Card className="border-border/50 bg-background/50 p-6">
            <div className="mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h3 className="font-serif text-xl font-semibold text-foreground">How We Recommend</h3>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-border/50 bg-background/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-sm text-foreground">Your Search History</span>
                  <span className="font-mono text-xs text-primary">48%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
                  <div className="h-full w-[48%] rounded-full bg-primary" />
                </div>
              </div>

              <div className="rounded-lg border border-border/50 bg-background/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-sm text-foreground">Knowledge Graph Connections</span>
                  <span className="font-mono text-xs text-accent">32%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
                  <div className="h-full w-[32%] rounded-full bg-accent" />
                </div>
              </div>

              <div className="rounded-lg border border-border/50 bg-background/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-sm text-foreground">Learning Style Match</span>
                  <span className="font-mono text-xs text-primary">20%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
                  <div className="h-full w-[20%] rounded-full bg-primary" />
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              These weights determine how we curate your personalized recommendations. 
              Your preferences automatically adjust these over time based on what you engage with.
            </p>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="border-border/50">
              Reset to Defaults
            </Button>
            <Button className="bg-primary text-background hover:bg-primary/90">
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
