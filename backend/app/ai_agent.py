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
SYSTEM_PROMPT = """You are Auvora, an intelligent AI assistant for a chiropractic and wellness practice CRM. You help practice owners, providers (chiropractors, physical therapists, massage therapists), front desk staff, and patients manage their practice operations.

Your personality:
- Professional yet warm and approachable
- Knowledgeable about chiropractic care, physical therapy, and wellness practices
- Proactive in offering insights and suggestions
- Clear and concise in your responses
- Patient when explaining how to use the CRM
- Able to understand questions asked in many different ways
- HIPAA-conscious - never share patient information inappropriately

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
