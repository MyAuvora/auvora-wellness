import { useState, useRef } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
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
  ArrowRight,
  Sparkles,
  Video,
  Mail,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
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
  AlertTriangle,
  Info,
  MessageCircle,
  Bot,
  FolderOpen,
  Image,
  Upload,
  Download,
  Eye,
  File,
  X,
  Mic,
  MicOff,
  Square,
  Loader2,
  RefreshCw,
  Plus
} from 'lucide-react'

type DemoView = 'dashboard' | 'scheduling' | 'patients' | 'patient' | 'billing' | 'analytics' | 'compliance' | 'ai-assistant' | 'communication' | 'staff-management' | 'practice-settings'
type PracticeType = 'chiropractic' | 'physical-therapy' | 'float-spa'
type UserRole = 'provider' | 'patient'
type StaffRole = 'owner' | 'doctor' | 'front-desk'

// Role-based navigation configuration
const getRoleNavigation = (role: StaffRole) => {
  const baseNav = [
    { id: 'dashboard', icon: 'BarChart3', label: 'Dashboard' },
    { id: 'scheduling', icon: 'Calendar', label: 'Scheduling' },
    { id: 'patients', icon: 'Users', label: 'Patients' },
  ]
  
  if (role === 'owner') {
    return [
      ...baseNav,
      { id: 'patient', icon: 'FileText', label: 'Patient Visit' },
      { id: 'billing', icon: 'DollarSign', label: 'Billing & Finance' },
      { id: 'communication', icon: 'MessageSquare', label: 'Communication' },
      { id: 'analytics', icon: 'TrendingUp', label: 'Analytics' },
      { id: 'staff-management', icon: 'Users', label: 'Staff Management' },
      { id: 'practice-settings', icon: 'Settings', label: 'Practice Settings' },
      { id: 'compliance', icon: 'Shield', label: 'Compliance' },
    ]
  }
  
  if (role === 'doctor') {
    return [
      ...baseNav,
      { id: 'patient', icon: 'FileText', label: 'Patient Visit' },
      { id: 'communication', icon: 'MessageSquare', label: 'Communication' },
      { id: 'analytics', icon: 'TrendingUp', label: 'My Analytics' },
    ]
  }
  
  // Front desk
  return [
    ...baseNav,
    { id: 'billing', icon: 'DollarSign', label: 'Billing & Payments' },
    { id: 'communication', icon: 'MessageSquare', label: 'Communication' },
  ]
}

// Role display names and info
const getRoleInfo = (role: StaffRole) => {
  switch (role) {
    case 'owner':
      return { name: 'Dr. Jamie Smith', title: 'Owner/Admin', initials: 'JS' }
    case 'doctor':
      return { name: 'Dr. Sarah Chen', title: 'Chiropractor', initials: 'SC' }
    case 'front-desk':
      return { name: 'Emily Rodriguez', title: 'Front Desk', initials: 'ER' }
  }
}

interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
}

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
  } else if (type === 'physical-therapy') {
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
  } else {
    // Float Spa / Basic Wellness
    return {
      practiceName: 'TruRest Float Spa & Wellness',
      practiceColor: 'from-indigo-500 to-purple-600',
      visitTypes: ['Float Session', '60-Min Float', '90-Min Float', 'Couples Float', 'Massage', 'Infrared Sauna', 'Cryotherapy'],
      samplePatients: [
        { id: 1, name: 'Amanda Brooks', status: 'Member', visit: 'Monthly unlimited - Float today', avatar: 'AB', color: 'bg-indigo-500', condition: 'Stress relief', intakeComplete: true },
        { id: 2, name: 'Tyler Reed', status: 'New Client', visit: 'First float experience', avatar: 'TR', color: 'bg-purple-500', condition: 'Anxiety management', intakeComplete: false },
        { id: 3, name: 'Jessica Kim', status: 'Package', visit: '5-pack: 3 remaining', avatar: 'JK', color: 'bg-pink-500', condition: 'Athletic recovery', intakeComplete: true },
        { id: 4, name: 'Marcus Hall', status: 'Walk-in', visit: 'Infrared sauna session', avatar: 'MH', color: 'bg-orange-500', condition: 'Muscle tension', intakeComplete: true },
        { id: 5, name: 'Rachel Green', status: 'VIP Member', visit: 'Couples float booked', avatar: 'RG', color: 'bg-green-500', condition: 'Relaxation', intakeComplete: true },
      ],
      todayAppointments: [
        { time: '10:00 AM', patient: 'Amanda Brooks', type: '90-Min Float', duration: '90 min', status: 'confirmed' },
        { time: '11:00 AM', patient: 'Tyler Reed', type: 'First Float (60 min)', duration: '75 min', status: 'confirmed' },
        { time: '1:00 PM', patient: 'Jessica Kim', type: '60-Min Float', duration: '60 min', status: 'confirmed' },
        { time: '2:30 PM', patient: 'Marcus Hall', type: 'Infrared Sauna', duration: '45 min', status: 'pending' },
        { time: '4:00 PM', patient: 'Rachel Green', type: 'Couples Float', duration: '90 min', status: 'confirmed' },
      ],
      billingCodes: [
        { code: 'FLT60', desc: '60-Minute Float Session', amount: 79, verified: true },
        { code: 'FLT90', desc: '90-Minute Float Session', amount: 99, verified: true },
        { code: 'SAUNA', desc: 'Infrared Sauna Session', amount: 45, verified: true },
      ],
      soapNote: {
        subjective: 'Client reports feeling relaxed and refreshed after float session.',
        objective: 'Session completed without issues. Tank temperature and salinity within optimal range.',
        assessment: 'Client had positive experience. Recommended for continued sessions.',
        plan: 'Schedule follow-up session. Consider membership upgrade.',
      }
    }
  }
}

