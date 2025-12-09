import { useState } from 'react'
import './App.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  DollarSign, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles,
  Video,
  Mail,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Check,
  Phone,
  Activity,
  Zap,
  Brain,
  Heart,
  Star,
  Send,
  Target,
  CreditCard,
  AlertTriangle,
  Info,
  MessageCircle,
  Bot
} from 'lucide-react'

type Page = 'landing' | 'demo'
type DemoView = 'dashboard' | 'scheduling' | 'patient' | 'billing' | 'analytics' | 'compliance' | 'ai-assistant' | 'communication'
type PracticeType = 'chiropractic' | 'physical-therapy'

// Sample data that changes based on practice type
const getPracticeData = (type: PracticeType) => {
  if (type === 'chiropractic') {
    return {
      practiceName: 'Unwind Chiropractic & Wellness',
      practiceColor: 'from-teal-500 to-emerald-600',
      visitTypes: ['New Patient Exam', 'Adjustment', 'Re-exam', 'Wellness Visit', 'Maintenance Care', 'Family Plan Visit'],
      samplePatients: [
        { id: 1, name: 'John Doe', status: 'New Patient', visit: 'First visit - Lower back pain', avatar: 'JD', color: 'bg-blue-500', condition: 'Lower back pain', intakeComplete: false },
        { id: 2, name: 'Maria Lopez', status: 'Regular', visit: 'Missed last adjustment', avatar: 'ML', color: 'bg-purple-500', condition: 'Cervical strain', intakeComplete: true },
        { id: 3, name: 'Mark Chen', status: 'Wellness Care', visit: 'Monthly maintenance', avatar: 'MC', color: 'bg-green-500', condition: 'Preventive care', intakeComplete: true },
        { id: 4, name: 'Lisa Patel', status: 'Pediatric', visit: 'Telehealth scheduled', avatar: 'LP', color: 'bg-pink-500', condition: 'Posture correction', intakeComplete: true },
        { id: 5, name: 'Brian Evans', status: 'Reactivation', visit: 'AI suggests follow-up', avatar: 'BE', color: 'bg-orange-500', condition: 'Chronic pain', intakeComplete: false },
      ],
      todayAppointments: [
        { time: '9:00 AM', patient: 'John Doe', type: 'New Patient Exam', duration: '60 min', status: 'confirmed' },
        { time: '10:30 AM', patient: 'Mark Chen', type: 'Adjustment', duration: '30 min', status: 'confirmed' },
        { time: '11:00 AM', patient: 'Maria Lopez', type: 'Adjustment', duration: '30 min', status: 'pending' },
        { time: '2:00 PM', patient: 'Lisa Patel', type: 'Telehealth', duration: '30 min', status: 'confirmed' },
        { time: '3:30 PM', patient: 'Brian Evans', type: 'Reactivation Visit', duration: '45 min', status: 'ai-suggested' },
      ],
      billingCodes: [
        { code: '98941', desc: 'Chiropractic manipulative treatment, 3-4 spinal regions', amount: 65, verified: true },
        { code: '97140', desc: 'Manual therapy techniques', amount: 45, verified: true },
        { code: '99213', desc: 'Office visit, established patient', amount: 85, verified: false },
      ],
      soapNote: {
        subjective: 'Patient reports continued improvement in lower back pain. Pain level: 4/10. No new complaints. Sleeping better.',
        objective: 'ROM: Improved lumbar flexion/extension. Palpation reveals decreased muscle tension in lumbar region. Posture assessment shows improvement.',
        assessment: 'Patient responding well to treatment. Subluxation patterns improving. Continue current treatment plan.',
        plan: 'Spinal adjustment (lumbar and thoracic), soft tissue therapy. Follow-up in 1 week. Continue home exercises and stretches.',
      }
    }
  } else {
    return {
      practiceName: 'Restore Physical Therapy & Rehab',
      practiceColor: 'from-blue-500 to-indigo-600',
      visitTypes: ['Initial Evaluation', 'Treatment Session', 'Progress Note', 'Re-evaluation', 'Discharge', 'Post-Op Rehab'],
      samplePatients: [
        { id: 1, name: 'Sarah Johnson', status: 'New Patient', visit: 'Initial eval - Post-op knee', avatar: 'SJ', color: 'bg-blue-500', condition: 'Post-op ACL repair', intakeComplete: false },
        { id: 2, name: 'David Martinez', status: 'Active Treatment', visit: 'Week 4 of 8 - Shoulder rehab', avatar: 'DM', color: 'bg-purple-500', condition: 'Rotator cuff strain', intakeComplete: true },
        { id: 3, name: 'Emily White', status: 'Progress Review', visit: 'Re-eval due today', avatar: 'EW', color: 'bg-green-500', condition: 'Lower back pain', intakeComplete: true },
        { id: 4, name: 'Michael Brown', status: 'Telehealth', visit: 'Virtual HEP review', avatar: 'MB', color: 'bg-pink-500', condition: 'Ankle sprain recovery', intakeComplete: true },
        { id: 5, name: 'Jennifer Lee', status: 'Discharge Planning', visit: 'Final session scheduled', avatar: 'JL', color: 'bg-orange-500', condition: 'Hip replacement rehab', intakeComplete: false },
      ],
      todayAppointments: [
        { time: '9:00 AM', patient: 'Sarah Johnson', type: 'Initial Evaluation', duration: '60 min', status: 'confirmed' },
        { time: '10:30 AM', patient: 'David Martinez', type: 'Treatment Session', duration: '45 min', status: 'confirmed' },
        { time: '11:30 AM', patient: 'Emily White', type: 'Re-evaluation', duration: '45 min', status: 'pending' },
        { time: '2:00 PM', patient: 'Michael Brown', type: 'Telehealth', duration: '30 min', status: 'confirmed' },
        { time: '3:30 PM', patient: 'Jennifer Lee', type: 'Discharge Session', duration: '45 min', status: 'ai-suggested' },
      ],
      billingCodes: [
        { code: '97110', desc: 'Therapeutic exercise, 15 minutes', amount: 55, verified: true },
        { code: '97140', desc: 'Manual therapy, 15 minutes', amount: 45, verified: true },
        { code: '97530', desc: 'Therapeutic activities, 15 minutes', amount: 50, verified: false },
      ],
      soapNote: {
        subjective: 'Patient reports decreased pain with ADLs. Pain level: 3/10. Able to perform HEP consistently. Improved sleep quality.',
        objective: 'ROM: Knee flexion 115° (improved from 95°). Strength: Quad 4/5, Hamstring 4/5. Gait: Minimal antalgic pattern. Functional tests show improvement.',
        assessment: 'Patient progressing well toward functional goals. Meeting expected milestones for post-op week 4. Continue current treatment approach.',
        plan: 'Continue therapeutic exercise progression, manual therapy, gait training. Advance HEP. Follow-up in 3 days. Re-eval scheduled for week 6.',
      }
    }
  }
}

