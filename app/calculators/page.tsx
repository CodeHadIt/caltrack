'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppWrapper } from '@/components/app-wrapper'
import { TDEEForm } from '@/components/calculators/tdee-form'
import { BodyFatForm } from '@/components/calculators/body-fat-form'
import { Calculator, Percent, Activity } from 'lucide-react'

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState('tdee')

  return (
    <AppWrapper>
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-display flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center">
              <Calculator className="h-6 w-6 text-coral" />
            </div>
            Health Calculators
          </h1>
          <p className="text-muted-foreground mt-2">
            Calculate your daily calorie needs and body composition
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-16 p-1.5 rounded-2xl bg-muted/50">
            <TabsTrigger
              value="tdee"
              className="flex items-center gap-2 text-base rounded-xl font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral data-[state=active]:to-rose data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-coral/25"
            >
              <Activity className="h-4 w-4" />
              TDEE Calculator
            </TabsTrigger>
            <TabsTrigger
              value="bodyfat"
              className="flex items-center gap-2 text-base rounded-xl font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-sky/25"
            >
              <Percent className="h-4 w-4" />
              Body Fat Calculator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tdee" className="mt-0">
            <TDEEForm />
          </TabsContent>

          <TabsContent value="bodyfat" className="mt-0">
            <BodyFatForm />
          </TabsContent>
        </Tabs>
      </main>
    </AppWrapper>
  )
}
