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
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold font-poppins flex items-center gap-2">
            <Calculator className="h-7 w-7 text-emerald-600" />
            Health Calculators
          </h1>
          <p className="text-muted-foreground">
            Calculate your daily calorie needs and body composition
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-14">
            <TabsTrigger
              value="tdee"
              className="flex items-center gap-2 text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              <Activity className="h-4 w-4" />
              TDEE Calculator
            </TabsTrigger>
            <TabsTrigger
              value="bodyfat"
              className="flex items-center gap-2 text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
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