const features = [
  { icon: Calendar, title: 'AI Scheduling', desc: 'Auto-fill, optimize calendars, and predict no-shows' },
  { icon: DollarSign, title: 'Automated Billing', desc: 'AI-driven coding, claims, and denials management' },
  { icon: FileText, title: 'Smart Documentation', desc: 'Auto-generate SOAP notes and visit summaries' },
  { icon: MessageSquare, title: 'Secure Communication', desc: 'Two-way messaging, reminders, and AI chat' },
  { icon: Users, title: 'Patient Portal', desc: 'Intake forms, self-scheduling, and progress tracking' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Practice performance, patient outcomes, and revenue insights' },
  { icon: Bell, title: 'Task Automation', desc: 'Follow-ups, recall reminders, and birthday greetings' },
  { icon: Activity, title: 'EHR/EMR Integrations', desc: 'Works with ChiroTouch, Jane, SimplePractice, WebPT, and more' },
  { icon: CreditCard, title: 'Payment Processing', desc: 'Stripe, Square, PayPal integration' },
  { icon: Mail, title: 'Marketing Automation', desc: 'AI campaigns, reactivation, and reputation management' },
  { icon: Video, title: 'Telehealth Integration', desc: 'One-click video visits and secure file sharing' },
  { icon: Bot, title: 'AI Business Assistant', desc: 'Your 24/7 AI practice manager for business optimization' },
]

type ComparisonValue = boolean | 'partial'

const comparisonData: { feature: string; auvora: ComparisonValue; chiroTouch: ComparisonValue; jane: ComparisonValue; simplePractice: ComparisonValue; webPT: ComparisonValue }[] = [
  { feature: 'Fully AI-Driven', auvora: true, chiroTouch: false, jane: false, simplePractice: false, webPT: false },
  { feature: 'HIPAA Compliance', auvora: true, chiroTouch: true, jane: true, simplePractice: true, webPT: true },
  { feature: 'Modern UI/UX', auvora: true, chiroTouch: false, jane: true, simplePractice: true, webPT: false },
  { feature: 'Automated Documentation', auvora: true, chiroTouch: false, jane: false, simplePractice: false, webPT: false },
  { feature: 'Predictive Analytics', auvora: true, chiroTouch: false, jane: false, simplePractice: false, webPT: false },
  { feature: 'Marketing Automation', auvora: true, chiroTouch: false, jane: 'partial', simplePractice: false, webPT: false },
  { feature: 'Telehealth & EHR Integrations', auvora: true, chiroTouch: 'partial', jane: true, simplePractice: true, webPT: 'partial' },
  { feature: 'Patient Self-Service Portal', auvora: true, chiroTouch: false, jane: true, simplePractice: true, webPT: 'partial' },
  { feature: 'AI Business Assistant', auvora: true, chiroTouch: false, jane: false, simplePractice: false, webPT: false },
  { feature: 'Business Optimization Focus', auvora: true, chiroTouch: 'partial', jane: false, simplePractice: false, webPT: 'partial' },
]

const howItWorks = [
  { step: 1, title: 'Log In', desc: 'Branded dashboard welcomes you with a daily summary and actionable AI insights.' },
  { step: 2, title: 'AI-Powered Scheduling', desc: 'Drag-and-drop calendar with AI suggestions to fill gaps and reduce no-shows.' },
  { step: 3, title: 'Patient Visit', desc: 'AI summarizes patient history and auto-generates documentation. Providers review, edit, and sign in one click.' },
  { step: 4, title: 'Automated Billing', desc: 'AI codes visits, submits claims, and flags issues for review.' },
  { step: 5, title: 'Patient Communication', desc: 'Automated follow-ups, reminders, and secure portal access for patients.' },
  { step: 6, title: 'Analytics', desc: 'Real-time dashboard shows hours saved, revenue growth, and patient satisfaction.' },
  { step: 7, title: 'Compliance', desc: 'Audit logs and access controls ensure HIPAA compliance at every step.' },
]

function LandingPage({ onStartDemo }: { onStartDemo: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Auvora Wellness
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 transition-colors">How It Works</a>
              <a href="#comparison" className="text-slate-600 hover:text-indigo-600 transition-colors">Compare</a>
              <Button onClick={onStartDemo} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
              <Sparkles className="w-3 h-3 mr-1" /> AI-Powered Healthcare CRM
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Finally, a CRM that works{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                as hard as you do.
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Auvora Wellness is the all-in-one, AI-powered CRM for chiropractors and physical therapists. 
              Automate your admin, delight your patients, and grow your practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={onStartDemo}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6"
              >
                Demo Auvora Wellness Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                See How Much You'll Save
              </Button>
            </div>
            
            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Shield, text: 'HIPAA Compliant' },
                { icon: Brain, text: 'AI-Driven' },
                { icon: Bell, text: 'Auto Reminders' },
                { icon: Activity, text: 'EHR Integration' },
                { icon: BarChart3, text: 'Real-time Analytics' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-center gap-2 text-slate-600 bg-white/60 rounded-lg py-3 px-4">
                  <item.icon className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">Features</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Comprehensive, AI-Powered Features
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to run a modern healthcare practice, powered by artificial intelligence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">How It Works</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Streamlined Workflow, Powered by AI
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.slice(0, 4).map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
                {item.step < 4 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 text-indigo-400 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {howItWorks.slice(4).map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">Comparison</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              See How We Compare
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Auvora Wellness leads the industry with comprehensive AI-powered features and business optimization focus.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 font-semibold text-slate-900">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-indigo-600 bg-indigo-50 rounded-t-lg">Auvora Wellness</th>
                  <th className="text-center py-4 px-4 font-semibold text-slate-600">ChiroTouch</th>
                  <th className="text-center py-4 px-4 font-semibold text-slate-600">Jane</th>
                  <th className="text-center py-4 px-4 font-semibold text-slate-600">SimplePractice</th>
                  <th className="text-center py-4 px-4 font-semibold text-slate-600">WebPT</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-4 px-4 text-slate-700">{row.feature}</td>
                    <td className="py-4 px-4 text-center bg-indigo-50">
                      {row.auvora === true ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                      ) : row.auvora === 'partial' ? (
                        <span className="text-yellow-600 text-sm">Partial</span>
                      ) : (
                        <XCircle className="w-6 h-6 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.chiroTouch === true ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                      ) : row.chiroTouch === 'partial' ? (
                        <span className="text-yellow-600 text-sm">Partial</span>
                      ) : (
                        <XCircle className="w-6 h-6 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.jane === true ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                      ) : row.jane === 'partial' ? (
                        <span className="text-yellow-600 text-sm">Partial</span>
                      ) : (
                        <XCircle className="w-6 h-6 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.simplePractice === true ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                      ) : row.simplePractice === 'partial' ? (
                        <span className="text-yellow-600 text-sm">Partial</span>
                      ) : (
                        <XCircle className="w-6 h-6 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.webPT === true ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                      ) : row.webPT === 'partial' ? (
                        <span className="text-yellow-600 text-sm">Partial</span>
                      ) : (
                        <XCircle className="w-6 h-6 text-slate-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            See how much time and money you'll save with Auvora Wellness.
          </p>
          <Button 
            size="lg" 
            onClick={onStartDemo}
            className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-8 py-6"
          >
            Start Your Free Demo <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">Auvora Wellness</span>
          </div>
          <p className="text-sm text-center md:text-left">
            Auvora Wellness is a division of Auvora. 2025. All rights reserved. HIPAA compliant. For demo purposes only.
          </p>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm">HIPAA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function DemoApp({ onBackToLanding }: { onBackToLanding: () => void }) {
  const [practiceType, setPracticeType] = useState<PracticeType>('chiropractic')
  const [currentView, setCurrentView] = useState<DemoView>('dashboard')
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  
  const practiceData = getPracticeData(practiceType)
  const [selectedPatient, setSelectedPatient] = useState(practiceData.samplePatients[0])
  const [soapApproved, setSoapApproved] = useState(false)
  const [claimSubmitted, setClaimSubmitted] = useState(false)

  const handlePracticeTypeChange = (checked: boolean) => {
    const newType = checked ? 'physical-therapy' : 'chiropractic'
    setPracticeType(newType)
    const newData = getPracticeData(newType)
    setSelectedPatient(newData.samplePatients[0])
    setSoapApproved(false)
    setClaimSubmitted(false)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Demo Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${practiceData.practiceColor} flex items-center justify-center`}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900">{practiceData.practiceName}</span>
                <p className="text-xs text-slate-500">Powered by Auvora Wellness</p>
              </div>
            </div>
            
            {/* Practice Type Toggle */}
            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-slate-200">
              <Label htmlFor="practice-toggle" className="text-sm font-medium text-slate-700">
                {practiceType === 'chiropractic' ? 'Chiropractic' : 'Physical Therapy'}
              </Label>
              <Switch 
                id="practice-toggle" 
                checked={practiceType === 'physical-therapy'}
                onCheckedChange={handlePracticeTypeChange}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-slate-600 ${showAIAssistant ? 'bg-indigo-50 text-indigo-600' : ''}`}
              onClick={() => setShowAIAssistant(!showAIAssistant)}
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600">
              <Bell className="w-4 h-4 mr-2" />
              <Badge className="bg-red-500 text-white text-xs">3</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <Avatar className="w-8 h-8">
                <AvatarFallback className={`bg-gradient-to-br ${practiceData.practiceColor} text-white`}>
                  {practiceType === 'chiropractic' ? 'JS' : 'AM'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-slate-700">
                {practiceType === 'chiropractic' ? 'Dr. Jamie Smith' : 'Dr. Alex Morgan'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onBackToLanding} className="text-slate-600">
              <LogOut className="w-4 h-4 mr-2" /> Exit Demo
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] p-4">
          <nav className="space-y-1">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'scheduling', icon: Calendar, label: 'Scheduling' },
              { id: 'patient', icon: Users, label: 'Patient Visit' },
              { id: 'billing', icon: DollarSign, label: 'Billing' },
              { id: 'communication', icon: MessageSquare, label: 'Communication' },
              { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
              { id: 'compliance', icon: Shield, label: 'Compliance' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as DemoView)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  currentView === item.id
                    ? `bg-gradient-to-r ${practiceData.practiceColor} text-white font-medium`
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 relative">
          {currentView === 'dashboard' && (
            <DashboardView 
              practiceType={practiceType}
              practiceData={practiceData}
              onNavigate={setCurrentView} 
              setSelectedPatient={setSelectedPatient}
            />
          )}
          {currentView === 'scheduling' && (
            <SchedulingView 
              practiceType={practiceType}
              practiceData={practiceData}
              onSelectPatient={(name) => {
                const patient = practiceData.samplePatients.find(p => p.name === name)
                if (patient) {
                  setSelectedPatient(patient)
                  setCurrentView('patient')
                }
              }}
            />
          )}
          {currentView === 'patient' && (
            <PatientView 
              practiceType={practiceType}
              practiceData={practiceData}
              patient={selectedPatient}
              soapApproved={soapApproved}
              onApproveSOAP={() => setSoapApproved(true)}
              onNavigateToBilling={() => setCurrentView('billing')}
            />
          )}
          {currentView === 'billing' && (
            <BillingView 
              practiceType={practiceType}
              practiceData={practiceData}
              patient={selectedPatient}
              claimSubmitted={claimSubmitted}
              onSubmitClaim={() => setClaimSubmitted(true)}
            />
          )}
          {currentView === 'communication' && (
            <CommunicationView 
              practiceData={practiceData}
            />
          )}
          {currentView === 'analytics' && (
            <AnalyticsView
              practiceType={practiceType}
              practiceData={practiceData}
            />
          )}
          {currentView === 'compliance' && (
            <ComplianceView 
              practiceType={practiceType}
              practiceData={practiceData}
            />
          )}

          {/* AI Assistant Sidebar */}
          {showAIAssistant && (
            <AIAssistantPanel 
              practiceType={practiceType}
              practiceData={practiceData}
              onClose={() => setShowAIAssistant(false)}
            />
          )}
        </main>
      </div>
    </div>
  )
}

// Component implementations continue in next part due to length...
// I'll create the remaining view components

function DashboardView({ 
  practiceType,
  practiceData,
  onNavigate, 
  setSelectedPatient 
}: { 
  practiceType: PracticeType
  practiceData: ReturnType<typeof getPracticeData>
  onNavigate: (view: DemoView) => void
  setSelectedPatient: (patient: typeof practiceData.samplePatients[0]) => void
}) {
  const doctorName = practiceType === 'chiropractic' ? 'Dr. Jamie Smith' : 'Dr. Alex Morgan'
  
  return (
    <div className="space-y-6">
      {/* AI Welcome */}
      <Card className={`bg-gradient-to-r ${practiceData.practiceColor} text-white border-0`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Good morning, {doctorName}!</h2>
              <p className="text-white/90 text-lg">
                You have <span className="font-semibold">5 appointments</span> today. 
                2 have completed intake forms, 1 is a new patient.
              </p>
              <div className="flex gap-4 mt-4">
                <Button 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={() => onNavigate('scheduling')}
                >
                  View Schedule
                </Button>
                <Button 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={() => onNavigate('analytics')}
                >
                  View Analytics
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Today\'s Appointments', value: '5', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Claims', value: '3', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Unread Messages', value: '7', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'AI Suggestions', value: '4', icon: Sparkles, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Schedule & Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {practiceData.todayAppointments.slice(0, 4).map((apt, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                  onClick={() => {
                    const patient = practiceData.samplePatients.find(p => p.name === apt.patient)
                    if (patient) {
                      setSelectedPatient(patient)
                      onNavigate('patient')
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-slate-500 w-20">{apt.time}</div>
                    <div>
                      <p className="font-medium text-slate-900">{apt.patient}</p>
                      <p className="text-sm text-slate-500">{apt.type}</p>
                    </div>
                  </div>
                  <Badge 
                    className={
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'ai-suggested' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }
                  >
                    {apt.status === 'ai-suggested' ? 'AI Suggested' : apt.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-indigo-600"
              onClick={() => onNavigate('scheduling')}
            >
              View Full Schedule <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Patient Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {practiceData.samplePatients.map((patient) => (
                <div 
                  key={patient.id} 
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedPatient(patient)
                    onNavigate('patient')
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className={`${patient.color} text-white`}>
                        {patient.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{patient.name}</p>
                      <p className="text-sm text-slate-500">{patient.visit}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{patient.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Sparkles className="w-5 h-5" />
            AI Business Insights & Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">
                  {practiceType === 'chiropractic' 
                    ? 'Maria Lopez missed her last adjustment' 
                    : 'David Martinez is due for re-evaluation'}
                </p>
                <p className="text-sm text-slate-500">AI suggests sending a reactivation message</p>
                <Button size="sm" className="mt-2 bg-orange-500 hover:bg-orange-600">Send Message</Button>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Schedule gap detected at 1:00 PM</p>
                <p className="text-sm text-slate-500">
                  {practiceType === 'chiropractic' 
                    ? 'Brian Evans is due for a follow-up' 
                    : 'Jennifer Lee needs discharge planning'}
                </p>
                <Button size="sm" className="mt-2 bg-indigo-500 hover:bg-indigo-600">Auto-Schedule</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SchedulingView({ 
  practiceType,
  practiceData,
  onSelectPatient
}: { 
  practiceType: PracticeType
  practiceData: ReturnType<typeof getPracticeData>
  onSelectPatient: (name: string) => void
}) {
  const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI-Powered Scheduling</h1>
          <p className="text-slate-500">Drag-and-drop calendar with AI suggestions to fill gaps and reduce no-shows</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Clock className="w-4 h-4 mr-2" /> Today
          </Button>
          <Button className={`bg-gradient-to-r ${practiceData.practiceColor} text-white`}>
            <Sparkles className="w-4 h-4 mr-2" /> AI Optimize
          </Button>
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <Card className="border-indigo-200 bg-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-indigo-900">AI detected a 1-hour gap at 1:00 PM</p>
              <p className="text-sm text-indigo-700">
                {practiceType === 'chiropractic'
                  ? 'Brian Evans is overdue for a follow-up. Would you like to auto-schedule?'
                  : 'Jennifer Lee needs discharge planning. Would you like to auto-schedule?'}
              </p>
            </div>
            <Button className={`bg-gradient-to-r ${practiceData.practiceColor} text-white`}>Auto-Fill Gap</Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-2">
            {timeSlots.map((time) => {
              const appointment = practiceData.todayAppointments.find(a => a.time === time)
              const isGap = time === '1:00 PM'
              
              return (
                <div 
                  key={time} 
                  className={`flex items-center gap-4 p-3 rounded-lg border-2 border-dashed transition-all ${
                    appointment 
                      ? 'border-transparent bg-slate-50' 
                      : isGap 
                        ? 'border-indigo-300 bg-indigo-50' 
                        : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="w-20 text-sm font-medium text-slate-500">{time}</div>
                  {appointment ? (
                    <div 
                      className={`flex-1 p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        appointment.status === 'ai-suggested' 
                          ? 'bg-orange-100 border border-orange-200' 
                          : 'bg-white border border-slate-200'
                      }`}
                      onClick={() => onSelectPatient(appointment.patient)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{appointment.patient}</p>
                          <p className="text-sm text-slate-500">{appointment.type} - {appointment.duration}</p>
                        </div>
                        <Badge 
                          className={
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            appointment.status === 'ai-suggested' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }
                        >
                          {appointment.status === 'ai-suggested' ? 'AI Suggested' : appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ) : isGap ? (
                    <div className="flex-1 p-3 rounded-lg bg-indigo-100 border border-indigo-200 text-center">
                      <p className="text-indigo-700 font-medium">
                        AI Suggested: Schedule {practiceType === 'chiropractic' ? 'Brian Evans' : 'Jennifer Lee'}
                      </p>
                      <p className="text-sm text-indigo-600">Click to auto-fill this gap</p>
                    </div>
                  ) : (
                    <div className="flex-1 p-3 text-center text-slate-400">
                      Available - Drag appointment here
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PatientView({ 
  practiceType,
  practiceData,
  patient, 
  soapApproved, 
  onApproveSOAP,
  onNavigateToBilling
}: { 
  practiceType: PracticeType
  practiceData: ReturnType<typeof getPracticeData>
  patient: ReturnType<typeof getPracticeData>['samplePatients'][0]
  soapApproved: boolean
  onApproveSOAP: () => void
  onNavigateToBilling: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className={`${patient.color} text-white text-xl`}>
              {patient.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{patient.status}</Badge>
              {patient.intakeComplete && (
                <Badge className="bg-green-100 text-green-700">Intake Complete</Badge>
              )}
              <Badge className="bg-blue-100 text-blue-700">{patient.condition}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" /> Call
          </Button>
          <Button variant="outline">
            <Video className="w-4 h-4 mr-2" /> Telehealth
          </Button>
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" /> Message
          </Button>
        </div>
      </div>

      {/* AI Summary */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Brain className="w-5 h-5" />
            AI Patient Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700">
            <strong>{patient.name}</strong> is a {patient.status.toLowerCase()} patient presenting for{' '}
            {patient.status === 'New Patient' 
              ? practiceType === 'chiropractic' ? 'initial chiropractic evaluation' : 'initial physical therapy evaluation'
              : practiceType === 'chiropractic' ? 'ongoing chiropractic care' : 'ongoing physical therapy treatment'}
            . Chief complaint: {patient.condition}.{' '}
            {patient.intakeComplete 
              ? 'All intake forms have been completed and reviewed.' 
              : 'Intake forms are pending completion.'}
            {patient.status === 'Reactivation' && ' Last visit was 3 months ago. AI recommends discussing treatment plan adherence.'}
            {patient.status === 'Pediatric' && ' Parent/guardian consent on file. Age-appropriate treatment protocols recommended.'}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient History */}
        <Card>
          <CardHeader>
            <CardTitle>Patient History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="visits">
              <TabsList className="w-full">
                <TabsTrigger value="visits" className="flex-1">Visits</TabsTrigger>
                <TabsTrigger value="conditions" className="flex-1">Conditions</TabsTrigger>
                <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="visits" className="mt-4">
                <div className="space-y-3">
                  {patient.status !== 'New Patient' ? (
                    <>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex justify-between">
                          <span className="font-medium">Last Visit</span>
                          <span className="text-slate-500">Nov 15, 2024</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {practiceType === 'chiropractic' 
                            ? 'Spinal adjustment, soft tissue therapy' 
                            : 'Therapeutic exercise, manual therapy'}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex justify-between">
                          <span className="font-medium">Previous Visit</span>
                          <span className="text-slate-500">Nov 8, 2024</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {practiceType === 'chiropractic' 
                            ? 'Initial evaluation, X-rays' 
                            : 'Initial evaluation, functional assessment'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-500 text-center py-4">No previous visits</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="conditions" className="mt-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="mr-2">{patient.condition}</Badge>
                  {practiceType === 'chiropractic' ? (
                    <>
                      <Badge variant="outline" className="mr-2">Muscle tension</Badge>
                      <Badge variant="outline">Postural issues</Badge>
                    </>
                  ) : (
                    <>
                      <Badge variant="outline" className="mr-2">Decreased ROM</Badge>
                      <Badge variant="outline">Functional limitations</Badge>
                    </>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="notes" className="mt-4">
                <p className="text-slate-600 text-sm">
                  {practiceType === 'chiropractic'
                    ? 'Patient reports improvement in mobility. Continues home exercises as prescribed.'
                    : 'Patient demonstrating good progress toward functional goals. Compliant with home exercise program.'}
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* AI-Generated SOAP Note */}
        <Card className={soapApproved ? 'border-green-200' : 'border-orange-200'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              AI-Generated SOAP Note
              {soapApproved && <Badge className="bg-green-100 text-green-700 ml-2">Approved</Badge>}
            </CardTitle>
            <CardDescription>Auto-generated documentation ready for review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-slate-900">Subjective</h4>
                <p className="text-slate-600">{practiceData.soapNote.subjective}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Objective</h4>
                <p className="text-slate-600">{practiceData.soapNote.objective}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Assessment</h4>
                <p className="text-slate-600">{practiceData.soapNote.assessment}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Plan</h4>
                <p className="text-slate-600">{practiceData.soapNote.plan}</p>
              </div>
            </div>
            {!soapApproved ? (
              <div className="flex gap-2 mt-6">
                <Button className={`flex-1 bg-gradient-to-r ${practiceData.practiceColor} text-white`} onClick={onApproveSOAP}>
                  <Check className="w-4 h-4 mr-2" /> Approve & Sign
                </Button>
                <Button variant="outline" className="flex-1">Edit Note</Button>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">
                    SOAP note approved and signed by {practiceType === 'chiropractic' ? 'Dr. Jamie Smith' : 'Dr. Alex Morgan'}
                  </span>
                </div>
                <Button 
                  className={`mt-4 bg-gradient-to-r ${practiceData.practiceColor} text-white`}
                  onClick={onNavigateToBilling}
                >
                  Proceed to Billing <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Automated Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Automated Patient Communication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Appointment Reminder</span>
              </div>
              <p className="text-sm text-slate-600">Sent 24 hours before visit</p>
              <Badge className="mt-2 bg-green-100 text-green-700">Delivered</Badge>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Follow-up Message</span>
              </div>
              <p className="text-sm text-slate-600">Scheduled for tomorrow</p>
              <Badge className="mt-2 bg-yellow-100 text-yellow-700">Pending</Badge>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <span className="font-medium">Portal Invite</span>
              </div>
              <p className="text-sm text-slate-600">Patient portal access</p>
              <Badge className="mt-2 bg-green-100 text-green-700">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BillingView({ 
  practiceType,
  practiceData,
  patient, 
  claimSubmitted,
  onSubmitClaim
}: { 
  practiceType: PracticeType
  practiceData: ReturnType<typeof getPracticeData>
  patient: ReturnType<typeof getPracticeData>['samplePatients'][0]
  claimSubmitted: boolean
  onSubmitClaim: () => void
}) {
  const totalAmount = practiceData.billingCodes.reduce((sum, code) => sum + code.amount, 0)
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Automated Billing</h1>
        <p className="text-slate-500">AI-driven coding, claims submission, and denials management</p>
      </div>

      {/* AI Coding */}
      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            AI-Generated Billing Codes
          </CardTitle>
          <CardDescription>Automatically coded based on today's visit documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {practiceData.billingCodes.map((code, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-lg ${
                code.verified ? 'bg-slate-50' : 'bg-orange-50 border border-orange-200'
              }`}>
                <div>
                  <p className="font-mono font-medium text-slate-900">{code.code}</p>
                  <p className="text-sm text-slate-600">{code.desc}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">${code.amount}.00</p>
                  <Badge className={code.verified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                    {code.verified ? 'AI Verified' : 'Review Suggested'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-slate-100 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700">Total Charges</span>
              <span className="text-2xl font-bold text-slate-900">${totalAmount}.00</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claim Submission */}
      <Card className={claimSubmitted ? 'border-green-200' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            Claim Submission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Patient</p>
              <p className="font-medium text-slate-900">{patient.name}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Insurance</p>
              <p className="font-medium text-slate-900">Blue Cross Blue Shield</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Date of Service</p>
              <p className="font-medium text-slate-900">December 9, 2024</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Provider</p>
              <p className="font-medium text-slate-900">
                {practiceType === 'chiropractic' ? 'Dr. Jamie Smith' : 'Dr. Alex Morgan'}
              </p>
            </div>
          </div>

          {!claimSubmitted ? (
            <div className="flex gap-2">
              <Button className={`flex-1 bg-gradient-to-r ${practiceData.practiceColor} text-white`} onClick={onSubmitClaim}>
                <Sparkles className="w-4 h-4 mr-2" /> Submit Claim via AI
              </Button>
              <Button variant="outline" className="flex-1">Review Details</Button>
            </div>
          ) : (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Claim Submitted Successfully</span>
              </div>
              <p className="text-sm text-green-600">Claim #CLM-2024-120901 submitted to Blue Cross Blue Shield</p>
              <p className="text-sm text-green-600 mt-1">Estimated processing time: 5-7 business days</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Claims */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Claims Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'CLM-2024-120501', patient: practiceData.samplePatients[2].name, amount: '$175.00', status: 'Paid', date: 'Dec 5' },
              { id: 'CLM-2024-120301', patient: practiceData.samplePatients[3].name, amount: '$210.00', status: 'Processing', date: 'Dec 3' },
              { id: 'CLM-2024-112801', patient: practiceData.samplePatients[1].name, amount: '$145.00', status: 'Denied', date: 'Nov 28' },
            ].map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-mono text-sm text-slate-500">{claim.id}</p>
                  <p className="font-medium text-slate-900">{claim.patient}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">{claim.amount}</p>
                  <Badge 
                    className={
                      claim.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      claim.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }
                  >
                    {claim.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CommunicationView({
  practiceData
}: {
  practiceData: ReturnType<typeof getPracticeData>
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Patient Communication</h1>
        <p className="text-slate-500">AI-powered messaging, reminders, and patient engagement</p>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Messages Sent', value: '127', icon: Send, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Reminders Delivered', value: '45', icon: Bell, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Portal Active Users', value: '89%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Response Rate', value: '94%', icon: MessageCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Campaign Builder */}
      <Card className="border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <Sparkles className="w-5 h-5" />
            AI Campaign Builder
          </CardTitle>
          <CardDescription className="text-indigo-600">
            Let AI create personalized campaigns for patient reactivation, wellness reminders, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className={`bg-gradient-to-r ${practiceData.practiceColor} text-white h-auto py-4 flex-col items-start`}>
              <Target className="w-5 h-5 mb-2" />
              <span className="font-semibold">Reactivation Campaign</span>
              <span className="text-xs opacity-90">Target inactive patients</span>
            </Button>
            <Button className={`bg-gradient-to-r ${practiceData.practiceColor} text-white h-auto py-4 flex-col items-start`}>
              <Heart className="w-5 h-5 mb-2" />
              <span className="font-semibold">Wellness Reminders</span>
              <span className="text-xs opacity-90">Preventive care outreach</span>
            </Button>
            <Button className={`bg-gradient-to-r ${practiceData.practiceColor} text-white h-auto py-4 flex-col items-start`}>
              <Star className="w-5 h-5 mb-2" />
              <span className="font-semibold">Review Requests</span>
              <span className="text-xs opacity-90">Boost online reputation</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {practiceData.samplePatients.slice(0, 4).map((patient) => (
                <div key={patient.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className={`${patient.color} text-white`}>
                      {patient.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-slate-900">{patient.name}</p>
                      <span className="text-xs text-slate-500">2h ago</span>
                    </div>
                    <p className="text-sm text-slate-600">Thank you for the appointment reminder!</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automated Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Monthly Wellness Check', sent: 45, opened: 42, clicked: 28, status: 'active' },
                { name: 'Reactivation Series', sent: 23, opened: 19, clicked: 12, status: 'active' },
                { name: 'Birthday Greetings', sent: 8, opened: 8, clicked: 5, status: 'scheduled' },
              ].map((campaign, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-slate-900">{campaign.name}</p>
                    <Badge className={campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-600">
                    <span>Sent: {campaign.sent}</span>
                    <span>Opened: {campaign.opened}</span>
                    <span>Clicked: {campaign.clicked}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AnalyticsView({
  practiceType,
  practiceData
}: {
  practiceType: PracticeType
  practiceData: ReturnType<typeof getPracticeData>
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
        <p className="text-slate-500">Real-time insights into your practice performance and business optimization</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Admin Hours Saved', value: '7', unit: 'this week', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+15%' },
          { label: 'Revenue Growth', value: '12%', unit: 'vs last month', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', trend: '+3%' },
          { label: 'Patient Satisfaction', value: '4.8', unit: 'out of 5', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50', trend: '+0.2' },
          { label: 'No-Show Rate', value: '3%', unit: 'reduced', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', trend: '-5%' },
        ].map((metric, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl ${metric.bg} flex items-center justify-center`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <Badge className={metric.trend.startsWith('+') || metric.trend.startsWith('-5') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {metric.trend}
                </Badge>
              </div>
              <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
              <p className="text-sm text-slate-500">{metric.label}</p>
              <p className="text-xs text-slate-400">{metric.unit}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights Banner */}
      <Card className={`bg-gradient-to-r ${practiceData.practiceColor} text-white border-0`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">You saved 7 admin hours this week!</h3>
              <p className="text-white/90">Revenue is up 12% compared to last month. Keep up the great work!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[
                { month: 'Jul', value: 65 },
                { month: 'Aug', value: 72 },
                { month: 'Sep', value: 68 },
                { month: 'Oct', value: 85 },
                { month: 'Nov', value: 92 },
                { month: 'Dec', value: 100 },
              ].map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className={`w-full bg-gradient-to-t ${practiceData.practiceColor} rounded-t-lg transition-all hover:opacity-80`}
                    style={{ height: `${item.value * 2}px` }}
                  />
                  <span className="text-sm text-slate-500">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle>
              {practiceType === 'chiropractic' ? 'Patient Outcomes' : 'Functional Outcomes'}
            </CardTitle>
            <CardDescription>Treatment effectiveness metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Pain Reduction', value: 78 },
                { label: practiceType === 'chiropractic' ? 'Mobility Improvement' : 'Functional Improvement', value: 85 },
                { label: 'Treatment Adherence', value: 92 },
                { label: 'Patient Retention', value: 88 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <span className="text-sm font-medium text-slate-900">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Appointments', value: '127', period: 'This month' },
              { label: 'New Patients', value: '18', period: 'This month' },
              { label: 'Avg. Visit Duration', value: practiceType === 'chiropractic' ? '32 min' : '45 min', period: 'This month' },
              { label: 'Telehealth Visits', value: '23', period: 'This month' },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm font-medium text-slate-700">{stat.label}</p>
                <p className="text-xs text-slate-500">{stat.period}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ComplianceView({
  practiceType,
  practiceData
}: {
  practiceType: PracticeType
  practiceData: ReturnType<typeof getPracticeData>
}) {
  const doctorName = practiceType === 'chiropractic' ? 'Dr. Jamie Smith' : 'Dr. Alex Morgan'
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Compliance & Security</h1>
        <p className="text-slate-500">HIPAA compliance, audit logs, and access controls</p>
      </div>

      {/* Compliance Status */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-800">HIPAA Compliant</h3>
              <p className="text-green-700">All systems are fully compliant with HIPAA regulations</p>
              <p className="text-sm text-green-600 mt-1">Last audit: December 1, 2024 - Passed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Recent Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'Patient record accessed', user: doctorName, time: '2 min ago', type: 'view' },
                { action: 'SOAP note created', user: doctorName, time: '15 min ago', type: 'create' },
                { action: 'Claim submitted', user: 'System (AI)', time: '20 min ago', type: 'submit' },
                { action: 'User login', user: doctorName, time: '1 hour ago', type: 'login' },
                { action: 'Patient record updated', user: doctorName, time: '2 hours ago', type: 'update' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      log.type === 'view' ? 'bg-blue-100' :
                      log.type === 'create' ? 'bg-green-100' :
                      log.type === 'submit' ? 'bg-purple-100' :
                      log.type === 'login' ? 'bg-yellow-100' :
                      'bg-orange-100'
                    }`}>
                      {log.type === 'view' && <Users className="w-4 h-4 text-blue-600" />}
                      {log.type === 'create' && <FileText className="w-4 h-4 text-green-600" />}
                      {log.type === 'submit' && <DollarSign className="w-4 h-4 text-purple-600" />}
                      {log.type === 'login' && <LogOut className="w-4 h-4 text-yellow-600" />}
                      {log.type === 'update' && <Settings className="w-4 h-4 text-orange-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{log.action}</p>
                      <p className="text-xs text-slate-500">{log.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{log.time}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-indigo-600">
              View All Logs <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Access Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Access Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: doctorName, role: 'Provider', access: 'Full Access', status: 'active' },
                { name: 'Sarah Johnson', role: 'Office Manager', access: 'Admin Access', status: 'active' },
                { name: 'Mike Williams', role: 'Billing Specialist', access: 'Billing Only', status: 'active' },
                { name: 'Emily Davis', role: 'Front Desk', access: 'Scheduling Only', status: 'active' },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className={`bg-gradient-to-br ${practiceData.practiceColor} text-white`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{user.access}</Badge>
                    <p className="text-xs text-green-600 mt-1">Active</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Manage Permissions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>Security Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'Data Encryption', desc: 'AES-256 encryption at rest and in transit', status: 'Active' },
              { icon: Users, title: 'Role-Based Access', desc: 'Granular permissions for all users', status: 'Active' },
              { icon: FileText, title: 'Audit Logging', desc: 'Complete activity tracking', status: 'Active' },
              { icon: Clock, title: 'Session Timeout', desc: 'Auto-logout after 15 min inactivity', status: 'Active' },
              { icon: Bell, title: 'Breach Alerts', desc: 'Real-time security notifications', status: 'Active' },
              { icon: Activity, title: 'BAA Compliant', desc: 'Business Associate Agreement ready', status: 'Active' },
            ].map((feature, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${practiceData.practiceColor} bg-opacity-10 flex items-center justify-center`}>
                    <feature.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{feature.title}</p>
                    <Badge className="bg-green-100 text-green-700 text-xs">{feature.status}</Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AIAssistantPanel({
  practiceType,
  practiceData,
  onClose
}: {
  practiceType: PracticeType
  practiceData: ReturnType<typeof getPracticeData>
  onClose: () => void
}) {
  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col">
      <div className={`bg-gradient-to-r ${practiceData.practiceColor} text-white p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-bold">AI Business Assistant</h3>
            <p className="text-xs opacity-90">Your 24/7 practice optimization partner</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
          <XCircle className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* AI Greeting */}
        <div className="flex gap-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${practiceData.practiceColor} flex items-center justify-center flex-shrink-0`}>
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 bg-slate-100 rounded-lg p-3">
            <p className="text-sm text-slate-700">
              Hi! I'm your AI Business Assistant. I can help you with scheduling optimization, billing questions, 
              patient communication, and business insights. What would you like to know?
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase">Quick Actions</p>
          <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">Optimize today's schedule</span>
          </Button>
          <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
            <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">Review pending claims</span>
          </Button>
          <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
            <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">Draft reactivation campaign</span>
          </Button>
          <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
            <BarChart3 className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">Generate weekly report</span>
          </Button>
        </div>

        {/* AI Insights */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase">Today's Insights</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">Schedule Gap Detected</p>
                <p className="text-xs text-blue-700 mt-1">
                  You have a 1-hour gap at 1:00 PM. I can auto-schedule a patient who's overdue for a visit.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900">Revenue Opportunity</p>
                <p className="text-xs text-green-700 mt-1">
                  12 patients are due for {practiceType === 'chiropractic' ? 'wellness visits' : 're-evaluation'}. 
                  Potential revenue: $1,440
                </p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-orange-900">Claim Attention Needed</p>
                <p className="text-xs text-orange-700 mt-1">
                  1 claim was denied. I've identified the issue and can help you resubmit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ask me anything..." 
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button className={`bg-gradient-to-r ${practiceData.practiceColor} text-white`}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing')

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage onStartDemo={() => setCurrentPage('demo')} />
      )}
      {currentPage === 'demo' && (
        <DemoApp onBackToLanding={() => setCurrentPage('landing')} />
      )}
    </>
  )
}

export default App
