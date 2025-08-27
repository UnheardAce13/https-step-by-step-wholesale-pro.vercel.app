"use client"

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Users, UserPlus, Mail, Phone, MessageSquare, Calendar, Clock, Target, TrendingUp, 
  DollarSign, Star, Filter, Search, Bot, Brain, Zap, Activity, Eye, Edit, Trash2,
  Plus, Send, CheckCircle, AlertTriangle, XCircle, BarChart3, PieChart, Timer
} from "lucide-react"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  type: 'lead' | 'investor' | 'wholesaler' | 'agent' | 'vendor'
  status: 'new' | 'contacted' | 'qualified' | 'negotiating' | 'converted' | 'lost'
  source: string
  tags: string[]
  investment_profile: {
    budget_min: number
    budget_max: number
    preferred_areas: string[]
    investment_strategy: string
    experience_level: string
    timeline: string
  }
  lead_score: number
  assigned_agent: string
  created_at: Date
  last_contact: Date
  total_deals: number
  lifetime_value: number
  notes: ContactNote[]
  activities: ContactActivity[]
  follow_up_sequence: FollowUpSequence | null
}

interface ContactNote {
  id: string
  content: string
  created_by: string
  created_at: Date
  type: 'note' | 'call_log' | 'meeting' | 'email'
}

interface ContactActivity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'property_view' | 'offer' | 'contract'
  description: string
  outcome: 'positive' | 'neutral' | 'negative'
  next_action: string
  scheduled_date?: Date
  completed: boolean
  created_by: string
  created_at: Date
}

interface FollowUpSequence {
  id: string
  name: string
  trigger: string
  steps: FollowUpStep[]
  active: boolean
  current_step: number
  started_at: Date
}

interface FollowUpStep {
  step_number: number
  delay_days: number
  action_type: 'email' | 'sms' | 'call' | 'task'
  template: string
  subject?: string
  content: string
  conditions: string[]
  completed: boolean
  scheduled_for: Date
  completed_at?: Date
}

interface Deal {
  id: string
  contact_id: string
  property_address: string
  deal_type: 'wholesale' | 'flip' | 'rental' | 'commercial'
  stage: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'contract' | 'closing' | 'closed'
  property_value: number
  offer_amount: number
  expected_profit: number
  probability: number
  close_date: Date
  agent_id: string
  created_at: Date
  activities: DealActivity[]
}

interface DealActivity {
  id: string
  type: 'offer_made' | 'counter_offer' | 'inspection' | 'financing' | 'contract_signed'
  description: string
  created_at: Date
  created_by: string
}

interface CRMMetrics {
  total_contacts: number
  new_leads_today: number
  qualified_leads: number
  active_deals: number
  total_pipeline_value: number
  conversion_rate: number
  avg_deal_size: number
  response_rate: number
}

const SAMPLE_CONTACTS: Contact[] = [
  {
    id: 'contact_001',
    name: 'Michael Johnson',
    email: 'michael.j@email.com',
    phone: '+1-555-0123',
    type: 'lead',
    status: 'qualified',
    source: 'Website Form',
    tags: ['first-time-investor', 'high-priority'],
    investment_profile: {
      budget_min: 200000,
      budget_max: 500000,
      preferred_areas: ['Austin', 'Round Rock'],
      investment_strategy: 'buy_and_hold',
      experience_level: 'beginner',
      timeline: '3_months'
    },
    lead_score: 85,
    assigned_agent: 'agent_marcus_rodriguez',
    created_at: new Date('2024-11-20'),
    last_contact: new Date('2024-11-25'),
    total_deals: 0,
    lifetime_value: 0,
    notes: [],
    activities: [],
    follow_up_sequence: null
  },
  {
    id: 'contact_002',
    name: 'Sarah Williams',
    email: 'sarah.w@email.com',
    phone: '+1-555-0124',
    type: 'investor',
    status: 'converted',
    source: 'Referral',
    tags: ['experienced-investor', 'luxury-properties'],
    investment_profile: {
      budget_min: 500000,
      budget_max: 2000000,
      preferred_areas: ['Beverly Hills', 'Santa Monica'],
      investment_strategy: 'fix_and_flip',
      experience_level: 'expert',
      timeline: 'immediate'
    },
    lead_score: 95,
    assigned_agent: 'agent_sarah_chen',
    created_at: new Date('2024-10-15'),
    last_contact: new Date('2024-11-24'),
    total_deals: 3,
    lifetime_value: 125000,
    notes: [],
    activities: [],
    follow_up_sequence: null
  }
]

