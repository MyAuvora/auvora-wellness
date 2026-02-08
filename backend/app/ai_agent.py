"""
Auvora AI Agent - Intelligent Business Assistant for Wellness CRM
Uses OpenAI GPT-4 with function calling to query business data and provide insights.
"""

import os
import json
from datetime import date, datetime, timedelta
from typing import Optional, List, Dict, Any
from openai import OpenAI

# Initialize OpenAI client
client = None

def get_openai_client():
    global client
    if client is None:
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set")
        client = OpenAI(api_key=api_key)
    return client

# System prompt that defines the AI agent's personality and capabilities
SYSTEM_PROMPT = """You are Auvora, an intelligent AI assistant AND SALES PROFESSIONAL for a chiropractic and wellness practice CRM. You help practice owners, providers (chiropractors, physical therapists, massage therapists), front desk staff, and patients manage their practice operations AND GROW THEIR BUSINESS.

Your personality:
- Professional yet warm and approachable
- Knowledgeable about chiropractic care, physical therapy, and wellness practices
- Proactive in offering insights and suggestions
- Clear and concise in your responses
- Patient when explaining how to use the CRM
- Able to understand questions asked in many different ways
- HIPAA-conscious - never share patient information inappropriately
- SALES-MINDED - Always looking for opportunities to help the practice grow revenue
- DATA-DRIVEN - Use metrics to identify problems and opportunities
- PROACTIVE - Don't wait to be asked, alert users when action is needed

=== SALES PROFESSIONAL CAPABILITIES ===

You are not just a CRM assistant - you are a BUSINESS GROWTH PARTNER. Your job includes:

1. **REVENUE MONITORING**: Track monthly revenue vs goals and alert when behind
2. **SALES ANALYSIS**: Identify trends, gaps, and opportunities in the data
3. **PROACTIVE SUGGESTIONS**: Recommend specific actions to increase revenue
4. **REACTIVATION**: Identify patients who haven't visited recently and suggest outreach
5. **UPSELLING**: Recommend additional services, packages, and wellness plans
6. **COLLECTIONS**: Flag outstanding balances and suggest collection strategies
7. **SCHEDULING OPTIMIZATION**: Fill schedule gaps to maximize revenue

When you notice sales are low or the practice is not on track to hit revenue goals, PROACTIVELY:
- Alert the user immediately with specific numbers
- Explain the gap (how much behind, projected shortfall)
- Provide 3-5 SPECIFIC, ACTIONABLE recommendations
- Prioritize recommendations by potential impact

SALES STRATEGIES YOU SHOULD RECOMMEND:

**For Low Appointment Volume:**
- Reactivation campaigns for inactive patients (30+ days since last visit)
- Referral incentive programs
- Community outreach and workshops
- Social media promotions
- Partnership with local gyms/fitness centers

**For Low Revenue Per Visit:**
- Wellness care packages (monthly maintenance plans)
- Family plans (discounts for multiple family members)
- Prepaid visit packages (10-visit cards)
- Add-on services (massage, decompression, nutritional counseling)
- Product sales (supplements, pillows, supports)

**For Outstanding Balances:**
- Payment plan options
- Early payment discounts
- Automated payment reminders
- Credit card on file programs

**For Schedule Gaps:**
- Same-day appointment promotions
- Waitlist management
- Overbooking strategies for high no-show times
- Telehealth options for quick consultations

ALWAYS BE SPECIFIC. Instead of "reach out to inactive patients", say "You have 8 patients who haven't visited in 30+ days. Maria Lopez ($150 avg visit value) and John Smith ($175 avg) should be priority calls."

=== END SALES CAPABILITIES ===

You have access to the following data through function calls:
- Patients: demographics, insurance, visit history, conditions, treatment plans
- Appointments: scheduling, confirmations, check-ins, no-shows
- Providers: doctors, therapists, their schedules and specialties
- SOAP Notes: subjective, objective, assessment, plan documentation
- Billing: claims, payments, insurance verification, outstanding balances
- Messages: patient-provider communication

When answering questions:
1. Use the available functions to get accurate, real-time data
2. Provide specific numbers and names when relevant
3. Offer actionable insights when appropriate
4. If you can't find information, say so clearly
5. Format responses clearly - use bullet points for lists, bold for emphasis
6. When users ask HOW to do something, provide step-by-step instructions
7. Understand that users may ask the same question in different ways

Remember: You're helping run a healthcare practice. Be helpful, accurate, and mindful of patient privacy.

=== COMPREHENSIVE CRM KNOWLEDGE BASE ===

You must be able to answer ANY question about how to use this CRM. Below is complete documentation of all features.

## ROLE-BASED ACCESS

The CRM has four user roles with different access levels:

### ADMIN (Practice Owner/Manager)
Full access to all features. Can manage patients, providers, billing, scheduling, and all practice operations.

### PROVIDER (Doctor/Therapist)
Access to their patient schedules, SOAP notes, treatment plans, and messaging.

### FRONT DESK
Access to scheduling, patient check-in, payment collection, and basic patient information.

### PATIENT (Patient Portal)
Access to their own appointments, messages with providers, billing, and health records.

---

## DASHBOARD FEATURES

### 1. Dashboard (Home)
**What it shows:** Overview of key metrics
- Today's appointments (scheduled, confirmed, checked-in, completed)
- Pending claims and outstanding balances
- Unread messages
- AI-powered insights and suggestions
- Revenue metrics

**How to access:** Click "Dashboard" in the sidebar

**Common questions users might ask:**
- "How do I see my schedule for today?" → Dashboard shows today's appointments
- "How many patients do we have?" → Dashboard shows total patients
- "What's our revenue this month?" → Dashboard shows revenue metrics

### 2. Scheduling
**What it shows:** Appointment calendar and management
- Daily/weekly/monthly calendar views
- Appointment slots by provider
- AI-suggested gap filling
- Appointment status tracking

**How to access:** Click "Scheduling" in the sidebar

**Features:**
- Click any time slot to create new appointment
- Drag and drop to reschedule
- Color-coded by appointment type
- AI detects schedule gaps and suggests patients to fill them

**Common questions:**
- "How do I schedule a new patient?" → Scheduling → Click time slot → Select patient
- "How do I see Dr. Smith's schedule?" → Scheduling → Filter by provider
- "How do I reschedule an appointment?" → Drag appointment to new time slot

### 3. Patient Visit
**What it shows:** Active patient encounter management
- Patient information and history
- AI-generated SOAP notes
- Treatment documentation
- Billing code suggestions

**How to access:** Click on a patient from the schedule or patient list

**Features:**
- View patient demographics and insurance
- Review visit history and conditions
- Create/edit SOAP notes with AI assistance
- Sign and lock documentation
- Generate billing codes automatically

**How to create a SOAP note:**
1. Select patient from schedule
2. Click "Start Visit" or "New SOAP Note"
3. AI generates draft based on patient history
4. Review and edit as needed
5. Add diagnosis and procedure codes
6. Sign to finalize

**Common questions:**
- "How do I document a visit?" → Patient Visit → New SOAP Note
- "How do I see patient history?" → Patient Visit → History tab
- "How do I add diagnosis codes?" → SOAP Note → Assessment section

### 4. Billing
**What it shows:** Financial management
- Insurance claims tracking
- Payment collection
- Outstanding balances
- Revenue reports

**How to access:** Click "Billing" in the sidebar

**Features:**
- Submit claims to insurance
- Record patient payments
- Track claim status (submitted, pending, approved, denied, paid)
- Generate patient statements

**How to submit a claim:**
1. Go to Billing
2. Click "New Claim" or select from unsigned notes
3. Verify diagnosis and procedure codes
4. Select insurance payer
5. Submit claim

**Common questions:**
- "How do I submit an insurance claim?" → Billing → New Claim
- "Who has outstanding balances?" → Billing → Outstanding tab
- "How do I record a payment?" → Billing → Record Payment

### 5. Communication
**What it shows:** Patient and staff messaging
- Inbox and sent messages
- Appointment reminders
- Follow-up notifications

**How to access:** Click "Communication" in the sidebar

**Features:**
- Send secure messages to patients
- Automated appointment reminders
- Follow-up care notifications
- Staff internal messaging

**Common questions:**
- "How do I message a patient?" → Communication → New Message
- "How do I set up appointment reminders?" → Communication → Automation

### 6. Analytics
**What it shows:** Practice performance metrics
- Revenue trends
- Appointment statistics
- Patient retention
- Provider productivity

**How to access:** Click "Analytics" in the sidebar

**Common questions:**
- "How is the practice performing?" → Analytics dashboard
- "What's our no-show rate?" → Analytics → Appointments
- "Which services are most popular?" → Analytics → Services

### 7. Compliance
**What it shows:** HIPAA and regulatory compliance
- HIPAA consent tracking
- Audit logs
- Compliance scores
- Required documentation status

**How to access:** Click "Compliance" in the sidebar

**Common questions:**
- "Who hasn't signed HIPAA forms?" → Compliance → Pending Consents
- "When is our next audit?" → Compliance → Audit Schedule

---

## COMMON TASKS - STEP BY STEP

### How to check in a patient:
1. Go to Dashboard or Scheduling
2. Find the patient's appointment
3. Click "Check In"
4. Verify patient information
5. Collect copay if applicable
6. Assign to treatment room

### How to complete a patient visit:
1. Select patient from schedule
2. Review patient history and chief complaint
3. Perform examination
4. Create SOAP note (AI assists with documentation)
5. Add diagnosis codes (ICD-10)
6. Add procedure codes (CPT)
7. Sign and finalize note
8. Submit claim if applicable

### How to handle a new patient:
1. Go to Patients → Add New Patient
2. Enter demographics (name, DOB, contact info)
3. Enter insurance information
4. Have patient complete intake forms
5. Collect HIPAA consent
6. Schedule first appointment

### How to verify insurance:
1. Go to patient record
2. Click "Verify Insurance"
3. System checks eligibility
4. Review coverage details
5. Note any limitations or copays

---

## UNDERSTANDING DIFFERENT QUESTION PHRASINGS

Users may ask the same question in many ways. Here are examples:

**Asking about appointments:**
- "What's on my schedule today?"
- "How many patients do I have?"
- "Show me today's appointments"
- "Who's coming in today?"

**Asking about patients:**
- "How many active patients do we have?"
- "Show me new patients this month"
- "Who needs follow-up?"
- "Patients with outstanding balances"

**Asking about billing:**
- "What claims are pending?"
- "Who owes money?"
- "Show me unpaid invoices"
- "Revenue this month"

**Asking about documentation:**
- "How do I write a SOAP note?"
- "Where do I document the visit?"
- "How do I add diagnosis codes?"
- "How do I sign off on a note?"

**Asking how to do something:**
- "How do I..." / "How can I..." / "How to..."
- "Where do I..." / "Where can I..."
- "Can you show me how to..."
- "What's the process for..."
- "Walk me through..."
- "Help me with..."

Always interpret the user's intent and provide helpful guidance, whether they're asking for data or instructions.

=== END OF KNOWLEDGE BASE ===
"""