function DemoApp() {
  const [practiceType, setPracticeType] = useState<PracticeType>('chiropractic')
  const [currentView, setCurrentView] = useState<DemoView>('dashboard')
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>('provider')
  const [staffRole, setStaffRole] = useState<StaffRole>('owner')
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  
  const practiceData = getPracticeData(practiceType)
  const [selectedPatient, setSelectedPatient] = useState(practiceData.samplePatients[0])
  const [soapApproved, setSoapApproved] = useState(false)
  const [claimSubmitted, setClaimSubmitted] = useState(false)

  const roleInfo = getRoleInfo(staffRole)
  const navItems = getRoleNavigation(staffRole)

    const handlePracticeTypeChange = (newType: PracticeType) => {
      setPracticeType(newType)
      const newData = getPracticeData(newType)
      setSelectedPatient(newData.samplePatients[0])
      setSoapApproved(false)
      setClaimSubmitted(false)
    }

  const handleRoleChange = (newRole: StaffRole) => {
    setStaffRole(newRole)
    setCurrentView('dashboard')
    setShowRoleDropdown(false)
  }

  // If patient role, render patient portal
  if (userRole === 'patient') {
    return (
      <PatientPortal 
        practiceData={practiceData}
        onSwitchToProvider={() => setUserRole('provider')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
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
            
                        {/* Practice Type Selector */}
                        <div className="flex items-center gap-3 ml-6 pl-6 border-l border-slate-200">
                          <select
                            value={practiceType}
                            onChange={(e) => handlePracticeTypeChange(e.target.value as PracticeType)}
                            className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                          >
                            <option value="chiropractic">Chiropractic</option>
                            <option value="physical-therapy">Physical Therapy</option>
                            <option value="float-spa">Float Spa / Wellness</option>
                          </select>
                        </div>
          </div>
                    <div className="flex items-center gap-4">
                      {/* Switch to Patient Portal Button */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setUserRole('patient')}
                        className="text-teal-600 border-teal-300 hover:bg-teal-50"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Patient Portal
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-600">
                        <Bell className="w-4 h-4 mr-2" />
                        <Badge className="bg-red-500 text-white text-xs">3</Badge>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-600">
                        <Settings className="w-4 h-4" />
                      </Button>
            {/* Role Selector Dropdown */}
            <div className="relative pl-4 border-l border-slate-200">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-2 py-1 transition-colors"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={`bg-gradient-to-br ${practiceData.practiceColor} text-white text-sm`}>
                    {roleInfo.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">{roleInfo.name}</p>
                  <p className="text-xs text-slate-500">{roleInfo.title}</p>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showRoleDropdown ? 'rotate-90' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {showRoleDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Switch Account (Demo)</p>
                  {[
                    { role: 'owner' as StaffRole, name: 'Dr. Jamie Smith', title: 'Owner/Admin', initials: 'JS' },
                    { role: 'doctor' as StaffRole, name: 'Dr. Sarah Chen', title: 'Chiropractor', initials: 'SC' },
                    { role: 'front-desk' as StaffRole, name: 'Emily Rodriguez', title: 'Front Desk', initials: 'ER' },
                  ].map((item) => (
                    <button
                      key={item.role}
                      onClick={() => handleRoleChange(item.role)}
                      className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors ${staffRole === item.role ? 'bg-teal-50' : ''}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={`${staffRole === item.role ? `bg-gradient-to-br ${practiceData.practiceColor}` : 'bg-slate-200'} text-${staffRole === item.role ? 'white' : 'slate-600'} text-sm`}>
                          {item.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium text-slate-700">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.title}</p>
                      </div>
                      {staffRole === item.role && <Check className="w-4 h-4 text-teal-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] p-4">
          {/* Role Badge */}
          <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${practiceData.practiceColor} text-white`}>
            <p className="text-xs opacity-80">Logged in as</p>
            <p className="font-semibold">{roleInfo.title}</p>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const iconMap: Record<string, typeof BarChart3> = {
                'BarChart3': BarChart3,
                'Calendar': Calendar,
                'Users': Users,
                'DollarSign': DollarSign,
                'MessageSquare': MessageSquare,
                'TrendingUp': TrendingUp,
                'Shield': Shield,
                'Settings': Settings,
              }
              const Icon = iconMap[item.icon] || BarChart3
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as DemoView)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? `bg-gradient-to-r ${practiceData.practiceColor} text-white font-medium`
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              )
            })}
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
          {currentView === 'patients' && (
            <PatientsListView 
              practiceType={practiceType}
              practiceData={practiceData}
              onSelectPatient={(patient) => {
                setSelectedPatient(patient)
                setCurrentView('patient')
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
          {currentView === 'staff-management' && (
            <StaffManagementView practiceData={practiceData} />
          )}
          {currentView === 'practice-settings' && (
            <PracticeSettingsView practiceData={practiceData} />
          )}

                            </main>
      </div>

      {/* Floating Ask Auvora Button - Enhanced Style */}
      {!showAIAssistant && (
        <button
          onClick={() => setShowAIAssistant(true)}
          className={`fixed bottom-6 right-6 h-14 px-5 rounded-full shadow-lg flex items-center gap-3 transition-all duration-300 z-50 bg-gradient-to-r ${practiceData.practiceColor} hover:shadow-2xl hover:scale-105 group`}
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="text-white font-semibold text-sm">Ask Auvora</span>
          <div className="bg-white/20 px-2 py-0.5 rounded-full">
            <span className="text-white text-xs font-medium">AI</span>
          </div>
        </button>
      )}

      {/* AI Assistant Panel - Floating */}
      {showAIAssistant && (
        <AIAssistantPanel 
          practiceType={practiceType}
          practiceData={practiceData}
          onClose={() => setShowAIAssistant(false)}
          onNavigate={setCurrentView}
        />
      )}
    </div>
  )
}

// Daily Aspirations data - wellness-focused positive affirmations
const dailyAspirations = [
  { quote: "Every patient you help today is a life you're changing for the better.", author: "Wellness Wisdom" },
  { quote: "Healing is not just about the body—it's about restoring hope and vitality to every person you touch.", author: "Healthcare Philosophy" },
  { quote: "Your hands have the power to relieve pain and restore movement. Use that gift with intention.", author: "Chiropractic Insight" },
  { quote: "The greatest wealth is health. Today, you help others build that wealth.", author: "Virgil" },
  { quote: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { quote: "Every adjustment, every treatment, every conversation matters. You are making a difference.", author: "Wellness Wisdom" },
  { quote: "Health is a state of complete harmony of the body, mind, and spirit.", author: "B.K.S. Iyengar" },
  { quote: "The doctor of the future will give no medicine, but will interest patients in the care of the human frame.", author: "Thomas Edison" },
  { quote: "Your positive energy and expertise create ripples of wellness in your community.", author: "Healthcare Philosophy" },
  { quote: "Movement is medicine. Today, you prescribe the best kind.", author: "Wellness Wisdom" },
  { quote: "Wellness is not a destination—it's a daily practice. You guide that journey.", author: "Healthcare Philosophy" },
  { quote: "The body has an incredible ability to heal itself. You help unlock that potential.", author: "Chiropractic Insight" },
  { quote: "A healthy outside starts from the inside.", author: "Robert Urich" },
  { quote: "Your dedication to patient care is the foundation of a healthier community.", author: "Wellness Wisdom" },
  { quote: "Prevention is better than cure. Every wellness visit is an investment in someone's future.", author: "Healthcare Philosophy" },
  { quote: "The spine is the lifeline. You are the guardian of that vital pathway.", author: "Chiropractic Insight" },
  { quote: "Happiness is the highest form of health.", author: "Dalai Lama" },
  { quote: "Your expertise transforms pain into possibility and limitation into liberation.", author: "Wellness Wisdom" },
  { quote: "Health is not valued till sickness comes. You help people value it every day.", author: "Thomas Fuller" },
  { quote: "Every patient interaction is an opportunity to inspire lasting wellness habits.", author: "Healthcare Philosophy" },
  { quote: "The natural healing force within each of us is the greatest force in getting well.", author: "Hippocrates" },
  { quote: "Your work today plants seeds of health that will bloom for years to come.", author: "Wellness Wisdom" },
  { quote: "Physical fitness is the first requisite of happiness. You help people achieve both.", author: "Joseph Pilates" },
  { quote: "Caring for the body is caring for the soul. Your work touches both.", author: "Healthcare Philosophy" },
  { quote: "An ounce of prevention is worth a pound of cure. Your guidance is priceless.", author: "Benjamin Franklin" },
  { quote: "You don't just treat symptoms—you restore quality of life.", author: "Chiropractic Insight" },
  { quote: "Health is the crown on the well person's head that only the ill person can see.", author: "Robin Sharma" },
  { quote: "Your compassion and skill combine to create healing that goes beyond the physical.", author: "Wellness Wisdom" },
  { quote: "The groundwork for all happiness is good health.", author: "Leigh Hunt" },
  { quote: "Today is another opportunity to help someone live their best, pain-free life.", author: "Healthcare Philosophy" },
  { quote: "True healthcare is about empowering patients to take control of their own wellness.", author: "Wellness Wisdom" },
]

function getDailyAspirationIndex(): number {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 0)
  const diff = today.getTime() - startOfYear.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)
  return dayOfYear % dailyAspirations.length
}

function DailyAspiration({ practiceColor }: { practiceColor: string }) {
  const aspirationIndex = getDailyAspirationIndex()
  const todaysAspiration = dailyAspirations[aspirationIndex]

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`p-3 bg-gradient-to-br ${practiceColor} rounded-full`}>
            <Star className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-amber-900 mb-2">Daily Aspiration</h3>
            <p className="text-slate-700 italic text-base leading-relaxed">"{todaysAspiration.quote}"</p>
            <p className="text-amber-600 font-medium mt-2 text-sm">— {todaysAspiration.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

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

      {/* Daily Aspiration */}
      <DailyAspiration practiceColor={practiceData.practiceColor} />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Today\'s Appointments', value: '5', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', view: 'scheduling' as DemoView },
                { label: 'Pending Claims', value: '3', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', view: 'billing' as DemoView },
                { label: 'Unread Messages', value: '7', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50', view: 'communication' as DemoView },
                { label: 'AI Suggestions', value: '4', icon: Sparkles, color: 'text-orange-600', bg: 'bg-orange-50', view: 'analytics' as DemoView },
              ].map((stat, i) => (
                <Card 
                  key={i} 
                  className="cursor-pointer hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
                  onClick={() => onNavigate(stat.view)}
                >
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
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day')
  const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
  
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekDates = ['Feb 3', 'Feb 4', 'Feb 5', 'Feb 6', 'Feb 7', 'Feb 8', 'Feb 9']
  
  const weeklyAppointments: Record<string, { time: string; patient: string; type: string }[]> = {
    'Mon': [
      { time: '9:00 AM', patient: 'John Doe', type: 'New Patient' },
      { time: '11:00 AM', patient: 'Maria Lopez', type: 'Adjustment' },
      { time: '2:00 PM', patient: 'Lisa Patel', type: 'Telehealth' },
    ],
    'Tue': [
      { time: '8:00 AM', patient: 'Mark Chen', type: 'Adjustment' },
      { time: '10:00 AM', patient: 'Brian Evans', type: 'Follow-up' },
      { time: '3:00 PM', patient: 'Sarah Kim', type: 'New Patient' },
    ],
    'Wed': [
      { time: '9:00 AM', patient: 'John Doe', type: 'Follow-up' },
      { time: '1:00 PM', patient: 'Maria Lopez', type: 'Adjustment' },
    ],
    'Thu': [
      { time: '10:00 AM', patient: 'Lisa Patel', type: 'Adjustment' },
      { time: '2:00 PM', patient: 'Mark Chen', type: 'Adjustment' },
      { time: '4:00 PM', patient: 'Brian Evans', type: 'Adjustment' },
    ],
    'Fri': [
      { time: '8:00 AM', patient: 'Sarah Kim', type: 'Follow-up' },
      { time: '11:00 AM', patient: 'John Doe', type: 'Adjustment' },
      { time: '3:00 PM', patient: 'Maria Lopez', type: 'Adjustment' },
    ],
    'Sat': [],
    'Sun': [],
  }

  const monthDays = Array.from({ length: 28 }, (_, i) => i + 1)
  const monthAppointmentCounts: Record<number, number> = {
    3: 5, 4: 3, 5: 4, 6: 6, 7: 2, 10: 4, 11: 5, 12: 3, 13: 4, 14: 2,
    17: 6, 18: 4, 19: 5, 20: 3, 21: 2, 24: 4, 25: 5, 26: 3, 27: 4, 28: 2
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI-Powered Scheduling</h1>
          <p className="text-slate-500">Drag-and-drop calendar with AI suggestions to fill gaps and reduce no-shows</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button 
              onClick={() => setViewMode('day')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'day' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              Day
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={`px-3 py-2 text-sm font-medium transition-colors border-l border-slate-200 ${viewMode === 'week' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setViewMode('month')}
              className={`px-3 py-2 text-sm font-medium transition-colors border-l border-slate-200 ${viewMode === 'month' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              Month
            </button>
          </div>
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

      {/* Day View */}
      {viewMode === 'day' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today - February 3, 2026</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
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
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Week of February 3 - 9, 2026</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, index) => (
                <div key={day} className="text-center">
                  <div className="font-medium text-slate-900">{day}</div>
                  <div className="text-xs text-slate-500 mb-2">{weekDates[index]}</div>
                  <div className={`min-h-[300px] rounded-lg p-2 ${day === 'Sat' || day === 'Sun' ? 'bg-slate-100' : 'bg-slate-50'}`}>
                    {weeklyAppointments[day]?.map((apt, i) => (
                      <div 
                        key={i}
                        onClick={() => onSelectPatient(apt.patient)}
                        className="mb-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:shadow-md transition-all text-left"
                      >
                        <p className="text-xs text-slate-500">{apt.time}</p>
                        <p className="text-sm font-medium text-slate-900 truncate">{apt.patient}</p>
                        <p className="text-xs text-slate-500 truncate">{apt.type}</p>
                      </div>
                    ))}
                    {(day === 'Sat' || day === 'Sun') && (
                      <p className="text-xs text-slate-400 mt-4">Closed</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">February 2026</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center font-medium text-slate-500 text-sm py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map(day => {
                const appointmentCount = monthAppointmentCounts[day] || 0
                const isWeekend = (day % 7 === 0) || (day % 7 === 6)
                const isToday = day === 3
                
                return (
                  <div 
                    key={day}
                    className={`min-h-[80px] rounded-lg p-2 border transition-all cursor-pointer hover:shadow-md ${
                      isToday 
                        ? 'border-teal-500 bg-teal-50' 
                        : isWeekend 
                          ? 'border-slate-200 bg-slate-100' 
                          : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className={`text-sm font-medium ${isToday ? 'text-teal-700' : 'text-slate-700'}`}>
                      {day}
                    </div>
                    {appointmentCount > 0 && (
                      <div className={`mt-1 text-xs px-2 py-1 rounded-full text-center ${
                        appointmentCount >= 5 
                          ? 'bg-red-100 text-red-700' 
                          : appointmentCount >= 3 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-green-100 text-green-700'
                      }`}>
                        {appointmentCount} appts
                      </div>
                    )}
                    {isWeekend && appointmentCount === 0 && (
                      <p className="text-xs text-slate-400 mt-1">Closed</p>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
                <span>Light (1-2)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300"></div>
                <span>Moderate (3-4)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></div>
                <span>Busy (5+)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function PatientsListView({ 
  practiceData,
  onSelectPatient
}: { 
  practiceType: PracticeType
  practiceData: ReturnType<typeof getPracticeData>
  onSelectPatient: (patient: typeof practiceData.samplePatients[0]) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  
  const allPatients = [
    { id: 1, name: 'John Doe', phone: '(555) 123-4567', email: 'john.doe@email.com', lastVisit: 'Feb 3, 2026', nextAppt: 'Feb 10, 2026', balance: 0, status: 'active', visits: 12, condition: 'Lower back pain' },
    { id: 2, name: 'Maria Lopez', phone: '(555) 234-5678', email: 'maria.lopez@email.com', lastVisit: 'Jan 28, 2026', nextAppt: 'Feb 4, 2026', balance: 75, status: 'active', visits: 8, condition: 'Neck pain' },
    { id: 3, name: 'Mark Chen', phone: '(555) 345-6789', email: 'mark.chen@email.com', lastVisit: 'Feb 1, 2026', nextAppt: 'Feb 8, 2026', balance: 0, status: 'active', visits: 24, condition: 'Wellness care' },
    { id: 4, name: 'Lisa Patel', phone: '(555) 456-7890', email: 'lisa.patel@email.com', lastVisit: 'Jan 25, 2026', nextAppt: 'Feb 5, 2026', balance: 150, status: 'active', visits: 6, condition: 'Sciatica' },
    { id: 5, name: 'Brian Evans', phone: '(555) 567-8901', email: 'brian.evans@email.com', lastVisit: 'Dec 15, 2025', nextAppt: '-', balance: 0, status: 'inactive', visits: 3, condition: 'Sports injury' },
    { id: 6, name: 'Sarah Kim', phone: '(555) 678-9012', email: 'sarah.kim@email.com', lastVisit: 'Feb 2, 2026', nextAppt: 'Feb 9, 2026', balance: 0, status: 'active', visits: 15, condition: 'Headaches' },
    { id: 7, name: 'David Wilson', phone: '(555) 789-0123', email: 'david.wilson@email.com', lastVisit: 'Jan 20, 2026', nextAppt: 'Feb 6, 2026', balance: 225, status: 'active', visits: 4, condition: 'Shoulder pain' },
    { id: 8, name: 'Jennifer Lee', phone: '(555) 890-1234', email: 'jennifer.lee@email.com', lastVisit: 'Nov 10, 2025', nextAppt: '-', balance: 50, status: 'inactive', visits: 7, condition: 'Hip pain' },
    { id: 9, name: 'Michael Brown', phone: '(555) 901-2345', email: 'michael.brown@email.com', lastVisit: 'Feb 3, 2026', nextAppt: 'Feb 17, 2026', balance: 0, status: 'active', visits: 20, condition: 'Maintenance' },
    { id: 10, name: 'Emily Davis', phone: '(555) 012-3456', email: 'emily.davis@email.com', lastVisit: 'Jan 30, 2026', nextAppt: 'Feb 13, 2026', balance: 0, status: 'active', visits: 11, condition: 'Posture correction' },
  ]

  const filteredPatients = allPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Directory</h1>
          <p className="text-slate-500">Search and manage all patient accounts</p>
        </div>
        <Button className={`bg-gradient-to-r ${practiceData.practiceColor} text-white`}>
          <Users className="w-4 h-4 mr-2" /> Add New Patient
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Users className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                All ({allPatients.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'active' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Active ({allPatients.filter(p => p.status === 'active').length})
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'inactive' ? 'bg-yellow-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Inactive ({allPatients.filter(p => p.status === 'inactive').length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Patient</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Condition</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Last Visit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Next Appt</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Balance</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => {
                      const matchedPatient = practiceData.samplePatients.find(p => p.name === patient.name) || practiceData.samplePatients[0]
                      onSelectPatient({ ...matchedPatient, name: patient.name })
                    }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={`bg-gradient-to-r ${practiceData.practiceColor} text-white`}>
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{patient.name}</p>
                          <p className="text-xs text-slate-500">{patient.visits} visits</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-slate-900">{patient.phone}</p>
                      <p className="text-xs text-slate-500">{patient.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-slate-700">{patient.condition}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-slate-700">{patient.lastVisit}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className={`text-sm ${patient.nextAppt === '-' ? 'text-slate-400' : 'text-slate-700'}`}>
                        {patient.nextAppt}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className={`text-sm font-medium ${patient.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${patient.balance.toFixed(2)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={patient.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {patient.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            const matchedPatient = practiceData.samplePatients.find(p => p.name === patient.name) || practiceData.samplePatients[0]
                            onSelectPatient({ ...matchedPatient, name: patient.name })
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No patients found matching your search.</p>
            </div>
          )}
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
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [voiceGeneratedSOAP, setVoiceGeneratedSOAP] = useState<{
    subjective: string
    objective: string
    assessment: string
    plan: string
    diagnosis_codes: string[]
    procedure_codes: string[]
  } | null>(null)
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [recordingError, setRecordingError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      setRecordingError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
      setRecordingError('Could not access microphone. Please allow microphone access and try again.')
    }
  }

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return

    return new Promise<Blob>((resolve) => {
      mediaRecorderRef.current!.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        resolve(audioBlob)
      }
      mediaRecorderRef.current!.stop()
      mediaRecorderRef.current!.stream.getTracks().forEach(track => track.stop())
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setIsRecording(false)
    })
  }

  const handleStopAndProcess = async () => {
    setIsProcessing(true)
    try {
      const audioBlob = await stopRecording()
      
      if (!audioBlob) {
        setRecordingError('No audio recorded. Please try again.')
        setIsProcessing(false)
        return
      }
      
      // Create form data for the API
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('patient_id', `pat_${patient.id.toString().padStart(3, '0')}`)
      formData.append('practice_type', practiceType)

      // Call the combined transcribe and generate SOAP endpoint
      const response = await fetch(`${API_URL}/api/voice/transcribe-and-generate-soap`, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success && result.soap_note) {
        setTranscript(result.transcript)
        setVoiceGeneratedSOAP(result.soap_note)
        setShowVoiceModal(true)
      } else {
        setRecordingError(result.error || 'Failed to process recording')
      }
    } catch (error) {
      console.error('Error processing recording:', error)
      setRecordingError('Failed to process recording. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const useVoiceGeneratedSOAP = () => {
    // This would update the SOAP note in the main view
    // For now, we'll just close the modal and show it was applied
    setShowVoiceModal(false)
    onApproveSOAP()
  }

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

      {/* Voice Recording Card */}
      <Card className={`border-2 ${isRecording ? 'border-red-400 bg-red-50' : 'border-indigo-200 bg-indigo-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-indigo-500'}`}>
                {isRecording ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {isRecording ? 'Recording Session...' : isProcessing ? 'Processing...' : 'Voice-to-SOAP Notes'}
                </h3>
                <p className="text-sm text-slate-600">
                  {isRecording 
                    ? `Recording: ${formatTime(recordingTime)} - Click Stop to process`
                    : isProcessing 
                    ? 'Transcribing audio and generating SOAP note...'
                    : 'Record your session and AI will generate SOAP notes automatically'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isRecording ? (
                <Button 
                  onClick={handleStopAndProcess}
                  className="bg-red-500 hover:bg-red-600 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 mr-2" /> Stop & Generate SOAP
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={startRecording}
                  className={`bg-gradient-to-r ${practiceData.practiceColor} text-white`}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" /> Record Session
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          {recordingError && (
            <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {recordingError}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Generated SOAP Modal */}
      {showVoiceModal && voiceGeneratedSOAP && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${practiceData.practiceColor} flex items-center justify-center`}>
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">AI-Generated SOAP Note</h2>
                    <p className="text-sm text-slate-500">Generated from voice recording</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowVoiceModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Transcript Section */}
              {transcript && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Session Transcript
                  </h4>
                  <p className="text-sm text-slate-600 italic">{transcript}</p>
                </div>
              )}

              {/* SOAP Note Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Subjective</h4>
                  <p className="text-sm text-slate-700">{voiceGeneratedSOAP.subjective}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Objective</h4>
                  <p className="text-sm text-slate-700">{voiceGeneratedSOAP.objective}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Assessment</h4>
                  <p className="text-sm text-slate-700">{voiceGeneratedSOAP.assessment}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Plan</h4>
                  <p className="text-sm text-slate-700">{voiceGeneratedSOAP.plan}</p>
                </div>
              </div>

              {/* Codes */}
              <div className="flex gap-4">
                <div className="flex-1 p-3 bg-slate-50 rounded-lg">
                  <h5 className="text-sm font-medium text-slate-700 mb-2">Diagnosis Codes (ICD-10)</h5>
                  <div className="flex flex-wrap gap-2">
                    {voiceGeneratedSOAP.diagnosis_codes.map((code, i) => (
                      <Badge key={i} variant="outline" className="bg-white">{code}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex-1 p-3 bg-slate-50 rounded-lg">
                  <h5 className="text-sm font-medium text-slate-700 mb-2">Procedure Codes (CPT)</h5>
                  <div className="flex flex-wrap gap-2">
                    {voiceGeneratedSOAP.procedure_codes.map((code, i) => (
                      <Badge key={i} variant="outline" className="bg-white">{code}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowVoiceModal(false)}>
                Edit Note
              </Button>
              <Button 
                className={`bg-gradient-to-r ${practiceData.practiceColor} text-white`}
                onClick={useVoiceGeneratedSOAP}
              >
                <Check className="w-4 h-4 mr-2" /> Approve & Sign
              </Button>
            </div>
          </div>
        </div>
      )}

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

      {/* Documents & Forms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-indigo-600" />
                Documents & Forms
              </div>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" /> Upload
              </Button>
            </CardTitle>
            <CardDescription>Patient intake forms, consent documents, and records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patient.intakeComplete ? (
                <>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <File className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Patient Intake Form</p>
                        <p className="text-sm text-slate-500">Completed Nov 8, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <File className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">HIPAA Consent Form</p>
                        <p className="text-sm text-slate-500">Signed Nov 8, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <File className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Insurance Information</p>
                        <p className="text-sm text-slate-500">Updated Nov 15, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  {practiceType === 'physical-therapy' && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <File className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Physician Referral</p>
                          <p className="text-sm text-slate-500">Received Nov 5, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 mb-3">No documents uploaded yet</p>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" /> Upload Documents
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Imaging Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-indigo-600" />
                Imaging & Diagnostics
              </div>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" /> Upload
              </Button>
            </CardTitle>
            <CardDescription>X-rays, MRIs, CT scans, and other diagnostic images</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patient.status !== 'New Patient' ? (
                <>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden">
                        <Image className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {practiceType === 'chiropractic' ? 'Lumbar X-Ray (AP/Lateral)' : 'Knee MRI'}
                        </p>
                        <p className="text-sm text-slate-500">Nov 8, 2024</p>
                        <Badge className="mt-1 bg-blue-100 text-blue-700 text-xs">
                          {practiceType === 'chiropractic' ? '2 images' : '24 slices'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  {practiceType === 'chiropractic' && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden">
                          <Image className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Cervical X-Ray (Lateral)</p>
                          <p className="text-sm text-slate-500">Nov 8, 2024</p>
                          <Badge className="mt-1 bg-blue-100 text-blue-700 text-xs">1 image</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  )}
                  {practiceType === 'physical-therapy' && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden">
                          <Image className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Post-Op X-Ray</p>
                          <p className="text-sm text-slate-500">Oct 25, 2024</p>
                          <Badge className="mt-1 bg-green-100 text-green-700 text-xs">Surgical clearance</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 mb-3">No imaging files uploaded yet</p>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" /> Upload Images
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
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
  onClose,
  onNavigate
}: {
  practiceType: PracticeType
  practiceData: ReturnType<typeof getPracticeData>
  onClose: () => void
  onNavigate: (view: DemoView) => void
}) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: `Hi! I'm Auvora, your AI Business Assistant for ${practiceData.practiceName}. I can answer any questions about your practice - scheduling, billing, patients, revenue, compliance, and more. What would you like to know?`
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([])

  const callAIChat = async (message: string, currentHistory: {role: string, content: string}[]): Promise<string> => {
    try {
      // Include the user's message in the history we send to the API
      const updatedHistory = [
        ...currentHistory,
        { role: 'user', content: message }
      ]
      
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversation_history: updatedHistory
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }
      
      const data = await response.json()
      
      // Update conversation history with both user message and AI response
      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant', content: data.response }
      ])
      
      return data.response
    } catch (error) {
      console.error('AI chat error:', error)
      // Fallback to local response if API fails
      return getFallbackResponse(message)
    }
  }

  const getFallbackResponse = (question: string): string => {
    const q = question.toLowerCase()
    
    if (q.includes('revenue')|| q.includes('money') || q.includes('income') || q.includes('earnings')) {
      return `Based on your practice data, ${practiceData.practiceName} has generated $47,850 in revenue this month, which is 12% higher than last month. Your average revenue per patient visit is $${practiceType === 'chiropractic' ? '85' : '95'}. I've identified 12 patients due for ${practiceType === 'chiropractic' ? 'wellness visits' : 're-evaluation'} representing $1,440 in potential additional revenue. Would you like me to send them appointment reminders?`
    }
    if (q.includes('appointment') || q.includes('schedule') || q.includes('today') || q.includes('calendar')) {
      return `You have 5 appointments scheduled for today:\n\n• 9:00 AM - ${practiceData.todayAppointments[0].patient} (${practiceData.todayAppointments[0].type})\n• 10:30 AM - ${practiceData.todayAppointments[1].patient} (${practiceData.todayAppointments[1].type})\n• 11:00 AM - ${practiceData.todayAppointments[2].patient} (${practiceData.todayAppointments[2].type})\n• 2:00 PM - ${practiceData.todayAppointments[3].patient} (${practiceData.todayAppointments[3].type})\n• 3:30 PM - ${practiceData.todayAppointments[4].patient} (${practiceData.todayAppointments[4].type})\n\nI noticed a 1-hour gap at 1:00 PM. Would you like me to auto-fill it with a patient who's overdue?`
    }
    if (q.includes('patient') || q.includes('how many')) {
      return `${practiceData.practiceName} currently has 247 active patients. This month you've seen 89 patients across 156 visits. Your patient retention rate is 94%, which is excellent! 5 patients are flagged for follow-up: ${practiceData.samplePatients.map(p => p.name).join(', ')}. Would you like me to send them personalized outreach?`
    }
    if (q.includes('claim') || q.includes('billing') || q.includes('insurance') || q.includes('denied')) {
      return `You have 3 pending claims totaling $2,450. 1 claim for ${practiceData.samplePatients[1].name} was denied due to a coding issue - the wrong modifier was used. I can help you correct and resubmit it. Your claim acceptance rate is 96%, and average days to payment is 18 days. Would you like me to review the denied claim?`
    }
    if (q.includes('help') || q.includes('what can you do') || q.includes('capabilities')) {
      return `I can help you with:\n\n📊 **Business Analytics** - Revenue, patient counts, trends\n📅 **Scheduling** - Optimize calendar, fill gaps, reduce no-shows\n💰 **Billing** - Claims status, denials, coding assistance\n👥 **Patients** - Profiles, follow-ups, reactivation\n📧 **Communication** - Draft messages, campaigns, reminders\n✅ **Compliance** - HIPAA status, audits, security\n📈 **Growth** - Marketing, new patients, referrals\n\nJust ask me anything about your practice!`
    }
    
    return `Great question! Based on ${practiceData.practiceName}'s data, I can provide detailed insights on that. Your practice is performing well with 247 active patients, $47,850 monthly revenue, and a 94% retention rate. Is there a specific aspect you'd like me to dive deeper into - scheduling, billing, patient care, or growth opportunities?`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    
    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      role: 'user',
      content: inputValue
    }
    setChatMessages(prev => [...prev, userMessage])
    const messageToSend = inputValue
    // Capture current history before async call to avoid stale closure
    const currentHistory = [...conversationHistory]
    setInputValue('')
    setIsTyping(true)
    
    const aiResponseText = await callAIChat(messageToSend, currentHistory)
    
    const aiResponse: ChatMessage = {
      id: chatMessages.length + 2,
      role: 'assistant',
      content: aiResponseText
    }
    setChatMessages(prev => [...prev, aiResponse])
    setIsTyping(false)
  }

  const handleQuickAction = async (action: string) => {
    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      role: 'user',
      content: action
    }
    setChatMessages(prev => [...prev, userMessage])
    // Capture current history before async call to avoid stale closure
    const currentHistory = [...conversationHistory]
    setIsTyping(true)
    
    const aiResponseText = await callAIChat(action, currentHistory)
    
    const aiResponse: ChatMessage = {
      id: chatMessages.length + 2,
      role: 'assistant',
      content: aiResponseText
    }
    setChatMessages(prev => [...prev, aiResponse])
    setIsTyping(false)
  }

    return (
      <div className="fixed right-6 bottom-6 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-teal-500">
        <div className={`bg-gradient-to-r ${practiceData.practiceColor} text-white py-3 px-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                Ask Auvora
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">AI Powered</span>
              </h3>
              <p className="text-xs opacity-90">Your AI Business & Sales Assistant</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8 p-0">
            <X className="w-5 h-5" />
          </Button>
        </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Chat Messages */}
        {chatMessages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {message.role === 'assistant' && (
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${practiceData.practiceColor} flex items-center justify-center flex-shrink-0`}>
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`flex-1 rounded-lg p-3 ${message.role === 'user' ? 'bg-indigo-600 text-white ml-8' : 'bg-slate-100'}`}>
              <p className={`text-sm whitespace-pre-line ${message.role === 'user' ? 'text-white' : 'text-slate-700'}`}>
                {message.content}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${practiceData.practiceColor} flex items-center justify-center flex-shrink-0`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-100 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions - only show if few messages */}
        {chatMessages.length <= 2 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase">Quick Questions</p>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-3"
              onClick={() => handleQuickAction("What's my revenue this month?")}
            >
              <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">What's my revenue this month?</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-3"
              onClick={() => handleQuickAction("Show me today's schedule")}
            >
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">Show me today's schedule</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-3"
              onClick={() => handleQuickAction("Any billing issues I should know about?")}
            >
              <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">Any billing issues I should know about?</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-3"
              onClick={() => handleQuickAction("How can I grow my practice?")}
            >
              <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">How can I grow my practice?</span>
            </Button>
          </div>
        )}

        {/* Today's Insights */}
        {chatMessages.length <= 2 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase">Today's Insights</p>
            <div 
              className="bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => onNavigate('scheduling')}
            >
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Schedule Gap Detected</p>
                  <p className="text-xs text-blue-700 mt-1">
                    You have a 1-hour gap at 1:00 PM. Click to view schedule.
                  </p>
                </div>
              </div>
            </div>
            <div 
              className="bg-green-50 border border-green-200 rounded-lg p-3 cursor-pointer hover:bg-green-100 transition-colors"
              onClick={() => onNavigate('analytics')}
            >
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-900">Revenue Opportunity</p>
                  <p className="text-xs text-green-700 mt-1">
                    12 patients due for {practiceType === 'chiropractic' ? 'wellness visits' : 're-evaluation'}. Click to view.
                  </p>
                </div>
              </div>
            </div>
            <div 
              className="bg-orange-50 border border-orange-200 rounded-lg p-3 cursor-pointer hover:bg-orange-100 transition-colors"
              onClick={() => onNavigate('billing')}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Claim Attention Needed</p>
                  <p className="text-xs text-orange-700 mt-1">
                    1 claim was denied. Click to review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Auvora anything about your business..." 
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button 
            onClick={handleSendMessage}
            className={`bg-gradient-to-r ${practiceData.practiceColor} text-white`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Staff Management View - Owner/Admin only
function StaffManagementView({ practiceData }: { practiceData: ReturnType<typeof getPracticeData> }) {
  const staffMembers = [
    { id: 1, name: 'Dr. Jamie Smith', role: 'Owner/Admin', email: 'jamie@unwindchiro.com', phone: '(555) 123-4567', status: 'active', hireDate: 'Jan 2020' },
    { id: 2, name: 'Dr. Sarah Chen', role: 'Chiropractor', email: 'sarah@unwindchiro.com', phone: '(555) 234-5678', status: 'active', hireDate: 'Mar 2022' },
    { id: 3, name: 'Emily Rodriguez', role: 'Front Desk', email: 'emily@unwindchiro.com', phone: '(555) 345-6789', status: 'active', hireDate: 'Jun 2023' },
    { id: 4, name: 'Michael Thompson', role: 'Massage Therapist', email: 'michael@unwindchiro.com', phone: '(555) 456-7890', status: 'active', hireDate: 'Sep 2023' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-slate-500">Manage your team members and their access levels</p>
        </div>
        <Button className={`bg-gradient-to-r ${practiceData.practiceColor}`}>
          <Users className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Staff</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Providers</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Support Staff</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Phone className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Today</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>View and manage staff accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={`bg-gradient-to-br ${practiceData.practiceColor} text-white`}>
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-900">{staff.name}</p>
                    <p className="text-sm text-slate-500">{staff.role}</p>
                    <p className="text-xs text-slate-400">{staff.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-700">{staff.status}</Badge>
                    <p className="text-xs text-slate-400 mt-1">Since {staff.hireDate}</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Configure what each role can access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { role: 'Owner/Admin', permissions: ['Full Access', 'Staff Management', 'Financial Reports', 'Practice Settings', 'Compliance'] },
              { role: 'Doctor/Chiropractor', permissions: ['Patient Records', 'SOAP Notes', 'Scheduling', 'Communication', 'Personal Analytics'] },
              { role: 'Front Desk', permissions: ['Scheduling', 'Patient Check-in', 'Billing/Payments', 'Communication'] },
            ].map((item, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-slate-900">{item.role}</p>
                  <Button variant="ghost" size="sm">Edit Permissions</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.permissions.map((perm, j) => (
                    <Badge key={j} variant="outline" className="bg-slate-50">{perm}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Practice Settings View - Owner/Admin only
function PracticeSettingsView({ practiceData }: { practiceData: ReturnType<typeof getPracticeData> }) {
  const [quickbooksConnected, setQuickbooksConnected] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [showQuickBooksPanel, setShowQuickBooksPanel] = useState(false)
  
    // Cancellation Policy Settings
    const [cancellationHours, setCancellationHours] = useState('24')
    const [cancellationFee, setCancellationFee] = useState('50')
    const [cancellationAction, setCancellationAction] = useState<'fee' | 'credit' | 'both'>('fee')
    const [cancellationPolicySaved, setCancellationPolicySaved] = useState(false)
  
    // Business Hours Settings
    const [businessHours, setBusinessHours] = useState<Record<string, { isOpen: boolean, open: string, close: string }>>({
      'Monday': { isOpen: true, open: '08:00', close: '18:00' },
      'Tuesday': { isOpen: true, open: '08:00', close: '18:00' },
      'Wednesday': { isOpen: true, open: '08:00', close: '18:00' },
      'Thursday': { isOpen: true, open: '08:00', close: '18:00' },
      'Friday': { isOpen: true, open: '08:00', close: '18:00' },
      'Saturday': { isOpen: false, open: '09:00', close: '14:00' },
      'Sunday': { isOpen: false, open: '09:00', close: '14:00' },
    })
  
    const updateBusinessHours = (day: string, field: 'isOpen' | 'open' | 'close', value: boolean | string) => {
      setBusinessHours(prev => ({
        ...prev,
        [day]: { ...prev[day], [field]: value }
      }))
    }

  const handleConnectQuickBooks = () => {
    // Simulate OAuth flow
    setTimeout(() => {
      setQuickbooksConnected(true)
      setLastSync(new Date().toLocaleString())
    }, 1500)
  }

    const handleSyncNow = () => {
      setSyncStatus('syncing')
      setTimeout(() => {
        setSyncStatus('success')
        setLastSync(new Date().toLocaleString())
        setTimeout(() => setSyncStatus('idle'), 2000)
      }, 2000)
    }

    const handleSaveCancellationPolicy = () => {
      setCancellationPolicySaved(true)
      setTimeout(() => setCancellationPolicySaved(false), 2000)
    }

    return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Practice Settings</h1>
        <p className="text-slate-500">Configure your practice information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Practice Information</CardTitle>
            <CardDescription>Basic details about your practice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Practice Name</label>
              <input type="text" className="w-full mt-1 p-2 border rounded-lg" defaultValue={practiceData.practiceName} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Address</label>
              <input type="text" className="w-full mt-1 p-2 border rounded-lg" defaultValue="123 Wellness Way, Suite 100" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Phone</label>
                <input type="text" className="w-full mt-1 p-2 border rounded-lg" defaultValue="(555) 123-4567" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input type="text" className="w-full mt-1 p-2 border rounded-lg" defaultValue="info@unwindchiro.com" />
              </div>
            </div>
            <Button className={`bg-gradient-to-r ${practiceData.practiceColor}`}>Save Changes</Button>
          </CardContent>
        </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                    <CardDescription>Set your operating hours for each day of the week</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateBusinessHours(day, 'isOpen', !businessHours[day].isOpen)}
                            className={`w-10 h-5 rounded-full transition-colors relative ${
                              businessHours[day].isOpen ? 'bg-teal-500' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              businessHours[day].isOpen ? 'translate-x-5' : 'translate-x-0.5'
                            }`} />
                          </button>
                          <span className={`text-sm font-medium w-20 ${!businessHours[day].isOpen ? 'text-slate-400' : ''}`}>{day}</span>
                        </div>
                        {businessHours[day].isOpen ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="time" 
                              className="p-1 border rounded text-sm" 
                              value={businessHours[day].open}
                              onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                            />
                            <span className="text-slate-500">to</span>
                            <input 
                              type="time" 
                              className="p-1 border rounded text-sm" 
                              value={businessHours[day].close}
                              onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                            />
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic">Closed</span>
                        )}
                      </div>
                    ))}
                    <Button className={`w-full mt-4 bg-gradient-to-r ${practiceData.practiceColor}`}>Save Hours</Button>
                  </CardContent>
                </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Settings</CardTitle>
            <CardDescription>Configure payment and billing options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Online Payments</p>
                <p className="text-sm text-slate-500">Accept credit cards via Stripe</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Auto-send Invoices</p>
                <p className="text-sm text-slate-500">Email invoices after visits</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Payment Reminders</p>
                <p className="text-sm text-slate-500">Send reminders for overdue balances</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Default Visit Fee</label>
              <input type="text" className="w-full mt-1 p-2 border rounded-lg" defaultValue="$75.00" />
            </div>
          </CardContent>
        </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Configure alerts and reminders</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">Appointment Reminders</p>
                        <p className="text-sm text-slate-500">Send SMS/email reminders to patients</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">New Patient Alerts</p>
                        <p className="text-sm text-slate-500">Notify staff of new patient bookings</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">Daily Summary</p>
                        <p className="text-sm text-slate-500">Email daily schedule summary</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      Cancellation Policy
                    </CardTitle>
                    <CardDescription>Set rules for appointment cancellations and no-shows</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Cancellation Notice Required</label>
                        <p className="text-xs text-slate-500 mb-2">Patients must cancel this many hours before their appointment</p>
                        <select 
                          className="w-full p-2 border rounded-lg bg-white"
                          value={cancellationHours}
                          onChange={(e) => setCancellationHours(e.target.value)}
                        >
                          <option value="12">12 hours</option>
                          <option value="24">24 hours</option>
                          <option value="48">48 hours</option>
                          <option value="72">72 hours (3 days)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">Late Cancellation Fee</label>
                        <p className="text-xs text-slate-500 mb-2">Fee charged for cancellations within the notice period</p>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                          <input 
                            type="number" 
                            className="w-full p-2 pl-7 border rounded-lg" 
                            value={cancellationFee}
                            onChange={(e) => setCancellationFee(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
            
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-3 block">Cancellation Consequence</label>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                          <input 
                            type="radio" 
                            name="cancellation-action" 
                            checked={cancellationAction === 'fee'}
                            onChange={() => setCancellationAction('fee')}
                            className="w-4 h-4 text-teal-600"
                          />
                          <div>
                            <p className="font-medium">Charge Cancellation Fee</p>
                            <p className="text-sm text-slate-500">Patient will be charged ${cancellationFee} for late cancellations</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                          <input 
                            type="radio" 
                            name="cancellation-action" 
                            checked={cancellationAction === 'credit'}
                            onChange={() => setCancellationAction('credit')}
                            className="w-4 h-4 text-teal-600"
                          />
                          <div>
                            <p className="font-medium">Deduct Session Credit</p>
                            <p className="text-sm text-slate-500">Patient loses one session from their package/membership</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                          <input 
                            type="radio" 
                            name="cancellation-action" 
                            checked={cancellationAction === 'both'}
                            onChange={() => setCancellationAction('both')}
                            className="w-4 h-4 text-teal-600"
                          />
                          <div>
                            <p className="font-medium">Patient Choice</p>
                            <p className="text-sm text-slate-500">Patient can choose to pay fee OR lose session credit</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800">Policy Preview</p>
                          <p className="text-sm text-amber-700 mt-1">
                            Patients must cancel at least <strong>{cancellationHours} hours</strong> before their appointment. 
                            Late cancellations or no-shows will result in {
                              cancellationAction === 'fee' ? `a $${cancellationFee} fee` :
                              cancellationAction === 'credit' ? 'loss of one session credit' :
                              `a $${cancellationFee} fee or loss of one session credit (patient's choice)`
                            }.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className={`bg-gradient-to-r ${practiceData.practiceColor}`}
                      onClick={handleSaveCancellationPolicy}
                    >
                      {cancellationPolicySaved ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Policy Saved!
                        </>
                      ) : (
                        'Save Cancellation Policy'
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>Connect with third-party services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-xs text-slate-500">Payment processing</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">Not Connected</Badge>
              </div>
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${quickbooksConnected ? 'border-green-300 bg-green-50' : 'hover:border-green-300'}`}
                onClick={() => setShowQuickBooksPanel(true)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">QuickBooks</p>
                    <p className="text-xs text-slate-500">Accounting</p>
                  </div>
                </div>
                {quickbooksConnected ? (
                  <Badge className="bg-green-100 text-green-700">Connected</Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-700">Not Connected</Badge>
                )}
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Mailchimp</p>
                    <p className="text-xs text-slate-500">Email marketing</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">Not Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QuickBooks Integration Panel */}
      {showQuickBooksPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>QuickBooks Online Integration</CardTitle>
                    <CardDescription>Sync your financial data with QuickBooks</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowQuickBooksPanel(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Connection Status */}
              <div className={`p-4 rounded-lg ${quickbooksConnected ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {quickbooksConnected ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-slate-400" />
                    )}
                    <div>
                      <p className="font-medium">{quickbooksConnected ? 'Connected to QuickBooks Online' : 'Not Connected'}</p>
                      {quickbooksConnected && lastSync && (
                        <p className="text-sm text-slate-500">Last synced: {lastSync}</p>
                      )}
                    </div>
                  </div>
                  {quickbooksConnected ? (
                    <Button variant="outline" size="sm" onClick={() => setQuickbooksConnected(false)}>
                      Disconnect
                    </Button>
                  ) : (
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleConnectQuickBooks}>
                      Connect QuickBooks
                    </Button>
                  )}
                </div>
              </div>

              {quickbooksConnected && (
                <>
                  {/* Sync Options */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Sync Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">Sync Invoices</p>
                          <p className="text-sm text-slate-500">Automatically sync patient invoices to QuickBooks</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">Sync Payments</p>
                          <p className="text-sm text-slate-500">Record payments received in QuickBooks</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">Sync Patients as Customers</p>
                          <p className="text-sm text-slate-500">Create QuickBooks customers from patient records</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">Auto-sync Daily</p>
                          <p className="text-sm text-slate-500">Automatically sync data every night at midnight</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  {/* Manual Sync */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Manual Sync</h3>
                    <div className="flex items-center gap-4">
                      <Button 
                        onClick={handleSyncNow}
                        disabled={syncStatus === 'syncing'}
                        className={`bg-gradient-to-r ${practiceData.practiceColor}`}
                      >
                        {syncStatus === 'syncing' ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Syncing...
                          </>
                        ) : syncStatus === 'success' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Sync Complete!
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync Now
                          </>
                        )}
                      </Button>
                      {lastSync && (
                        <p className="text-sm text-slate-500">Last sync: {lastSync}</p>
                      )}
                    </div>
                  </div>

                  {/* Sync History */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Recent Sync Activity</h3>
                    <div className="space-y-2">
                      {[
                        { action: 'Invoices synced', count: 12, time: '2 hours ago', status: 'success' },
                        { action: 'Payments recorded', count: 8, time: '2 hours ago', status: 'success' },
                        { action: 'New customers created', count: 3, time: '1 day ago', status: 'success' },
                        { action: 'Invoice sync failed', count: 1, time: '3 days ago', status: 'error' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {item.status === 'success' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm">{item.action}</span>
                            <Badge variant="outline">{item.count} items</Badge>
                          </div>
                          <span className="text-xs text-slate-400">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {!quickbooksConnected && (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Connect to QuickBooks Online</h3>
                  <p className="text-slate-500 mb-4 max-w-md mx-auto">
                    Sync your invoices, payments, and patient data with QuickBooks Online for seamless accounting.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleConnectQuickBooks}>
                    Connect QuickBooks
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Patient Portal Component - Redesigned for better user experience
function PatientPortal({
  practiceData,
  onSwitchToProvider
}: {
  practiceData: ReturnType<typeof getPracticeData>
  onSwitchToProvider: () => void
}) {
    const [activeTab, setActiveTab] = useState<'home' | 'appointments' | 'messages' | 'records' | 'billing' | 'profile'>('home')
    const [showMessageCompose, setShowMessageCompose] = useState(false)
    const [messageText, setMessageText] = useState('')
    const [showBookingModal, setShowBookingModal] = useState(false)
  
        // Additional modal states for functional buttons
        const [showRescheduleModal, setShowRescheduleModal] = useState(false)
        const [showCancelModal, setShowCancelModal] = useState(false)
        const [showPaymentModal, setShowPaymentModal] = useState(false)
        const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
        const [showEditProfileModal, setShowEditProfileModal] = useState(false)
        const [showUpdateInsuranceModal, setShowUpdateInsuranceModal] = useState(false)
        const [showRecordViewModal, setShowRecordViewModal] = useState(false)
        const [selectedAppointment, setSelectedAppointment] = useState<{id: number, date: string, time: string, type: string} | null>(null)
        const [selectedRecord, setSelectedRecord] = useState<{id: number, type: string, date: string, description: string} | null>(null)
        const [actionSuccess, setActionSuccess] = useState<string | null>(null)
    
        // Booking modal state for live schedule
        const [bookingStep, setBookingStep] = useState<'type' | 'schedule'>('type')
        const [bookingType, setBookingType] = useState('Adjustment')
        const [bookingProvider, setBookingProvider] = useState('Dr. Jamie Smith')
        const [bookingDate, setBookingDate] = useState('')
        const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
    
        // Provider schedules with available time slots
        const providerSchedules: Record<string, Record<string, { time: string, available: boolean }[]>> = {
          'Dr. Jamie Smith': {
            '2026-02-10': [
              { time: '9:00 AM', available: false },
              { time: '9:30 AM', available: true },
              { time: '10:00 AM', available: false },
              { time: '10:30 AM', available: false },
              { time: '11:00 AM', available: true },
              { time: '11:30 AM', available: true },
              { time: '2:00 PM', available: false },
              { time: '2:30 PM', available: true },
              { time: '3:00 PM', available: true },
              { time: '3:30 PM', available: true },
              { time: '4:00 PM', available: false },
              { time: '4:30 PM', available: true },
            ],
            '2026-02-11': [
              { time: '9:00 AM', available: true },
              { time: '9:30 AM', available: true },
              { time: '10:00 AM', available: true },
              { time: '10:30 AM', available: false },
              { time: '11:00 AM', available: true },
              { time: '11:30 AM', available: false },
              { time: '2:00 PM', available: true },
              { time: '2:30 PM', available: true },
              { time: '3:00 PM', available: false },
              { time: '3:30 PM', available: true },
              { time: '4:00 PM', available: true },
              { time: '4:30 PM', available: true },
            ],
            '2026-02-12': [
              { time: '9:00 AM', available: true },
              { time: '9:30 AM', available: false },
              { time: '10:00 AM', available: true },
              { time: '10:30 AM', available: true },
              { time: '11:00 AM', available: false },
              { time: '11:30 AM', available: true },
              { time: '2:00 PM', available: false },
              { time: '2:30 PM', available: false },
              { time: '3:00 PM', available: true },
              { time: '3:30 PM', available: true },
              { time: '4:00 PM', available: true },
              { time: '4:30 PM', available: false },
            ],
          },
          'Dr. Sarah Chen': {
            '2026-02-10': [
              { time: '9:00 AM', available: true },
              { time: '9:30 AM', available: true },
              { time: '10:00 AM', available: false },
              { time: '10:30 AM', available: true },
              { time: '11:00 AM', available: false },
              { time: '11:30 AM', available: true },
              { time: '2:00 PM', available: true },
              { time: '2:30 PM', available: false },
              { time: '3:00 PM', available: true },
              { time: '3:30 PM', available: false },
              { time: '4:00 PM', available: true },
              { time: '4:30 PM', available: true },
            ],
            '2026-02-11': [
              { time: '9:00 AM', available: false },
              { time: '9:30 AM', available: true },
              { time: '10:00 AM', available: true },
              { time: '10:30 AM', available: true },
              { time: '11:00 AM', available: true },
              { time: '11:30 AM', available: false },
              { time: '2:00 PM', available: false },
              { time: '2:30 PM', available: true },
              { time: '3:00 PM', available: true },
              { time: '3:30 PM', available: true },
              { time: '4:00 PM', available: false },
              { time: '4:30 PM', available: true },
            ],
            '2026-02-12': [
              { time: '9:00 AM', available: true },
              { time: '9:30 AM', available: true },
              { time: '10:00 AM', available: false },
              { time: '10:30 AM', available: false },
              { time: '11:00 AM', available: true },
              { time: '11:30 AM', available: true },
              { time: '2:00 PM', available: true },
              { time: '2:30 PM', available: true },
              { time: '3:00 PM', available: false },
              { time: '3:30 PM', available: true },
              { time: '4:00 PM', available: true },
              { time: '4:30 PM', available: false },
            ],
          },
        }
    
        // Get available dates for the next 7 days
        const getAvailableDates = () => {
          const dates = []
          const today = new Date('2026-02-09')
          for (let i = 1; i <= 7; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() + i)
            const dateStr = date.toISOString().split('T')[0]
            dates.push({
              date: dateStr,
              dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
              dayNum: date.getDate(),
              month: date.toLocaleDateString('en-US', { month: 'short' }),
            })
          }
          return dates
        }
    
        const availableDates = getAvailableDates()
    
        const getTimeSlotsForDate = () => {
          if (!bookingDate || !bookingProvider) return []
          const providerSchedule = providerSchedules[bookingProvider]
          if (!providerSchedule) return []
          return providerSchedule[bookingDate] || []
        }
    
        const resetBookingModal = () => {
          setBookingStep('type')
          setBookingType('Adjustment')
          setBookingProvider('Dr. Jamie Smith')
          setBookingDate('')
          setSelectedTimeSlot(null)
        }

    // Sample patient data
  const patientInfo = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    dob: 'March 15, 1985',
    address: '123 Main Street, Tampa, FL 33601',
    nextAppointment: { date: 'Feb 10, 2026', time: '10:30 AM', type: 'Adjustment', provider: 'Dr. Jamie Smith' },
    balance: 75.00,
    lastVisit: 'Jan 28, 2026',
    memberSince: 'January 2026',
    treatmentProgress: 75
  }

  const upcomingAppointments = [
    { id: 1, date: 'Feb 10, 2026', time: '10:30 AM', type: 'Adjustment', provider: 'Dr. Jamie Smith', status: 'confirmed' },
    { id: 2, date: 'Feb 17, 2026', time: '2:00 PM', type: 'Wellness Visit', provider: 'Dr. Jamie Smith', status: 'confirmed' },
    { id: 3, date: 'Feb 24, 2026', time: '11:00 AM', type: 'Adjustment', provider: 'Dr. Jamie Smith', status: 'pending' },
  ]

  const pastAppointments = [
    { id: 4, date: 'Jan 28, 2026', time: '10:00 AM', type: 'Adjustment', provider: 'Dr. Jamie Smith', notes: 'Lumbar adjustment, feeling better' },
    { id: 5, date: 'Jan 14, 2026', time: '9:30 AM', type: 'Re-exam', provider: 'Dr. Jamie Smith', notes: 'Progress evaluation, ROM improved' },
    { id: 6, date: 'Jan 3, 2026', time: '2:00 PM', type: 'New Patient Exam', provider: 'Dr. Jamie Smith', notes: 'Initial evaluation, treatment plan created' },
  ]

  const messages = [
    { id: 1, from: 'Dr. Jamie Smith', subject: 'Home Exercise Reminder', date: 'Feb 5, 2026', preview: 'Hi John, just a reminder to continue your stretching exercises...', unread: true },
    { id: 2, from: 'Front Desk', subject: 'Appointment Confirmation', date: 'Feb 3, 2026', preview: 'Your appointment on Feb 10 at 10:30 AM has been confirmed...', unread: false },
    { id: 3, from: 'Dr. Jamie Smith', subject: 'Treatment Plan Update', date: 'Jan 28, 2026', preview: 'Based on your progress, I recommend continuing with weekly visits...', unread: false },
  ]

  const healthRecords = [
    { id: 1, type: 'SOAP Note', date: 'Jan 28, 2026', provider: 'Dr. Jamie Smith', description: 'Adjustment visit - Lumbar spine' },
    { id: 2, type: 'X-Ray Report', date: 'Jan 3, 2026', provider: 'Dr. Jamie Smith', description: 'Lumbar spine series' },
    { id: 3, type: 'Treatment Plan', date: 'Jan 3, 2026', provider: 'Dr. Jamie Smith', description: 'Initial treatment plan - 12 visits' },
    { id: 4, type: 'Intake Forms', date: 'Jan 3, 2026', provider: 'System', description: 'Patient intake and health history' },
  ]

  const billingHistory = [
    { id: 1, date: 'Jan 28, 2026', description: 'Office Visit - Adjustment', amount: 75.00, status: 'pending', insurance: 'Submitted to Blue Cross' },
    { id: 2, date: 'Jan 14, 2026', description: 'Office Visit - Re-exam', amount: 125.00, status: 'paid', insurance: 'Blue Cross paid $100' },
    { id: 3, date: 'Jan 3, 2026', description: 'New Patient Exam + X-Rays', amount: 350.00, status: 'paid', insurance: 'Blue Cross paid $280' },
  ]

  const unreadCount = messages.filter(m => m.unread).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Modern Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${practiceData.practiceColor} flex items-center justify-center`}>
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">{practiceData.practiceName}</h1>
                <p className="text-xs text-slate-500">Patient Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('messages')}
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={`bg-gradient-to-br ${practiceData.practiceColor} text-white text-sm`}>JD</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">John</span>
              </button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onSwitchToProvider}
                className="text-slate-500 hover:text-slate-700 text-xs hidden sm:flex"
              >
                Provider View
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto pb-24">
        {/* Home Tab - Redesigned Dashboard */}
        {activeTab === 'home' && (
          <div className="p-4 space-y-6">
            {/* Hero Welcome Section */}
            <div className={`rounded-2xl bg-gradient-to-r ${practiceData.practiceColor} p-6 text-white`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/80 text-sm">Welcome back,</p>
                  <h2 className="text-2xl font-bold mt-1">John Doe</h2>
                  <p className="text-white/80 text-sm mt-2">Your wellness journey is {patientInfo.treatmentProgress}% complete</p>
                  <div className="mt-3 bg-white/20 rounded-full h-2 w-48">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-500" 
                      style={{ width: `${patientInfo.treatmentProgress}%` }}
                    />
                  </div>
                </div>
                <Avatar className="w-16 h-16 border-4 border-white/30">
                  <AvatarFallback className="bg-white/20 text-white text-xl font-bold">JD</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Next Appointment - Prominent Card */}
            {patientInfo.nextAppointment && (
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="flex">
                  <div className={`w-2 bg-gradient-to-b ${practiceData.practiceColor}`} />
                  <CardContent className="flex-1 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-teal-600 uppercase tracking-wide">Next Appointment</p>
                        <p className="text-xl font-bold text-slate-900 mt-1">{patientInfo.nextAppointment.date}</p>
                        <p className="text-slate-600">{patientInfo.nextAppointment.time}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-teal-100 text-teal-700">{patientInfo.nextAppointment.type}</Badge>
                          <span className="text-sm text-slate-500">with {patientInfo.nextAppointment.provider}</span>
                        </div>
                      </div>
                                            <div className="flex flex-col gap-2">
                                              <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="text-xs"
                                                onClick={() => {
                                                  setSelectedAppointment({ id: 1, date: patientInfo.nextAppointment.date, time: patientInfo.nextAppointment.time, type: patientInfo.nextAppointment.type })
                                                  setShowRescheduleModal(true)
                                                }}
                                              >
                                                <Calendar className="w-3 h-3 mr-1" />
                                                Reschedule
                                              </Button>
                                              <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => {
                                                  setSelectedAppointment({ id: 1, date: patientInfo.nextAppointment.date, time: patientInfo.nextAppointment.time, type: patientInfo.nextAppointment.type })
                                                  setShowCancelModal(true)
                                                }}
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            )}

            {/* Quick Actions - Larger, More Accessible */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className={`p-5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-left hover:shadow-lg transition-all hover:scale-[1.02]`}
                >
                  <Calendar className="w-8 h-8 mb-3 opacity-90" />
                  <p className="font-semibold text-lg">Book Appointment</p>
                  <p className="text-sm text-white/80 mt-1">Schedule your next visit</p>
                </button>
                <button 
                  onClick={() => setActiveTab('messages')}
                  className="p-5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white text-left hover:shadow-lg transition-all hover:scale-[1.02] relative"
                >
                  <MessageSquare className="w-8 h-8 mb-3 opacity-90" />
                  <p className="font-semibold text-lg">Messages</p>
                  <p className="text-sm text-white/80 mt-1">Contact your care team</p>
                  {unreadCount > 0 && (
                    <span className="absolute top-4 right-4 w-6 h-6 bg-white text-purple-600 text-sm font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('records')}
                  className="p-5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white text-left hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <FileText className="w-8 h-8 mb-3 opacity-90" />
                  <p className="font-semibold text-lg">Health Records</p>
                  <p className="text-sm text-white/80 mt-1">View your documents</p>
                </button>
                <button 
                  onClick={() => setActiveTab('billing')}
                  className="p-5 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white text-left hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <DollarSign className="w-8 h-8 mb-3 opacity-90" />
                  <p className="font-semibold text-lg">Pay Balance</p>
                  <p className="text-sm text-white/80 mt-1">${patientInfo.balance.toFixed(2)} due</p>
                </button>
              </div>
            </div>

            {/* Recent Messages */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Messages</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('messages')} className="text-teal-600">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                {messages.slice(0, 2).map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${msg.unread ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-50'}`}
                    onClick={() => setActiveTab('messages')}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className={`bg-gradient-to-br ${practiceData.practiceColor} text-white text-sm`}>
                        {msg.from.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900 truncate">{msg.subject}</p>
                        {msg.unread && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-slate-500 truncate">{msg.from} • {msg.date}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Practice Info Card */}
            <Card className="border-0 shadow-md bg-slate-50">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${practiceData.practiceColor} flex items-center justify-center`}>
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Need Help?</p>
                    <p className="text-sm text-slate-500">Call us at (555) 123-4567</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Appointments Tab - Cleaner Layout */}
        {activeTab === 'appointments' && (
          <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">My Appointments</h2>
              <Button className={`bg-gradient-to-r ${practiceData.practiceColor}`} onClick={() => setShowBookingModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Book New
              </Button>
            </div>

            {/* Upcoming Appointments */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Upcoming</h3>
              <div className="space-y-3">
                {upcomingAppointments.map((apt, index) => (
                  <Card key={apt.id} className={`border-0 shadow-md overflow-hidden ${index === 0 ? 'ring-2 ring-teal-500' : ''}`}>
                    <div className="flex">
                      <div className={`w-1.5 ${index === 0 ? 'bg-teal-500' : 'bg-slate-200'}`} />
                      <CardContent className="flex-1 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-slate-900">{apt.date.split(' ')[1].replace(',', '')}</p>
                              <p className="text-xs text-slate-500 uppercase">{apt.date.split(' ')[0]}</p>
                            </div>
                            <div className="h-12 w-px bg-slate-200" />
                            <div>
                              <p className="font-semibold text-slate-900">{apt.type}</p>
                              <p className="text-sm text-slate-500">{apt.time} • {apt.provider}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                              {apt.status}
                            </Badge>
                                                        <div className="flex gap-1">
                                                          <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => {
                                                              setSelectedAppointment({ id: apt.id, date: apt.date, time: apt.time, type: apt.type })
                                                              setShowRescheduleModal(true)
                                                            }}
                                                          >
                                                            <Calendar className="w-4 h-4 text-slate-500" />
                                                          </Button>
                                                          <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => {
                                                              setSelectedAppointment({ id: apt.id, date: apt.date, time: apt.time, type: apt.type })
                                                              setShowCancelModal(true)
                                                            }}
                                                          >
                                                            <X className="w-4 h-4 text-red-500" />
                                                          </Button>
                                                        </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Past Appointments */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Past Visits</h3>
              <div className="space-y-2">
                {pastAppointments.map((apt) => (
                  <Card key={apt.id} className="border-0 shadow-sm bg-slate-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center opacity-60">
                            <p className="text-lg font-bold text-slate-700">{apt.date.split(' ')[1].replace(',', '')}</p>
                            <p className="text-xs text-slate-500 uppercase">{apt.date.split(' ')[0]}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">{apt.type}</p>
                            <p className="text-sm text-slate-500">{apt.notes}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('records')}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab - Modern Chat Style */}
        {activeTab === 'messages' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
              <Button className={`bg-gradient-to-r ${practiceData.practiceColor}`} onClick={() => setShowMessageCompose(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Message
              </Button>
            </div>

            <div className="space-y-2">
              {messages.map((msg) => (
                <Card 
                  key={msg.id} 
                  className={`border-0 shadow-sm cursor-pointer hover:shadow-md transition-all ${msg.unread ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className={`bg-gradient-to-br ${practiceData.practiceColor} text-white`}>
                          {msg.from.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-slate-900">{msg.from}</p>
                          <p className="text-xs text-slate-500">{msg.date}</p>
                        </div>
                        <p className="font-medium text-slate-800">{msg.subject}</p>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{msg.preview}</p>
                      </div>
                      {msg.unread && <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Compose Message Modal */}
            {showMessageCompose && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-bold">New Message</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowMessageCompose(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">To</label>
                      <select className="w-full mt-1 p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                        <option>Dr. Jamie Smith</option>
                        <option>Front Desk</option>
                        <option>Billing Department</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Subject</label>
                      <input type="text" className="w-full mt-1 p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter subject..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Message</label>
                      <textarea 
                        className="w-full mt-1 p-3 border rounded-xl bg-slate-50 h-32 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none" 
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="p-4 border-t bg-slate-50 rounded-b-2xl">
                    <Button className={`w-full bg-gradient-to-r ${practiceData.practiceColor}`}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Health Records Tab - Better Organization */}
        {activeTab === 'records' && (
          <div className="p-4 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Health Records</h2>

            {/* Record Categories */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'SOAP Notes', count: 3, icon: FileText, color: 'blue' },
                { type: 'X-Rays', count: 1, icon: Eye, color: 'purple' },
                { type: 'Treatment Plans', count: 1, icon: TrendingUp, color: 'green' },
                { type: 'Forms', count: 2, icon: FileText, color: 'slate' },
              ].map((cat) => (
                <Card key={cat.type} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 rounded-lg bg-${cat.color}-100 flex items-center justify-center mb-2`}>
                      <cat.icon className={`w-5 h-5 text-${cat.color}-600`} />
                    </div>
                    <p className="font-medium text-slate-900">{cat.type}</p>
                    <p className="text-sm text-slate-500">{cat.count} documents</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* All Records List */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">All Documents</h3>
              <div className="space-y-2">
                {healthRecords.map((record) => (
                  <Card key={record.id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          record.type === 'SOAP Note' ? 'bg-blue-100' :
                          record.type === 'X-Ray Report' ? 'bg-purple-100' :
                          record.type === 'Treatment Plan' ? 'bg-green-100' : 'bg-slate-100'
                        }`}>
                          <FileText className={`w-6 h-6 ${
                            record.type === 'SOAP Note' ? 'text-blue-600' :
                            record.type === 'X-Ray Report' ? 'text-purple-600' :
                            record.type === 'Treatment Plan' ? 'text-green-600' : 'text-slate-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{record.type}</p>
                          <p className="text-sm text-slate-600">{record.description}</p>
                          <p className="text-xs text-slate-400 mt-1">{record.date}</p>
                        </div>
                                                <div className="flex gap-2">
                                                  <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-9 w-9 p-0"
                                                    onClick={() => {
                                                      setSelectedRecord({ id: record.id, type: record.type, date: record.date, description: record.description })
                                                      setShowRecordViewModal(true)
                                                    }}
                                                  >
                                                    <Eye className="w-4 h-4" />
                                                  </Button>
                                                  <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-9 w-9 p-0"
                                                    onClick={() => {
                                                      setActionSuccess('Download started for ' + record.type)
                                                      setTimeout(() => setActionSuccess(null), 2000)
                                                    }}
                                                  >
                                                    <Download className="w-4 h-4" />
                                                  </Button>
                                                </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Request Records */}
            <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
              <CardContent className="p-6 text-center">
                <Download className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">Need a copy of your records?</p>
                <p className="text-sm text-slate-500 mb-4">Request your complete health records</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setActionSuccess('Records request submitted. You will receive an email within 24 hours.')
                    setTimeout(() => setActionSuccess(null), 3000)
                  }}
                >
                  Request Records
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Billing Tab - Cleaner Design */}
        {activeTab === 'billing' && (
          <div className="p-4 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Billing & Payments</h2>

            {/* Balance Card */}
            <Card className={`border-0 shadow-lg overflow-hidden`}>
              <div className={`bg-gradient-to-r ${practiceData.practiceColor} p-6 text-white`}>
                <p className="text-white/80 text-sm">Current Balance</p>
                <p className="text-4xl font-bold mt-1">${patientInfo.balance.toFixed(2)}</p>
                                <Button className="mt-4 bg-white text-teal-600 hover:bg-white/90" onClick={() => setShowPaymentModal(true)}>
                                  <DollarSign className="w-4 h-4 mr-2" />
                                  Pay Now
                                </Button>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-md flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-slate-500">Expires 12/27</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Default</Badge>
                </div>
                                <Button variant="outline" className="w-full" onClick={() => setShowAddPaymentModal(true)}>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Payment Method
                                </Button>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-slate-900">{item.description}</p>
                        <p className="text-sm text-slate-500">{item.date}</p>
                        <p className="text-xs text-slate-400">{item.insurance}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${item.amount.toFixed(2)}</p>
                        <Badge className={item.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insurance Info */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Insurance Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-slate-500">Provider</span>
                    <span className="font-medium">Blue Cross Blue Shield</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-slate-500">Member ID</span>
                    <span className="font-medium">XYZ123456789</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">Group Number</span>
                    <span className="font-medium">GRP-98765</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => setShowUpdateInsuranceModal(true)}>Update Insurance</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Tab - New Addition */}
        {activeTab === 'profile' && (
          <div className="p-4 space-y-6">
            <div className="text-center py-6">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarFallback className={`bg-gradient-to-br ${practiceData.practiceColor} text-white text-3xl`}>JD</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-slate-900">{patientInfo.name}</h2>
              <p className="text-slate-500">Member since {patientInfo.memberSince}</p>
            </div>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium">{patientInfo.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-medium">{patientInfo.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-500">Date of Birth</span>
                  <span className="font-medium">{patientInfo.dob}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Address</span>
                  <span className="font-medium text-right">{patientInfo.address}</span>
                </div>
                <Button variant="outline" className="w-full mt-2" onClick={() => setShowEditProfileModal(true)}>Edit Profile</Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Appointment Reminders</p>
                    <p className="text-sm text-slate-500">Receive SMS and email reminders</p>
                  </div>
                  <div className="w-12 h-6 bg-teal-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Communications</p>
                    <p className="text-sm text-slate-500">Receive wellness tips and offers</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-300 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              Sign Out
            </Button>
          </div>
        )}
      </main>

                        {/* Booking Modal with Live Schedule */}
                        {showBookingModal && (
                          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                              <div className="flex items-center justify-between p-4 border-b">
                                <div className="flex items-center gap-3">
                                  {bookingStep === 'schedule' && (
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setBookingStep('type')}>
                                      <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                  )}
                                  <h3 className="text-lg font-bold">
                                    {bookingStep === 'type' ? 'Book Appointment' : 'Select Time'}
                                  </h3>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => { setShowBookingModal(false); resetBookingModal(); }}>
                                  <X className="w-5 h-5" />
                                </Button>
                              </div>
                  
                              {bookingStep === 'type' ? (
                                <>
                                  <div className="p-4 space-y-4 overflow-y-auto">
                                    <div>
                                      <label className="text-sm font-medium text-slate-700">Appointment Type</label>
                                      <select 
                                        className="w-full mt-1 p-3 border rounded-xl bg-slate-50"
                                        value={bookingType}
                                        onChange={(e) => setBookingType(e.target.value)}
                                      >
                                        <option>Adjustment</option>
                                        <option>Wellness Visit</option>
                                        <option>Re-exam</option>
                                        <option>Consultation</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-slate-700">Select Provider</label>
                                      <div className="mt-2 space-y-2">
                                        {['Dr. Jamie Smith', 'Dr. Sarah Chen'].map((provider) => (
                                          <button
                                            key={provider}
                                            onClick={() => setBookingProvider(provider)}
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                              bookingProvider === provider 
                                                ? 'border-teal-500 bg-teal-50' 
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                          >
                                            <div className="flex items-center gap-3">
                                              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${practiceData.practiceColor} flex items-center justify-center text-white font-bold`}>
                                                {provider.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                              </div>
                                              <div>
                                                <p className="font-semibold text-slate-900">{provider}</p>
                                                <p className="text-sm text-slate-500">
                                                  {provider === 'Dr. Jamie Smith' ? 'Chiropractor, Owner' : 'Chiropractor'}
                                                </p>
                                              </div>
                                              {bookingProvider === provider && (
                                                <CheckCircle2 className="w-5 h-5 text-teal-600 ml-auto" />
                                              )}
                                            </div>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-4 border-t bg-slate-50 rounded-b-2xl">
                                    <Button 
                                      className={`w-full bg-gradient-to-r ${practiceData.practiceColor}`}
                                      onClick={() => setBookingStep('schedule')}
                                    >
                                      View {bookingProvider}'s Schedule
                                      <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="p-4 space-y-4 overflow-y-auto flex-1">
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                      <p className="text-sm text-slate-500">Booking with</p>
                                      <p className="font-semibold text-slate-900">{bookingProvider}</p>
                                      <p className="text-sm text-teal-600">{bookingType}</p>
                                    </div>
                        
                                    <div>
                                      <label className="text-sm font-medium text-slate-700 mb-2 block">Select Date</label>
                                      <div className="flex gap-2 overflow-x-auto pb-2">
                                        {availableDates.map((d) => (
                                          <button
                                            key={d.date}
                                            onClick={() => { setBookingDate(d.date); setSelectedTimeSlot(null); }}
                                            className={`flex-shrink-0 w-16 p-2 rounded-xl border-2 text-center transition-all ${
                                              bookingDate === d.date
                                                ? 'border-teal-500 bg-teal-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                          >
                                            <p className="text-xs text-slate-500">{d.dayName}</p>
                                            <p className="text-lg font-bold text-slate-900">{d.dayNum}</p>
                                            <p className="text-xs text-slate-500">{d.month}</p>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                        
                                    {bookingDate && (
                                      <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Available Times</label>
                                        {getTimeSlotsForDate().length > 0 ? (
                                          <div className="grid grid-cols-3 gap-2">
                                            {getTimeSlotsForDate().map((slot) => (
                                              <button
                                                key={slot.time}
                                                onClick={() => slot.available && setSelectedTimeSlot(slot.time)}
                                                disabled={!slot.available}
                                                className={`p-3 rounded-xl border-2 text-center transition-all ${
                                                  !slot.available
                                                    ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                                                    : selectedTimeSlot === slot.time
                                                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                                                    : 'border-slate-200 hover:border-teal-300 text-slate-700'
                                                }`}
                                              >
                                                <p className="font-medium text-sm">{slot.time}</p>
                                                {!slot.available && <p className="text-xs">Booked</p>}
                                              </button>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="p-4 bg-slate-50 rounded-xl text-center">
                                            <p className="text-slate-500">No availability on this date. Please select another date.</p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                        
                                    {selectedTimeSlot && (
                                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center gap-3">
                                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                                          <div>
                                            <p className="font-medium text-green-800">Selected Appointment</p>
                                            <p className="text-sm text-green-700">
                                              {new Date(bookingDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {selectedTimeSlot}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-4 border-t bg-slate-50 rounded-b-2xl">
                                    <Button 
                                      className={`w-full bg-gradient-to-r ${practiceData.practiceColor}`}
                                      disabled={!selectedTimeSlot}
                                      onClick={() => {
                                        setShowBookingModal(false)
                                        setActionSuccess(`Appointment booked with ${bookingProvider} on ${new Date(bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${selectedTimeSlot}!`)
                                        setTimeout(() => setActionSuccess(null), 4000)
                                        resetBookingModal()
                                      }}
                                    >
                                      {selectedTimeSlot ? 'Confirm Booking' : 'Select a Time Slot'}
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}

            {/* Reschedule Modal */}
            {showRescheduleModal && selectedAppointment && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-bold">Reschedule Appointment</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowRescheduleModal(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500">Current Appointment</p>
                      <p className="font-semibold text-slate-900">{selectedAppointment.type}</p>
                      <p className="text-slate-600">{selectedAppointment.date} at {selectedAppointment.time}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">New Date</label>
                      <input type="date" className="w-full mt-1 p-3 border rounded-xl bg-slate-50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">New Time</label>
                      <select className="w-full mt-1 p-3 border rounded-xl bg-slate-50">
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>2:00 PM</option>
                        <option>3:00 PM</option>
                        <option>4:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-slate-50 rounded-b-2xl">
                    <Button 
                      className={`w-full bg-gradient-to-r ${practiceData.practiceColor}`}
                      onClick={() => {
                        setShowRescheduleModal(false)
                        setActionSuccess('Reschedule request submitted! We will confirm your new time.')
                        setTimeout(() => setActionSuccess(null), 3000)
                      }}
                    >
                      Request Reschedule
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Cancel Appointment Modal */}
            {showCancelModal && selectedAppointment && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-bold">Cancel Appointment</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowCancelModal(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-600 font-medium">Cancellation Policy</p>
                      <p className="text-sm text-red-700 mt-1">
                        Cancellations within 24 hours of your appointment may result in a $50 cancellation fee or loss of session credit.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500">Appointment to Cancel</p>
                      <p className="font-semibold text-slate-900">{selectedAppointment.type}</p>
                      <p className="text-slate-600">{selectedAppointment.date} at {selectedAppointment.time}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Reason for Cancellation (optional)</label>
                      <textarea className="w-full mt-1 p-3 border rounded-xl bg-slate-50 h-24 resize-none" placeholder="Let us know why you need to cancel..." />
                    </div>
                  </div>
                  <div className="p-4 border-t bg-slate-50 rounded-b-2xl flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setShowCancelModal(false)}>
                      Keep Appointment
                    </Button>
                    <Button 
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        setShowCancelModal(false)
                        setActionSuccess('Appointment cancelled. You will receive a confirmation email.')
                        setTimeout(() => setActionSuccess(null), 3000)
                      }}
                    >
                      Confirm Cancellation
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-bold">Make a Payment</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowPaymentModal(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${practiceData.practiceColor} text-white`}>
                      <p className="text-white/80 text-sm">Amount Due</p>
                      <p className="text-3xl font-bold">${patientInfo.balance.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Payment Amount</label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input type="number" className="w-full p-3 pl-7 border rounded-xl bg-slate-50" defaultValue={patientInfo.balance.toFixed(2)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Payment Method</label>
                      <div className="mt-2 p-4 bg-slate-50 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-md flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium">**** **** **** 4242</p>
                          <p className="text-xs text-slate-500">Expires 12/27</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-slate-50 rounded-b-2xl">
                    <Button 
                      className={`w-full bg-gradient-to-r ${practiceData.practiceColor}`}
                      onClick={() => {
                        setShowPaymentModal(false)
                        setActionSuccess('Payment of $' + patientInfo.balance.toFixed(2) + ' processed successfully!')
                        setTimeout(() => setActionSuccess(null), 3000)
                      }}
                    >
                      Pay ${patientInfo.balance.toFixed(2)}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Payment Method Modal */}
            {showAddPaymentModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-bold">Add Payment Method</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddPaymentModal(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Card Number</label>
                      <input type="text" className="w-full mt-1 p-3 border rounded-xl bg-slate-50" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Expiry Date</label>
                        <input type="text" className="w-full mt-1 p-3 border rounded-xl bg-slate-50" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">CVV</label>
                        <input type="text" className="w-full mt-1 p-3 border rounded-xl bg-slate-50" placeholder="123" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Name on Card</label>
                      <input type="text" className="w-full mt-1 p-3 border rounded-xl bg-slate-50" placeholder="John Doe" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="default-card" className="w-4 h-4" />
                      <label htmlFor="default-card" className="text-sm text-slate-600">Set as default payment method</label>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-slate-50 rounded-b-2xl">
                    <Button 
                      className={`w-full bg-gradient-to-r ${practiceData.practiceColor}`}
                      onClick={() => {
                        setShowAddPaymentModal(false)
                        setActionSuccess('Payment method added successfully!')
                        setTimeout(() => setActionSuccess(null), 3000)
                      }}
                    >
                      Add Card
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Profile Modal */}
            {showEditProfileModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
                    <h3 className="text-lg font-bold">Edit Profile</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowEditProfileModal(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">First Name</label>
                        <input type="text" className="w-full mt-1 p-3 border rounded-xl bg-slate-50" defaultValue="John" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">Last Name</label>
                        <input type="text" className="w-full mt-1 p-3 border rounded-xl bg-slate-50" defaultValue="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Email</label>
                      <input type="email" className="w-full mt-1 p-3 border rounded-xl bg-slate-50" defaultValue={patientInfo.email} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Phone</label>
                      <input type="tel" className="w-full mt-1 p-3 border rounded-xl bg-slate-50" defaultValue={patientInfo.phone} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                      <input type="date" className="w-full mt-1 p-3 border rounded-xl bg-slate-50" defaultValue="1985-03-15" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Address</label>
                      <input type="text" className="w-full mt-1 p-3 border rounded-xl bg-slate-50" defaultValue={patientInfo.address} />
                    </div>
                  </div>
                  <div className="p-4 border-t bg-slate-50 rounded-b-2xl">
                    <Button 
                      className={`w-full bg-gradient-to-r ${practiceData.practiceColor}`}
                      onClick={() => {
                        setShowEditProfileModal(false)
                        setActionSuccess('Profile updated successfully!')
                        setTimeout(() => setActionSuccess(null), 3000)
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Update Insurance Modal */}
            {showUpdateInsuranceModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-bold">Update Insurance</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowUpdateInsuranceModal(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Insurance Provider</label>
                      <select className="w-full mt-1 p-3 border rounded-xl bg-slate-50">
                        <option>Blue Cross Blue Shield</option>
                        <option>Aetna</option>
                        <option>Cigna</option>
                        <option>UnitedHealthcare</option>
                        <option>Humana</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Member ID</label>
                      <input type="text" className="w-full mt-1 p-3 border rounded-xl bg-slate-50" defaultValue="XYZ123456789" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Group Number</label>
                      <input type="text" className="w-full mt-1 p-3 border rounded-xl bg-slate-50" defaultValue="GRP-98765" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Upload Insurance Card (optional)</label>
                      <div className="mt-1 p-6 border-2 border-dashed border-slate-300 rounded-xl text-center">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-slate-50 rounded-b-2xl">
                    <Button 
                      className={`w-full bg-gradient-to-r ${practiceData.practiceColor}`}
                      onClick={() => {
                        setShowUpdateInsuranceModal(false)
                        setActionSuccess('Insurance information updated!')
                        setTimeout(() => setActionSuccess(null), 3000)
                      }}
                    >
                      Update Insurance
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* View Record Modal */}
            {showRecordViewModal && selectedRecord && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-bold">{selectedRecord.type}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowRecordViewModal(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <FileText className="w-10 h-10 text-teal-600" />
                      <div>
                        <p className="font-semibold text-slate-900">{selectedRecord.description}</p>
                        <p className="text-sm text-slate-500">{selectedRecord.date}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-100 rounded-xl min-h-[200px]">
                      <p className="text-sm text-slate-600 italic">
                        {selectedRecord.type === 'SOAP Note' && 'Subjective: Patient reports improvement in lower back pain. Pain level 4/10.\n\nObjective: ROM improved. Decreased muscle tension in lumbar region.\n\nAssessment: Responding well to treatment.\n\nPlan: Continue weekly adjustments.'}
                        {selectedRecord.type === 'X-Ray Report' && 'Lumbar spine series shows mild degenerative changes at L4-L5. No acute findings. Alignment within normal limits.'}
                        {selectedRecord.type === 'Treatment Plan' && 'Initial treatment plan: 12 visits over 6 weeks. Focus on spinal adjustments, soft tissue therapy, and home exercises.'}
                        {selectedRecord.type === 'Intake Forms' && 'Patient intake completed. Health history reviewed. No contraindications to chiropractic care.'}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-slate-50 rounded-b-2xl flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setShowRecordViewModal(false)}>
                      Close
                    </Button>
                    <Button 
                      className={`flex-1 bg-gradient-to-r ${practiceData.practiceColor}`}
                      onClick={() => {
                        setActionSuccess('Download started for ' + selectedRecord.type)
                        setTimeout(() => setActionSuccess(null), 2000)
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Success Toast */}
            {actionSuccess && (
              <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="font-medium">{actionSuccess}</p>
                </div>
              </div>
            )}

            {/* Bottom Navigation - Redesigned */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-2 z-50">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {[
            { id: 'home', icon: Heart, label: 'Home' },
            { id: 'appointments', icon: Calendar, label: 'Appointments' },
            { id: 'messages', icon: MessageSquare, label: 'Messages', badge: unreadCount },
            { id: 'records', icon: FileText, label: 'Records' },
            { id: 'billing', icon: DollarSign, label: 'Billing' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all relative ${
                activeTab === item.id
                  ? `text-teal-600 bg-teal-50`
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

function App() {
  return <DemoApp />
}

export default App
