/**
 * S.B.S.W.P 2.0 - AI CONTRACT GENERATOR COMPONENT
 * Revolutionary AI-powered contract generation interface
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText,
  Sparkles,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  Building,
  Zap,
  CheckCircle,
  AlertTriangle,
  Download,
  Send,
  Eye,
  Brain,
  Settings,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useContractGeneration, useContractSigning } from '@/hooks/use-contracts'
import { 
  ContractType, 
  AIContractRequest, 
  ContractParty, 
  SignatureType,
  CONTRACT_TEMPLATES,
  US_STATES 
} from '@/lib/contract-types'

interface AIContractGeneratorProps {
  onContractGenerated?: (contractId: string) => void
  className?: string
}

export function AIContractGenerator({ onContractGenerated, className }: AIContractGeneratorProps) {
  const [formData, setFormData] = useState<Partial<AIContractRequest>>({
    contractType: ContractType.PURCHASE_AGREEMENT,
    jurisdiction: 'CA',
    complexity: 'moderate',
    parties: [
      { type: 'buyer', name: '', email: '', signatureRequired: true, signatureType: SignatureType.ELECTRONIC },
      { type: 'seller', name: '', email: '', signatureRequired: true, signatureType: SignatureType.ELECTRONIC }
    ],
    userRequirements: '',
    specialClauses: [],
    timeline: 'standard'
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [showPreview, setShowPreview] = useState(false)
  const { isGenerating, response, error, progress, generateContract, resetGeneration } = useContractGeneration()
  const { sendForSignature, isSending } = useContractSigning()

  const handleInputChange = (field: keyof AIContractRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePartyChange = (index: number, field: keyof ContractParty, value: any) => {
    const updatedParties = [...(formData.parties || [])]
    updatedParties[index] = { ...updatedParties[index], [field]: value }
    setFormData(prev => ({ ...prev, parties: updatedParties }))
  }

  const addParty = () => {
    const newParty = {
      type: 'other' as any,
      name: '',
      email: '',
      signatureRequired: true,
      signatureType: SignatureType.ELECTRONIC
    }
    setFormData(prev => ({
      ...prev,
      parties: [...(prev.parties || []), newParty]
    }))
  }

  const removeParty = (index: number) => {
    const updatedParties = formData.parties?.filter((_, i) => i !== index) || []
    setFormData(prev => ({ ...prev, parties: updatedParties }))
  }

  const handleGenerate = async () => {
    if (!isValidForm()) return

    try {
      await generateContract(formData as AIContractRequest)
      if (onContractGenerated && response) {
        onContractGenerated(response.contractId)
      }
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }

  const handleSendForSignature = async () => {
    if (!response?.contractId || !formData.parties) return
    
    try {
      await sendForSignature(response.contractId, formData.parties as ContractParty[])
    } catch (error) {
      console.error('Send for signature failed:', error)
    }
  }

  const isValidForm = (): boolean => {
    return !!(
      formData.contractType &&
      formData.jurisdiction &&
      formData.userRequirements &&
      formData.parties &&
      formData.parties.length >= 2 &&
      formData.parties.every(party => party.name && party.email)
    )
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">AI Contract Generator</h2>
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
            <Sparkles className="h-3 w-3 mr-1" />
            BETA
          </Badge>
        </div>
        <p className="text-gray-400 text-lg">
          Generate legally compliant contracts in seconds with advanced AI technology
        </p>
      </motion.div>

      {/* Progress Indicator */}
      {!response && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/50 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-medium">Step {currentStep} of 4</span>
                <span className="text-gray-400">{Math.round((currentStep / 4) * 100)}% Complete</span>
              </div>
              <Progress value={(currentStep / 4) * 100} className="h-2" />
              <div className="grid grid-cols-4 gap-4 mt-4">
                {[
                  { num: 1, title: 'Contract Type', icon: FileText },
                  { num: 2, title: 'Parties', icon: Users },
                  { num: 3, title: 'Requirements', icon: Settings },
                  { num: 4, title: 'Review', icon: Eye }
                ].map((step) => (
                  <div
                    key={step.num}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                      step.num === currentStep
                        ? 'bg-blue-600/20 border border-blue-500/30'
                        : step.num < currentStep
                        ? 'bg-green-600/20 border border-green-500/30'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <step.icon className={`h-4 w-4 ${
                      step.num === currentStep
                        ? 'text-blue-400'
                        : step.num < currentStep
                        ? 'text-green-400'
                        : 'text-gray-400'
                    }`} />
                    <span className={`text-sm ${
                      step.num <= currentStep ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Generation Progress */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Brain className="h-10 w-10 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-400"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">AI is generating your contract...</h3>
              <p className="text-gray-400 mb-6">
                Analyzing requirements, selecting clauses, and ensuring legal compliance
              </p>
              <Progress value={progress} className="h-3 mb-4" />
              <p className="text-sm text-gray-500">{progress}% Complete</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-red-900/30 border-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                <div>
                  <h4 className="text-red-200 font-medium">Generation Failed</h4>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
              <Button
                onClick={resetGeneration}
                variant="outline"
                className="mt-4 bg-red-900/20 border-red-500/30 text-red-200 hover:bg-red-800/30"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Success - Generated Contract */}
      {response && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
                Contract Generated Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contract Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{response.confidence}%</div>
                  <div className="text-gray-400 text-sm">AI Confidence</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{response.generatedClauses.length}</div>
                  <div className="text-gray-400 text-sm">Clauses Generated</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{response.estimatedReviewTime}m</div>
                  <div className="text-gray-400 text-sm">Review Time</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">{response.riskFactors.length}</div>
                  <div className="text-gray-400 text-sm">Risk Factors</div>
                </div>
              </div>

              {/* AI Recommendations */}
              {response.recommendations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    AI Recommendations
                  </h4>
                  <div className="space-y-2">
                    {response.recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="text-white font-medium text-sm">{rec.title}</h5>
                            <p className="text-gray-400 text-sm">{rec.description}</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${
                              rec.priority === 'high' 
                                ? 'border-red-500/30 text-red-300' 
                                : rec.priority === 'medium'
                                ? 'border-yellow-500/30 text-yellow-300'
                                : 'border-blue-500/30 text-blue-300'
                            }`}
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setShowPreview(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Contract
                </Button>
                <Button 
                  onClick={handleSendForSignature}
                  disabled={isSending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send for Signature
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Form Steps */}
      {!response && !isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 border-white/10">
            <CardContent className="p-6">
              {/* Step 1: Contract Type */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Contract Type & Jurisdiction</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contractType" className="text-white">Contract Type</Label>
                      <Select
                        value={formData.contractType}
                        onValueChange={(value) => handleInputChange('contractType', value as ContractType)}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CONTRACT_TEMPLATES).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jurisdiction" className="text-white">Jurisdiction</Label>
                      <Select
                        value={formData.jurisdiction}
                        onValueChange={(value) => handleInputChange('jurisdiction', value)}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complexity" className="text-white">Complexity Level</Label>
                      <Select
                        value={formData.complexity}
                        onValueChange={(value) => handleInputChange('complexity', value)}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simple">Simple</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="complex">Complex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeline" className="text-white">Timeline</Label>
                      <Select
                        value={formData.timeline}
                        onValueChange={(value) => handleInputChange('timeline', value)}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent (24 hours)</SelectItem>
                          <SelectItem value="standard">Standard (7 days)</SelectItem>
                          <SelectItem value="extended">Extended (30 days)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Property Details (Optional)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Property Address</Label>
                        <Input
                          value={formData.propertyDetails?.address || ''}
                          onChange={(e) => handleInputChange('propertyDetails', {
                            ...formData.propertyDetails,
                            address: e.target.value
                          })}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="123 Main St, City, State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Purchase Price</Label>
                        <Input
                          type="number"
                          value={formData.propertyDetails?.price || ''}
                          onChange={(e) => handleInputChange('propertyDetails', {
                            ...formData.propertyDetails,
                            price: parseFloat(e.target.value)
                          })}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Parties */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Contract Parties</h3>
                    <Button onClick={addParty} variant="outline" size="sm" className="bg-white/5 border-white/10 text-white">
                      <Users className="h-4 w-4 mr-2" />
                      Add Party
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {formData.parties?.map((party, index) => (
                      <Card key={index} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-medium">Party {index + 1}</h4>
                            {formData.parties!.length > 2 && (
                              <Button
                                onClick={() => removeParty(index)}
                                variant="outline"
                                size="sm"
                                className="text-red-400 border-red-400/30 hover:bg-red-900/20"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-white">Role</Label>
                              <Select
                                value={party.type}
                                onValueChange={(value) => handlePartyChange(index, 'type', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="buyer">Buyer</SelectItem>
                                  <SelectItem value="seller">Seller</SelectItem>
                                  <SelectItem value="agent">Agent</SelectItem>
                                  <SelectItem value="broker">Broker</SelectItem>
                                  <SelectItem value="investor">Investor</SelectItem>
                                  <SelectItem value="contractor">Contractor</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">Full Name</Label>
                              <Input
                                value={party.name}
                                onChange={(e) => handlePartyChange(index, 'name', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="John Doe"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">Email</Label>
                              <Input
                                type="email"
                                value={party.email}
                                onChange={(e) => handlePartyChange(index, 'email', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="john@example.com"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )) || []}
                  </div>
                </div>
              )}

              {/* Step 3: Requirements */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Contract Requirements</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Describe your contract requirements</Label>
                      <Textarea
                        value={formData.userRequirements}
                        onChange={(e) => handleInputChange('userRequirements', e.target.value)}
                        className="bg-white/5 border-white/10 text-white min-h-[120px]"
                        placeholder="Describe what you need in this contract. Be specific about terms, conditions, timelines, and any special requirements..."
                      />
                      <p className="text-gray-400 text-sm">
                        The more detailed your requirements, the better AI can generate your contract.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Special Clauses (Optional)</Label>
                      <Textarea
                        value={formData.specialClauses?.join('\n') || ''}
                        onChange={(e) => handleInputChange('specialClauses', e.target.value.split('\n').filter(Boolean))}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Enter each special clause on a new line..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Review & Generate</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Contract Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white">{CONTRACT_TEMPLATES[formData.contractType as ContractType]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Jurisdiction:</span>
                          <span className="text-white">{formData.jurisdiction}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Complexity:</span>
                          <span className="text-white capitalize">{formData.complexity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Parties:</span>
                          <span className="text-white">{formData.parties?.length || 0}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">AI Processing</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300">Legal compliance check</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300">Risk assessment</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300">Clause optimization</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300">Format standardization</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-3">
                  {currentStep < 4 ? (
                    <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      onClick={handleGenerate}
                      disabled={!isValidForm() || isGenerating}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Contract with AI
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}