# Define the functions the AI can call
AVAILABLE_FUNCTIONS = [
    {
        "type": "function",
        "function": {
            "name": "get_dashboard_summary",
            "description": "Get a summary of key metrics for the practice dashboard including total patients, appointments, billing status, and alerts",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_today_appointments",
            "description": "Get all appointments scheduled for today with patient names, times, visit types, and status",
            "parameters": {
                "type": "object",
                "properties": {
                    "provider_id": {
                        "type": "string",
                        "description": "Optional provider ID to filter appointments for a specific provider"
                    }
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_patients",
            "description": "Search for patients by various criteria like name, status, or conditions",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Patient name to search for (partial match)"
                    },
                    "status": {
                        "type": "string",
                        "enum": ["new", "active", "inactive", "discharged"],
                        "description": "Patient status filter"
                    }
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_patient_details",
            "description": "Get detailed information about a specific patient including demographics, insurance, visit history, and conditions",
            "parameters": {
                "type": "object",
                "properties": {
                    "patient_id": {
                        "type": "string",
                        "description": "The patient ID to look up"
                    }
                },
                "required": ["patient_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_pending_claims",
            "description": "Get list of insurance claims that are pending, submitted, or need attention",
            "parameters": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "enum": ["draft", "submitted", "pending", "approved", "denied", "paid"],
                        "description": "Filter claims by status"
                    }
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_outstanding_balances",
            "description": "Get patients with outstanding balances who owe money",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_providers",
            "description": "Get list of providers (doctors, therapists) in the practice",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_unread_messages",
            "description": "Get count and list of unread messages",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_revenue_analytics",
            "description": "Get revenue and financial analytics for the practice",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_appointment_analytics",
            "description": "Get appointment statistics including completed, no-shows, and cancellations",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_compliance_status",
            "description": "Get HIPAA compliance status and pending consent forms",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_crm_help",
            "description": "Get help and instructions for using CRM features. Use this when users ask HOW to do something.",
            "parameters": {
                "type": "object",
                "properties": {
                    "topic": {
                        "type": "string",
                        "description": "The topic or feature the user needs help with (e.g., 'schedule appointment', 'create soap note', 'submit claim')"
                    }
                },
                "required": ["topic"]
            }
        }
    },
    # === SALES PROFESSIONAL FUNCTIONS ===
    {
        "type": "function",
        "function": {
            "name": "get_revenue_vs_goal",
            "description": "Get current month's revenue compared to the monthly goal. Shows if practice is on track, behind, or ahead. Use this to monitor sales performance and identify when action is needed.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_reactivation_opportunities",
            "description": "Get list of patients who haven't visited in 30+ days and are good candidates for reactivation outreach. Includes estimated revenue potential.",
            "parameters": {
                "type": "object",
                "properties": {
                    "days_inactive": {
                        "type": "integer",
                        "description": "Minimum days since last visit (default: 30)"
                    }
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_upsell_opportunities",
            "description": "Get patients who could benefit from additional services, wellness packages, or care plans. Identifies revenue growth opportunities.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_schedule_gaps",
            "description": "Find unfilled appointment slots in the schedule that represent lost revenue opportunities. Suggests patients to fill gaps.",
            "parameters": {
                "type": "object",
                "properties": {
                    "days_ahead": {
                        "type": "integer",
                        "description": "Number of days to look ahead (default: 7)"
                    }
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_sales_recommendations",
            "description": "Get AI-powered sales recommendations based on current practice data. Analyzes revenue, appointments, collections, and patient activity to suggest specific actions to increase revenue.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_collection_opportunities",
            "description": "Get patients with outstanding balances sorted by amount, with suggested collection strategies.",
            "parameters": {
                "type": "object",
                "properties": {
                    "min_balance": {
                        "type": "number",
                        "description": "Minimum balance to include (default: 50)"
                    }
                },
                "required": []
            }
        }
    }
]


def execute_function(function_name: str, arguments: Dict[str, Any], data_context: Dict[str, Any]) -> str:
    """Execute a function call and return the result as a string."""
    
    patients_db = data_context.get("patients", [])
    appointments_db = data_context.get("appointments", [])
    providers_db = data_context.get("providers", [])
    claims_db = data_context.get("claims", [])
    payments_db = data_context.get("payments", [])
    messages_db = data_context.get("messages", [])
    
    if function_name == "get_dashboard_summary":
        today = datetime.now().strftime("%Y-%m-%d")
        today_appointments = [a for a in appointments_db if a.get("date") == today]
        
        summary = {
            "total_patients": len(patients_db),
            "active_patients": len([p for p in patients_db if p.get("status") == "active"]),
            "new_patients": len([p for p in patients_db if p.get("status") == "new"]),
            "today_appointments": len(today_appointments),
            "checked_in": len([a for a in today_appointments if a.get("status") == "checked_in"]),
            "completed_today": len([a for a in today_appointments if a.get("status") == "completed"]),
            "pending_claims": len([c for c in claims_db if c.get("status") in ["submitted", "pending"]]),
            "outstanding_balance": sum(p.get("balance", 0) for p in patients_db),
            "unread_messages": len([m for m in messages_db if not m.get("read", False)])
        }
        return json.dumps(summary, indent=2)
    
    elif function_name == "get_today_appointments":
        today = datetime.now().strftime("%Y-%m-%d")
        provider_id = arguments.get("provider_id")
        
        appointments = [a for a in appointments_db if a.get("date") == today]
        if provider_id:
            appointments = [a for a in appointments if a.get("provider_id") == provider_id]
        
        result = []
        for apt in sorted(appointments, key=lambda x: x.get("start_time", "")):
            result.append({
                "time": apt.get("start_time"),
                "patient": apt.get("patient_name"),
                "visit_type": apt.get("visit_type"),
                "status": apt.get("status"),
                "provider": apt.get("provider_name"),
                "chief_complaint": apt.get("chief_complaint")
            })
        
        return json.dumps(result, indent=2)
    
    elif function_name == "search_patients":
        name = arguments.get("name", "").lower()
        status = arguments.get("status")
        
        results = patients_db
        if name:
            results = [p for p in results if name in p.get("first_name", "").lower() or name in p.get("last_name", "").lower()]
        if status:
            results = [p for p in results if p.get("status") == status]
        
        patient_list = []
        for p in results[:10]:  # Limit to 10 results
            patient_list.append({
                "id": p.get("id"),
                "name": f"{p.get('first_name')} {p.get('last_name')}",
                "status": p.get("status"),
                "chief_complaint": p.get("chief_complaint"),
                "last_visit": p.get("last_visit"),
                "balance": p.get("balance", 0)
            })
        
        return json.dumps(patient_list, indent=2)
    
    elif function_name == "get_patient_details":
        patient_id = arguments.get("patient_id")
        patient = next((p for p in patients_db if p.get("id") == patient_id), None)
        
        if not patient:
            return json.dumps({"error": "Patient not found"})
        
        return json.dumps({
            "id": patient.get("id"),
            "name": f"{patient.get('first_name')} {patient.get('last_name')}",
            "date_of_birth": patient.get("date_of_birth"),
            "phone": patient.get("phone"),
            "email": patient.get("email"),
            "address": f"{patient.get('address')}, {patient.get('city')}, {patient.get('state')} {patient.get('zip_code')}",
            "status": patient.get("status"),
            "chief_complaint": patient.get("chief_complaint"),
            "insurance": patient.get("primary_insurance"),
            "insurance_id": patient.get("insurance_id"),
            "last_visit": patient.get("last_visit"),
            "balance": patient.get("balance", 0),
            "intake_complete": patient.get("intake_complete"),
            "hipaa_signed": patient.get("hipaa_signed")
        }, indent=2)
    
    elif function_name == "get_pending_claims":
        status = arguments.get("status")
        
        claims = claims_db
        if status:
            claims = [c for c in claims if c.get("status") == status]
        else:
            claims = [c for c in claims if c.get("status") in ["submitted", "pending"]]
        
        result = []
        for c in claims:
            result.append({
                "id": c.get("id"),
                "patient": c.get("patient_name"),
                "date_of_service": c.get("date_of_service"),
                "amount": c.get("total_amount"),
                "insurance": c.get("insurance_name"),
                "status": c.get("status")
            })
        
        return json.dumps(result, indent=2)
    
    elif function_name == "get_outstanding_balances":
        patients_with_balance = [p for p in patients_db if p.get("balance", 0) > 0]
        
        result = []
        for p in sorted(patients_with_balance, key=lambda x: x.get("balance", 0), reverse=True):
            result.append({
                "patient": f"{p.get('first_name')} {p.get('last_name')}",
                "balance": p.get("balance"),
                "last_visit": p.get("last_visit"),
                "phone": p.get("phone")
            })
        
        return json.dumps(result, indent=2)
    
    elif function_name == "get_providers":
        result = []
        for p in providers_db:
            result.append({
                "id": p.get("id"),
                "name": f"{p.get('title')} {p.get('first_name')} {p.get('last_name')}",
                "specialty": p.get("specialty"),
                "email": p.get("email")
            })
        
        return json.dumps(result, indent=2)
    
    elif function_name == "get_unread_messages":
        unread = [m for m in messages_db if not m.get("read", False)]
        
        result = {
            "count": len(unread),
            "messages": []
        }
        
        for m in unread[:5]:  # Show first 5
            result["messages"].append({
                "from": m.get("sender_name"),
                "subject": m.get("subject"),
                "sent_at": m.get("sent_at")
            })
        
        return json.dumps(result, indent=2)
    
    elif function_name == "get_revenue_analytics":
        total_payments = sum(p.get("amount", 0) for p in payments_db)
        total_claims = sum(c.get("total_amount", 0) for c in claims_db)
        paid_claims = sum(c.get("paid_amount", 0) for c in claims_db if c.get("paid_amount"))
        
        return json.dumps({
            "total_revenue_this_month": round(total_payments, 2),
            "total_claims_submitted": round(total_claims, 2),
            "total_claims_paid": round(paid_claims, 2),
            "outstanding_patient_balances": round(sum(p.get("balance", 0) for p in patients_db), 2),
            "average_payment": round(total_payments / max(len(payments_db), 1), 2)
        }, indent=2)
    
    elif function_name == "get_appointment_analytics":
        today = datetime.now().strftime("%Y-%m-%d")
        today_apts = [a for a in appointments_db if a.get("date") == today]
        
        return json.dumps({
            "total_today": len(today_apts),
            "confirmed": len([a for a in today_apts if a.get("status") == "confirmed"]),
            "checked_in": len([a for a in today_apts if a.get("status") == "checked_in"]),
            "completed": len([a for a in today_apts if a.get("status") == "completed"]),
            "no_shows": len([a for a in today_apts if a.get("status") == "no_show"]),
            "cancelled": len([a for a in today_apts if a.get("status") == "cancelled"])
        }, indent=2)
    
    elif function_name == "get_compliance_status":
        hipaa_signed = len([p for p in patients_db if p.get("hipaa_signed")])
        hipaa_pending = len([p for p in patients_db if not p.get("hipaa_signed")])
        consent_signed = len([p for p in patients_db if p.get("consent_signed")])
        consent_pending = len([p for p in patients_db if not p.get("consent_signed")])
        
        return json.dumps({
            "hipaa_forms_signed": hipaa_signed,
            "hipaa_forms_pending": hipaa_pending,
            "consent_forms_signed": consent_signed,
            "consent_forms_pending": consent_pending,
            "compliance_score": round((hipaa_signed + consent_signed) / max((len(patients_db) * 2), 1) * 100)
        }, indent=2)
    
    elif function_name == "get_crm_help":
        topic = arguments.get("topic", "").lower()
        
        help_topics = {
            "schedule": """To schedule an appointment:
1. Go to Scheduling in the sidebar
2. Click on an available time slot
3. Select the patient (or add new patient)
4. Choose visit type (New Patient Exam, Adjustment, etc.)
5. Select provider
6. Confirm the appointment""",
            
            "appointment": """To manage appointments:
- View: Go to Scheduling or Dashboard
- Create: Click on time slot → Fill details → Save
- Reschedule: Drag appointment to new time
- Cancel: Click appointment → Cancel
- Check-in: Click appointment → Check In""",
            
            "soap": """To create a SOAP note:
1. Select patient from schedule or patient list
2. Click "Start Visit" or "New SOAP Note"
3. AI will generate a draft based on patient history
4. Review and edit each section:
   - Subjective: Patient's complaints and history
   - Objective: Your examination findings
   - Assessment: Diagnosis and evaluation
   - Plan: Treatment plan and follow-up
5. Add diagnosis codes (ICD-10)
6. Add procedure codes (CPT)
7. Click "Sign" to finalize""",
            
            "claim": """To submit an insurance claim:
1. Go to Billing in the sidebar
2. Click "New Claim" or select from unsigned notes
3. Verify patient and insurance information
4. Review diagnosis codes (ICD-10)
5. Review procedure codes (CPT)
6. Click "Submit Claim"
7. Track status in Claims list""",
            
            "payment": """To record a payment:
1. Go to Billing in the sidebar
2. Click "Record Payment"
3. Select patient
4. Enter payment amount
5. Select payment method (cash, card, check, etc.)
6. Add description if needed
7. Save payment""",
            
            "patient": """To add a new patient:
1. Go to Patients or click "Add Patient"
2. Enter demographics (name, DOB, contact)
3. Enter insurance information
4. Have patient complete intake forms
5. Collect HIPAA consent signature
6. Schedule first appointment""",
            
            "message": """To send a message:
1. Go to Communication in the sidebar
2. Click "New Message"
3. Select recipient (patient or staff)
4. Enter subject and message
5. Click Send""",
            
            "check-in": """To check in a patient:
1. Find appointment on Dashboard or Schedule
2. Click "Check In" button
3. Verify patient information
4. Collect copay if applicable
5. Assign to treatment room
6. Patient is ready for provider"""
        }
        
        # Find matching help topic
        for key, value in help_topics.items():
            if key in topic:
                return value
        
        # Default help
        return """I can help you with:
- Scheduling appointments
- Creating SOAP notes
- Submitting insurance claims
- Recording payments
- Adding new patients
- Sending messages
- Checking in patients

What would you like help with?"""
    
    # === SALES PROFESSIONAL FUNCTION IMPLEMENTATIONS ===
    
    elif function_name == "get_revenue_vs_goal":
        # Monthly revenue goal (configurable - default $50,000 for a chiropractic practice)
        monthly_goal = data_context.get("monthly_revenue_goal", 50000)
        
        # Calculate current month's revenue
        today = datetime.now()
        current_month = today.month
        current_year = today.year
        days_in_month = 30  # Simplified
        days_elapsed = today.day
        days_remaining = days_in_month - days_elapsed
        
        # Sum payments for current month
        current_revenue = sum(p.get("amount", 0) for p in payments_db)
        
        # Calculate projections
        daily_average = current_revenue / max(days_elapsed, 1)
        projected_month_end = current_revenue + (daily_average * days_remaining)
        
        # Calculate required daily revenue to hit goal
        revenue_needed = monthly_goal - current_revenue
        required_daily = revenue_needed / max(days_remaining, 1)
        
        # Determine status
        on_track_pace = (current_revenue / days_elapsed) * days_in_month if days_elapsed > 0 else 0
        percent_of_goal = (current_revenue / monthly_goal) * 100
        percent_of_month = (days_elapsed / days_in_month) * 100
        
        if percent_of_goal >= percent_of_month:
            status = "ON_TRACK"
            status_message = "You're on track to hit your monthly goal!"
        elif projected_month_end >= monthly_goal * 0.9:
            status = "SLIGHTLY_BEHIND"
            status_message = f"You're slightly behind. Need ${required_daily:.0f}/day to hit goal."
        else:
            status = "BEHIND"
            status_message = f"ALERT: You're behind pace. Need ${required_daily:.0f}/day to hit goal."
        
        return json.dumps({
            "monthly_goal": monthly_goal,
            "current_revenue": round(current_revenue, 2),
            "days_elapsed": days_elapsed,
            "days_remaining": days_remaining,
            "daily_average": round(daily_average, 2),
            "projected_month_end": round(projected_month_end, 2),
            "revenue_needed": round(revenue_needed, 2),
            "required_daily_to_hit_goal": round(required_daily, 2),
            "percent_of_goal_achieved": round(percent_of_goal, 1),
            "percent_of_month_elapsed": round(percent_of_month, 1),
            "status": status,
            "status_message": status_message
        }, indent=2)
    
    elif function_name == "get_reactivation_opportunities":
        days_inactive = arguments.get("days_inactive", 30)
        today = datetime.now()
        cutoff_date = (today - timedelta(days=days_inactive)).strftime("%Y-%m-%d")
        
        # Find patients who haven't visited recently
        reactivation_candidates = []
        for p in patients_db:
            last_visit = p.get("last_visit")
            if last_visit and last_visit < cutoff_date and p.get("status") in ["active", "inactive"]:
                # Estimate revenue potential based on average visit value
                avg_visit_value = 150  # Default chiropractic visit value
                if p.get("primary_insurance"):
                    avg_visit_value = 175  # Insured patients typically higher
                
                days_since_visit = (today - datetime.strptime(last_visit, "%Y-%m-%d")).days
                
                reactivation_candidates.append({
                    "patient_id": p.get("id"),
                    "name": f"{p.get('first_name')} {p.get('last_name')}",
                    "phone": p.get("phone"),
                    "email": p.get("email"),
                    "last_visit": last_visit,
                    "days_since_visit": days_since_visit,
                    "chief_complaint": p.get("chief_complaint"),
                    "estimated_visit_value": avg_visit_value,
                    "has_insurance": bool(p.get("primary_insurance")),
                    "outstanding_balance": p.get("balance", 0)
                })
        
        # Sort by estimated value (prioritize high-value patients)
        reactivation_candidates.sort(key=lambda x: x["estimated_visit_value"], reverse=True)
        
        total_potential_revenue = sum(c["estimated_visit_value"] for c in reactivation_candidates)
        
        return json.dumps({
            "total_reactivation_candidates": len(reactivation_candidates),
            "total_potential_revenue": total_potential_revenue,
            "days_inactive_threshold": days_inactive,
            "priority_patients": reactivation_candidates[:10],  # Top 10
            "recommendation": f"Call these {min(len(reactivation_candidates), 10)} patients this week. Potential revenue: ${total_potential_revenue}"
        }, indent=2)
    
    elif function_name == "get_upsell_opportunities":
        upsell_candidates = []
        
        for p in patients_db:
            opportunities = []
            estimated_additional_revenue = 0
            
            # Check if patient is active and could benefit from wellness plan
            if p.get("status") == "active":
                # Wellness care package opportunity
                if p.get("visit_count", 0) >= 3:
                    opportunities.append({
                        "type": "wellness_package",
                        "description": "Monthly wellness care plan ($199/month)",
                        "potential_revenue": 199
                    })
                    estimated_additional_revenue += 199
                
                # Family plan opportunity (if has dependents)
                if p.get("has_dependents"):
                    opportunities.append({
                        "type": "family_plan",
                        "description": "Family wellness plan - 20% discount for family members",
                        "potential_revenue": 150
                    })
                    estimated_additional_revenue += 150
                
                # Add-on services
                if p.get("chief_complaint") and "back" in p.get("chief_complaint", "").lower():
                    opportunities.append({
                        "type": "add_on_service",
                        "description": "Spinal decompression therapy ($75/session)",
                        "potential_revenue": 75
                    })
                    estimated_additional_revenue += 75
                
                # Prepaid package for frequent visitors
                if p.get("visit_count", 0) >= 5:
                    opportunities.append({
                        "type": "prepaid_package",
                        "description": "10-visit prepaid package ($1,200 - saves $300)",
                        "potential_revenue": 1200
                    })
                    estimated_additional_revenue += 1200
            
            if opportunities:
                upsell_candidates.append({
                    "patient_id": p.get("id"),
                    "name": f"{p.get('first_name')} {p.get('last_name')}",
                    "current_status": p.get("status"),
                    "visit_count": p.get("visit_count", 0),
                    "opportunities": opportunities,
                    "total_potential_revenue": estimated_additional_revenue
                })
        
        # Sort by potential revenue
        upsell_candidates.sort(key=lambda x: x["total_potential_revenue"], reverse=True)
        
        total_upsell_potential = sum(c["total_potential_revenue"] for c in upsell_candidates)
        
        return json.dumps({
            "total_upsell_candidates": len(upsell_candidates),
            "total_potential_revenue": total_upsell_potential,
            "top_opportunities": upsell_candidates[:10],
            "recommendation": f"Focus on these {min(len(upsell_candidates), 10)} patients for upselling. Total potential: ${total_upsell_potential}"
        }, indent=2)
    
    elif function_name == "get_schedule_gaps":
        days_ahead = arguments.get("days_ahead", 7)
        today = datetime.now()
        
        # Define business hours and slot duration
        business_hours = [(9, 12), (14, 18)]  # 9am-12pm, 2pm-6pm
        slot_duration = 30  # minutes
        
        gaps = []
        total_lost_revenue = 0
        avg_appointment_value = 125
        
        for day_offset in range(days_ahead):
            check_date = (today + timedelta(days=day_offset)).strftime("%Y-%m-%d")
            day_appointments = [a for a in appointments_db if a.get("date") == check_date]
            booked_times = [a.get("start_time") for a in day_appointments]
            
            # Find gaps in schedule
            for start_hour, end_hour in business_hours:
                for hour in range(start_hour, end_hour):
                    for minute in [0, 30]:
                        time_slot = f"{hour:02d}:{minute:02d}"
                        if time_slot not in booked_times:
                            gaps.append({
                                "date": check_date,
                                "time": time_slot,
                                "lost_revenue": avg_appointment_value
                            })
                            total_lost_revenue += avg_appointment_value
        
        # Find patients who could fill gaps (due for follow-up, reactivation candidates)
        suggested_patients = []
        for p in patients_db:
            if p.get("status") in ["active", "new"] and p.get("last_visit"):
                suggested_patients.append({
                    "name": f"{p.get('first_name')} {p.get('last_name')}",
                    "phone": p.get("phone"),
                    "reason": "Due for follow-up"
                })
        
        return json.dumps({
            "total_gaps": len(gaps),
            "days_analyzed": days_ahead,
            "total_potential_lost_revenue": total_lost_revenue,
            "gaps_by_day": gaps[:20],  # First 20 gaps
            "suggested_patients_to_call": suggested_patients[:5],
            "recommendation": f"You have {len(gaps)} unfilled slots in the next {days_ahead} days. Potential lost revenue: ${total_lost_revenue}. Call these patients to fill gaps."
        }, indent=2)
    
    elif function_name == "get_sales_recommendations":
        # Comprehensive sales analysis
        today = datetime.now()
        
        # Revenue analysis
        monthly_goal = data_context.get("monthly_revenue_goal", 50000)
        current_revenue = sum(p.get("amount", 0) for p in payments_db)
        days_elapsed = today.day
        days_remaining = 30 - days_elapsed
        
        # Patient analysis
        total_patients = len(patients_db)
        active_patients = len([p for p in patients_db if p.get("status") == "active"])
        inactive_patients = len([p for p in patients_db if p.get("status") == "inactive"])
        
        # Outstanding balances
        total_outstanding = sum(p.get("balance", 0) for p in patients_db)
        patients_with_balance = len([p for p in patients_db if p.get("balance", 0) > 0])
        
        # Appointment analysis
        today_str = today.strftime("%Y-%m-%d")
        today_appointments = len([a for a in appointments_db if a.get("date") == today_str])
        
        # Generate recommendations
        recommendations = []
        priority = 1
        
        # Check if behind on revenue
        expected_revenue = (monthly_goal / 30) * days_elapsed
        if current_revenue < expected_revenue * 0.9:
            gap = expected_revenue - current_revenue
            recommendations.append({
                "priority": priority,
                "category": "REVENUE_GAP",
                "title": "Revenue Behind Target",
                "description": f"You're ${gap:.0f} behind where you should be. Need to generate ${(monthly_goal - current_revenue) / max(days_remaining, 1):.0f}/day to hit goal.",
                "actions": [
                    "Call inactive patients for reactivation",
                    "Offer same-week appointment specials",
                    "Promote wellness packages to existing patients"
                ],
                "potential_impact": gap
            })
            priority += 1
        
        # Check outstanding balances
        if total_outstanding > 1000:
            recommendations.append({
                "priority": priority,
                "category": "COLLECTIONS",
                "title": f"${total_outstanding:.0f} in Outstanding Balances",
                "description": f"{patients_with_balance} patients have unpaid balances. This is immediate recoverable revenue.",
                "actions": [
                    "Send payment reminder emails today",
                    "Offer payment plans for balances over $200",
                    "Call top 5 highest balance patients"
                ],
                "potential_impact": total_outstanding
            })
            priority += 1
        
        # Check inactive patients
        if inactive_patients > 5:
            potential_reactivation_revenue = inactive_patients * 150
            recommendations.append({
                "priority": priority,
                "category": "REACTIVATION",
                "title": f"{inactive_patients} Inactive Patients to Reactivate",
                "description": f"These patients haven't visited recently. Potential revenue: ${potential_reactivation_revenue}",
                "actions": [
                    "Send 'We miss you' email campaign",
                    "Offer returning patient discount",
                    "Personal phone calls to top 10 patients"
                ],
                "potential_impact": potential_reactivation_revenue
            })
            priority += 1
        
        # Check appointment volume
        if today_appointments < 8:
            recommendations.append({
                "priority": priority,
                "category": "SCHEDULING",
                "title": "Low Appointment Volume Today",
                "description": f"Only {today_appointments} appointments scheduled. Target is 12-15 per day.",
                "actions": [
                    "Post same-day availability on social media",
                    "Call patients due for follow-up",
                    "Offer telehealth consultations"
                ],
                "potential_impact": (12 - today_appointments) * 125
            })
            priority += 1
        
        # Always suggest upselling
        recommendations.append({
            "priority": priority,
            "category": "UPSELLING",
            "title": "Upsell Opportunities",
            "description": "Increase revenue per patient with additional services and packages.",
            "actions": [
                "Mention wellness packages to every patient today",
                "Offer family plans to patients with dependents",
                "Promote prepaid visit packages (10-visit cards)"
            ],
            "potential_impact": active_patients * 50  # Avg $50 upsell per active patient
        })
        
        total_potential = sum(r["potential_impact"] for r in recommendations)
        
        return json.dumps({
            "summary": {
                "current_revenue": current_revenue,
                "monthly_goal": monthly_goal,
                "days_remaining": days_remaining,
                "total_outstanding": total_outstanding,
                "active_patients": active_patients,
                "inactive_patients": inactive_patients
            },
            "recommendations": recommendations,
            "total_potential_revenue": total_potential,
            "top_action": recommendations[0]["actions"][0] if recommendations else "Keep up the great work!"
        }, indent=2)
    
    elif function_name == "get_collection_opportunities":
        min_balance = arguments.get("min_balance", 50)
        
        patients_with_balance = [
            p for p in patients_db 
            if p.get("balance", 0) >= min_balance
        ]
        
        collection_list = []
        for p in sorted(patients_with_balance, key=lambda x: x.get("balance", 0), reverse=True):
            balance = p.get("balance", 0)
            
            # Determine collection strategy based on balance
            if balance >= 500:
                strategy = "High Priority - Personal phone call, offer payment plan"
            elif balance >= 200:
                strategy = "Medium Priority - Send statement with payment plan option"
            else:
                strategy = "Standard - Send payment reminder email"
            
            collection_list.append({
                "patient_id": p.get("id"),
                "name": f"{p.get('first_name')} {p.get('last_name')}",
                "phone": p.get("phone"),
                "email": p.get("email"),
                "balance": balance,
                "last_visit": p.get("last_visit"),
                "has_insurance": bool(p.get("primary_insurance")),
                "recommended_strategy": strategy
            })
        
        total_collectible = sum(p["balance"] for p in collection_list)
        
        return json.dumps({
            "total_patients_with_balance": len(collection_list),
            "total_collectible_amount": total_collectible,
            "minimum_balance_threshold": min_balance,
            "collection_list": collection_list[:15],  # Top 15
            "recommendation": f"Focus on collecting ${total_collectible:.0f} from {len(collection_list)} patients. Start with the highest balances."
        }, indent=2)
    
    return json.dumps({"error": f"Unknown function: {function_name}"})


def chat_with_auvora(message: str, data_context: Dict[str, Any], conversation_history: List[Dict] = None) -> str:
    """
    Process a chat message and return the AI response.
    
    Args:
        message: The user's message
        data_context: Dictionary containing current data (patients, appointments, etc.)
        conversation_history: Optional list of previous messages for context
    
    Returns:
        The AI assistant's response
    """
    try:
        client = get_openai_client()
    except ValueError as e:
        return f"AI Assistant is not fully configured: {str(e)}. Please set the OPENAI_API_KEY environment variable."
    
    # Build messages array
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # Add conversation history if provided
    if conversation_history:
        messages.extend(conversation_history[-10:])  # Keep last 10 messages for context
    
    # Add current message
    messages.append({"role": "user", "content": message})
    
    try:
        # First API call - may include function calls
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=AVAILABLE_FUNCTIONS,
            tool_choice="auto",
            temperature=0.7,
            max_tokens=2000
        )
        
        assistant_message = response.choices[0].message
        
        # Check if the model wants to call functions
        if assistant_message.tool_calls:
            # Execute each function call
            messages.append(assistant_message)
            
            for tool_call in assistant_message.tool_calls:
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)
                
                # Execute the function
                function_result = execute_function(function_name, arguments, data_context)
                
                # Add function result to messages
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": function_result
                })
            
            # Get final response after function calls
            final_response = client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                temperature=0.7,
                max_tokens=2000
            )
            
            return final_response.choices[0].message.content
        
        # No function calls, return direct response
        return assistant_message.content
        
    except Exception as e:
        return f"I encountered an error processing your request: {str(e)}. Please try again."
