# 🔗 API Documentation - Wholesale Pro Platform

## Overview
This document describes all API endpoints implemented in the Wholesale Pro platform. All endpoints follow RESTful conventions and return JSON responses.

## Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.vercel.app`

## Authentication
Most endpoints require authentication via Supabase. Include the user's session token in requests.

---

## 🤖 AI & Analytics APIs

### Deal Analyzer
Analyzes property deals for ROI, risk assessment, and market insights.

**Endpoint**: `POST /api/tools/deal-analyzer/analyze`

**Request Body**:
```json
{
  "propertyData": {
    "address": "123 Main St, Dallas, TX 75001",
    "purchasePrice": 75000,
    "arv": 120000,
    "rehabCost": 15000,
    "sqft": 1200,
    "condition": "good"
  },
  "userId": "uuid-string"
}
```

**Response**:
```json
{
  "analysis": {
    "property": {
      "address": "123 Main St, Dallas, TX 75001",
      "purchasePrice": 75000,
      "arv": 120000,
      "rehabCost": 15000
    },
    "calculations": {
      "totalInvestment": 90000,
      "potentialProfit": 30000,
      "roi": 33.33,
      "profitMargin": 25.0,
      "wholesaleSpread": 9000
    },
    "marketAnalysis": {
      "comparableProperties": [...],
      "marketTrend": "Increasing",
      "demandLevel": "High",
      "timeOnMarket": "45 days average"
    },
    "riskAssessment": {
      "overallRisk": "Low",
      "factors": [...]
    },
    "recommendations": ["Excellent deal - proceed with confidence"],
    "aiInsights": ["Property shows strong fundamentals"]
  }
}
```

### Predictive Scoring
Calculates lead quality scores based on historical data and property factors.

**Endpoint**: `POST /api/analytics/scoring/predict`

**Request Body**:
```json
{
  "leadId": "uuid-string",
  "propertyData": {
    "price": 75000,
    "location": "suburbs",
    "condition": "good",
    "arv": 120000,
    "source": "website"
  },
  "wholesalerId": "uuid-string"
}
```

**Response**:
```json
{
  "score": {
    "overall": 78,
    "probability": 78,
    "factors": {
      "pricePoint": 90,
      "location": 85,
      "condition": 85,
      "marketTiming": 80,
      "arvMargin": 95,
      "leadSource": 80
    },
    "weights": {
      "pricePoint": 0.25,
      "location": 0.20,
      "condition": 0.15,
      "marketTiming": 0.15,
      "arvMargin": 0.15,
      "leadSource": 0.10
    }
  },
  "recommendation": "Medium Priority - Strong Potential"
}
```

### Performance Metrics
Retrieves KPI and performance analytics for wholesalers.

**Endpoint**: `GET /api/analytics/performance/metrics?userId={userId}&timeframe={days}`

**Query Parameters**:
- `userId` (required): User UUID
- `timeframe` (optional): Number of days (default: 30)

**Response**:
```json
{
  "metrics": {
    "summary": {
      "totalLeads": 45,
      "qualifiedLeads": 12,
      "completedDeals": 3,
      "totalRevenue": 25500,
      "smsCount": 127
    },
    "kpis": {
      "conversionRate": 6.67,
      "avgDealSize": 8500,
      "leadQualificationRate": 26.67,
      "responseRate": 18.9,
      "profitMargin": 22.5,
      "dealVelocity": 10.0
    },
    "trends": {
      "leadsGrowth": 15.3,
      "revenueGrowth": 28.7,
      "conversionTrend": "increasing",
      "marketShare": 8.2
    },
    "benchmarks": {
      "industryAvgConversion": 3.5,
      "industryAvgDealSize": 8500,
      "industryAvgResponseRate": 15.2,
      "yourRanking": "Top 25%"
    },
    "aiInsights": [
      "Your conversion rate is 45% above industry average",
      "Consider increasing lead volume to maximize revenue potential"
    ]
  }
}
```

---

## 🤖 AI Bot APIs

### Zikk Bot - Lead Capture
Captures and processes leads through AI automation.

**Endpoint**: `POST /api/wholesaler/zikk/capture`

**Request Body**:
```json
{
  "leadData": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "propertyAddress": "456 Oak St, Dallas, TX",
    "source": "website"
  },
  "wholesalerId": "uuid-string"
}
```

**Response**:
```json
{
  "message": "Lead captured successfully",
  "leadId": "uuid-string",
  "status": "processing"
}
```

### Huntz Bot - Property Search
Initiates automated property search based on criteria.

**Endpoint**: `POST /api/wholesaler/huntz/search`

**Request Body**:
```json
{
  "searchCriteria": {
    "location": "Dallas, TX",
    "maxPrice": 100000,
    "minPrice": 50000,
    "propertyType": "single-family",
    "condition": "any"
  },
  "wholesalerId": "uuid-string"
}
```