export default function CRMDashboard() {
  const [contacts, setContacts] = useState<Contact[]>(SAMPLE_CONTACTS)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [newNote, setNewNote] = useState('')
  const [metrics, setMetrics] = useState<CRMMetrics>({
    total_contacts: 1567,
    new_leads_today: 23,
    qualified_leads: 145,
    active_deals: 89,
    total_pipeline_value: 12500000,
    conversion_rate: 68.5,
    avg_deal_size: 385000,
    response_rate: 94.2
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        new_leads_today: prev.new_leads_today + Math.floor(Math.random() * 2),
        total_contacts: prev.total_contacts + Math.floor(Math.random() * 3),
        qualified_leads: prev.qualified_leads + Math.floor(Math.random() * 2) - 1,
        total_pipeline_value: prev.total_pipeline_value + Math.floor(Math.random() * 100000),
        conversion_rate: Math.max(0, Math.min(100, prev.conversion_rate + (Math.random() - 0.5) * 2))
      }))

      // Occasionally add new contacts
      if (Math.random() > 0.9) {
        const newContact: Contact = {
          id: `contact_${Date.now()}`,
          name: `New Lead ${Math.floor(Math.random() * 1000)}`,
          email: `lead${Math.floor(Math.random() * 1000)}@example.com`,
          phone: `+1-555-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          type: 'lead',
          status: 'new',
          source: ['Website Form', 'Social Media', 'Referral', 'Cold Call'][Math.floor(Math.random() * 4)],
          tags: [],
          investment_profile: {
            budget_min: Math.floor(Math.random() * 200000) + 100000,
            budget_max: Math.floor(Math.random() * 800000) + 300000,
            preferred_areas: ['Austin', 'Dallas', 'Houston'][Math.floor(Math.random() * 3)].split(','),
            investment_strategy: ['buy_and_hold', 'fix_and_flip', 'wholesale'][Math.floor(Math.random() * 3)],
            experience_level: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
            timeline: ['immediate', '1_month', '3_months', '6_months'][Math.floor(Math.random() * 4)]
          },
          lead_score: Math.floor(Math.random() * 40) + 50,
          assigned_agent: '',
          created_at: new Date(),
          last_contact: new Date(),
          total_deals: 0,
          lifetime_value: 0,
          notes: [],
          activities: [],
          follow_up_sequence: null
        }
        setContacts(prev => [newContact, ...prev.slice(0, 19)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
      const matchesType = typeFilter === 'all' || contact.type === typeFilter
      
      return matchesSearch && matchesStatus && matchesType
    }).sort((a, b) => b.lead_score - a.lead_score)
  }, [contacts, searchTerm, statusFilter, typeFilter])

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
      contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
      qualified: 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30',
      negotiating: 'bg-purple-500/20 text-purple-400 border-purple-400/30',
      converted: 'bg-green-500/20 text-green-400 border-green-400/30',
      lost: 'bg-red-500/20 text-red-400 border-red-400/30'
    }
    return colors[status as keyof typeof colors] || colors.new
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      lead: <UserPlus className="h-4 w-4" />,
      investor: <Target className="h-4 w-4" />,
      wholesaler: <Users className="h-4 w-4" />,
      agent: <Star className="h-4 w-4" />,
      vendor: <Users className="h-4 w-4" />
    }
    return icons[type as keyof typeof icons] || <Users className="h-4 w-4" />
  }

  const handleAddNote = () => {
    if (!selectedContact || !newNote.trim()) return

    const note: ContactNote = {
      id: `note_${Date.now()}`,
      content: newNote,
      created_by: 'current_user',
      created_at: new Date(),
      type: 'note'
    }

    setContacts(prev => prev.map(contact => 
      contact.id === selectedContact.id 
        ? { ...contact, notes: [note, ...contact.notes] }
        : contact
    ))

    setSelectedContact(prev => prev ? { ...prev, notes: [note, ...prev.notes] } : null)
    setNewNote('')
  }

  const handleStartFollowUp = (contactId: string, sequenceType: string) => {
    console.log(`Starting ${sequenceType} follow-up sequence for contact ${contactId}`)
    // Implementation would create automated sequence
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold sbswp-holographic-text mb-2">AI-Powered CRM</h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-400" />
              Intelligent contact management with automated follow-up sequences
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button className="sbswp-neural-button">
              <Plus className="h-4 w-4 mr-2" />Add Contact
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Bot className="h-4 w-4 mr-2" />AI Auto-Assign
            </Button>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="sbswp-quantum-card border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Contacts</p>
                  <p className="text-3xl font-bold text-blue-400">{metrics.total_contacts.toLocaleString()}</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />+{metrics.new_leads_today} today
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="sbswp-quantum-card border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Qualified Leads</p>
                  <p className="text-3xl font-bold text-emerald-400">{metrics.qualified_leads}</p>
                  <p className="text-xs text-gray-400">Ready to convert</p>
                </div>
                <Target className="h-8 w-8 text-emerald-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="sbswp-quantum-card border-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pipeline Value</p>
                  <p className="text-3xl font-bold text-purple-400">${(metrics.total_pipeline_value / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />+12.4% this month
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="sbswp-quantum-card border-0 bg-gradient-to-br from-orange-500/10 to-orange-600/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold text-orange-400">{metrics.conversion_rate.toFixed(1)}%</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />+5.2% vs last month
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* CONTACTS LIST */}
          <div className="xl:col-span-2">
            <Card className="sbswp-quantum-card border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-400" />
                      Smart Contact Management
                    </CardTitle>
                    <p className="text-gray-400">AI-scored leads with automated nurturing</p>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                    {filteredContacts.length} Contacts
                  </Badge>
                </div>

                {/* FILTERS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search contacts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
                  </div>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                  </select>
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                    <option value="all">All Types</option>
                    <option value="lead">Leads</option>
                    <option value="investor">Investors</option>
                    <option value="agent">Agents</option>
                  </select>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredContacts.map((contact) => (
                    <div key={contact.id} className="sbswp-quantum-card p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]" onClick={() => setSelectedContact(contact)}>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                          {getTypeIcon(contact.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-white">{contact.name}</h3>
                              <p className="text-sm text-gray-400">{contact.email}</p>
                              <p className="text-sm text-gray-400">{contact.phone}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold sbswp-text-quantum mb-1">Score: {contact.lead_score}</div>
                              <Badge className={getStatusColor(contact.status)}>{contact.status.toUpperCase()}</Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="text-center">
                              <div className="text-sm font-bold text-blue-400">${(contact.investment_profile.budget_max / 1000).toFixed(0)}K</div>
                              <div className="text-xs text-gray-400">Max Budget</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-bold text-emerald-400">{contact.total_deals}</div>
                              <div className="text-xs text-gray-400">Deals</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-bold text-purple-400">${(contact.lifetime_value / 1000).toFixed(0)}K</div>
                              <div className="text-xs text-gray-400">LTV</div>
                            </div>
                          </div>

                          {/* TAGS */}
                          <div className="flex gap-2 mb-3">
                            {contact.tags.map((tag, index) => (
                              <Badge key={index} className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" className="sbswp-neural-button">
                              <MessageSquare className="h-4 w-4 mr-1" />Contact
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              <Bot className="h-4 w-4 mr-1" />Auto Follow-up
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CONTACT DETAILS PANEL */}
          <div className="xl:col-span-1">
            {selectedContact ? (
              <Card className="sbswp-quantum-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-400" />
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* CONTACT INFO */}
                  <div>
                    <h3 className="font-bold text-xl text-white mb-2">{selectedContact.name}</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-400">📧 {selectedContact.email}</p>
                      <p className="text-gray-400">📞 {selectedContact.phone}</p>
                      <p className="text-gray-400">📍 {selectedContact.investment_profile.preferred_areas.join(', ')}</p>
                      <p className="text-gray-400">💰 ${selectedContact.investment_profile.budget_min.toLocaleString()} - ${selectedContact.investment_profile.budget_max.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* LEAD SCORE */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Lead Score</span>
                      <span className="text-lg font-bold sbswp-text-quantum">{selectedContact.lead_score}</span>
                    </div>
                    <Progress value={selectedContact.lead_score} className="h-2 bg-gray-700" />
                  </div>

                  {/* QUICK ACTIONS */}
                  <div className="space-y-2">
                    <Button className="w-full sbswp-neural-button" onClick={() => handleStartFollowUp(selectedContact.id, 'nurture')}>
                      <Bot className="h-4 w-4 mr-2" />Start AI Nurture Sequence
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      <Phone className="h-4 w-4 mr-2" />Schedule Call
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      <Mail className="h-4 w-4 mr-2" />Send Email
                    </Button>
                  </div>

                  {/* ADD NOTE */}
                  <div>
                    <h4 className="font-bold text-white mb-2">Add Note</h4>
                    <Textarea placeholder="Enter note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="bg-white/5 border-white/10 text-white mb-2" />
                    <Button onClick={handleAddNote} disabled={!newNote.trim()} className="w-full sbswp-neural-button">
                      <Send className="h-4 w-4 mr-2" />Add Note
                    </Button>
                  </div>

                  {/* RECENT NOTES */}
                  <div>
                    <h4 className="font-bold text-white mb-2">Recent Notes</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedContact.notes.slice(0, 5).map((note) => (
                        <div key={note.id} className="p-3 bg-white/5 rounded-lg">
                          <p className="text-sm text-white">{note.content}</p>
                          <p className="text-xs text-gray-400 mt-1">{note.created_at.toLocaleDateString()}</p>
                        </div>
                      ))}
                      {selectedContact.notes.length === 0 && (
                        <p className="text-sm text-gray-400">No notes yet</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sbswp-quantum-card border-0">
                <CardContent className="p-6 text-center">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bold text-white mb-2">Select a Contact</h3>
                  <p className="text-gray-400">Choose a contact from the list to view details and manage interactions</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}