**Response**:
```json
{
  "message": "Property search initiated",
  "status": "searching"
}
```

### Other AI Bots
Similar endpoints exist for:
- `POST /api/wholesaler/automatz/workflow` - Workflow automation
- `POST /api/wholesaler/rezz/resources` - Resource management
- `POST /api/wholesaler/pipz/pipeline` - Pipeline optimization
- `POST /api/wholesaler/agent-vetzz/assist` - Virtual assistant

---

## 📱 Communication APIs

### SMS Sending
Sends SMS messages via Telnyx integration.

**Endpoint**: `POST /api/sms/send`

**Request Body**:
```json
{
  "to": "+1234567890",
  "message": "Hi! I have a great investment opportunity for you.",
  "type": "lead_outreach",
  "userId": "uuid-string"
}
```

**Response**:
```json
{
  "success": true,
  "messageId": "telnyx-message-id",
  "status": "sent"
}
```

### SMS Webhook
Handles incoming SMS webhooks from Telnyx.

**Endpoint**: `POST /api/sms/webhook`

**Note**: This endpoint is called by Telnyx, not by your application.

---

## 💳 Payment & Subscription APIs

### Create Subscription
Creates a Stripe checkout session for subscription.

**Endpoint**: `POST /api/stripe/create-subscription`

**Request Body**:
```json
{
  "planId": "starter",
  "userId": "uuid-string",
  "email": "user@example.com",
  "promoCode": "LAUNCH30"
}
```

**Response**:
```json
{
  "sessionId": "cs_stripe_session_id",
  "url": "https://checkout.stripe.com/pay/..."
}
```

### Stripe Webhook
Handles Stripe payment webhooks.

**Endpoint**: `POST /api/stripe/webhook`

**Note**: This endpoint is called by Stripe, not by your application.

---

## 🔧 Admin APIs

### Generate Promo Code
Creates promotional codes for trial extensions.

**Endpoint**: `POST /api/admin/promo-codes/generate`

**Request Body**:
```json
{
  "code": "HOLIDAY50",
  "description": "50% off holiday promotion",
  "daysValid": 30,
  "maxUses": 100,
  "adminId": "uuid-string"
}
```

**Response**:
```json
{
  "success": true,
  "promoCode": {
    "id": "uuid-string",
    "code": "HOLIDAY50",
    "daysValid": 30,
    "maxUses": 100,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### System Health Check
Validates system components and integrations.

**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": "connected",
    "stripe": "operational",
    "telnyx": "operational",
    "docusign": "operational"
  },
  "version": "1.0.0"
}
```

---

## 📄 Document APIs

### Send DocuSign Document
Sends documents for electronic signature.

**Endpoint**: `POST /api/docusign/send`

**Request Body**:
```json
{
  "documentType": "purchase_agreement",
  "recipientEmail": "buyer@example.com",
  "recipientName": "John Buyer",
  "dealId": "uuid-string",
  "propertyAddress": "123 Main St, Dallas, TX",
  "state": "TX"
}
```

**Response**:
```json
{
  "success": true,
  "envelopeId": "docusign-envelope-id",
  "signingUrl": "https://docusign.com/signing/...",
  "status": "sent"
}
```

### DocuSign Webhook
Handles DocuSign status updates.

**Endpoint**: `POST /api/docusign/webhook`

**Note**: This endpoint is called by DocuSign, not by your application.

---

## 🧪 Testing & Utilities

### Supabase Connection Test
Tests database connectivity and authentication.

**Endpoint**: `GET /api/test/supabase`

**Response**:
```json
{
  "status": "success",
  "message": "Supabase connection successful",
  "timestamp": "2024-01-15T10:30:00Z",
  "user": {
    "id": "uuid-string",
    "email": "test@example.com"
  }
}
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Common HTTP Status Codes**:
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API endpoints are subject to rate limiting:
- **General APIs**: 100 requests per minute per IP
- **SMS APIs**: 10 requests per minute per user
- **AI APIs**: 20 requests per minute per user

---

## Webhook Security

Webhook endpoints verify signatures to ensure authenticity:
- **Stripe**: Uses `stripe-signature` header
- **Telnyx**: Uses API key validation
- **DocuSign**: Uses HMAC signature verification

---

## Testing

Use the provided test suite to validate API functionality:

```bash
# Run comprehensive API tests
node test-api.js

# Test specific endpoint
curl -X POST http://localhost:3000/api/health
```

---

## Support

For API support and questions:
- **Documentation**: See `PROJECT_COMPLETION_SUMMARY.md`
- **Testing**: Use `test-api.js` for validation
- **Issues**: Check system health via `/api/health`

**API Version**: 1.0.0  
**Last Updated**: 2024-01-15