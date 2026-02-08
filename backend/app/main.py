from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date, time, timedelta
from enum import Enum
import random
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Auvora Wellness CRM API", version="1.0.0")

# CORS configuration - DO NOT MODIFY
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# ENUMS AND MODELS
# ============================================================================

class UserRole(str, Enum):
    ADMIN = "admin"
    PROVIDER = "provider"
    FRONT_DESK = "front_desk"
    PATIENT = "patient"

class PracticeType(str, Enum):
    CHIROPRACTIC = "chiropractic"
    PHYSICAL_THERAPY = "physical_therapy"
    MASSAGE = "massage"
    WELLNESS_SPA = "wellness_spa"

class AppointmentStatus(str, Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    CHECKED_IN = "checked_in"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"

class PatientStatus(str, Enum):
    NEW = "new"
    ACTIVE = "active"
    INACTIVE = "inactive"
    DISCHARGED = "discharged"

class ClaimStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    PENDING = "pending"
    APPROVED = "approved"
    DENIED = "denied"
    PAID = "paid"

class PaymentMethod(str, Enum):
    CASH = "cash"
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    CHECK = "check"
    INSURANCE = "insurance"
    HSA = "hsa"

# Pydantic Models
class Patient(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    date_of_birth: str
    gender: str
    address: str
    city: str
    state: str
    zip_code: str
    status: PatientStatus
    primary_insurance: Optional[str] = None
    insurance_id: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    chief_complaint: Optional[str] = None
    referral_source: Optional[str] = None
    created_at: str
    last_visit: Optional[str] = None
    next_appointment: Optional[str] = None
    balance: float = 0.0
    notes: Optional[str] = None
    intake_complete: bool = False
    hipaa_signed: bool = False
    consent_signed: bool = False

class Provider(BaseModel):
    id: str
    first_name: str
    last_name: str
    title: str
    specialty: str
    email: str
    phone: str
    npi: str
    license_number: str
    color: str
    active: bool = True

class Appointment(BaseModel):
    id: str
    patient_id: str
    patient_name: str
    provider_id: str
    provider_name: str
    date: str
    start_time: str
    end_time: str
    duration: int
    visit_type: str
    status: AppointmentStatus
    chief_complaint: Optional[str] = None
    notes: Optional[str] = None
    room: Optional[str] = None
    confirmed_at: Optional[str] = None
    checked_in_at: Optional[str] = None

class SOAPNote(BaseModel):
    id: str
    patient_id: str
    provider_id: str
    appointment_id: str
    date: str
    subjective: str
    objective: str
    assessment: str
    plan: str
    diagnosis_codes: List[str]
    procedure_codes: List[str]
    signed: bool = False
    signed_at: Optional[str] = None
    ai_generated: bool = False

class InsuranceClaim(BaseModel):
    id: str
    patient_id: str
    patient_name: str
    provider_id: str
    date_of_service: str
    diagnosis_codes: List[str]
    procedure_codes: List[str]
    total_amount: float
    insurance_name: str
    status: ClaimStatus
    submitted_at: Optional[str] = None
    paid_amount: Optional[float] = None
    denial_reason: Optional[str] = None

class Payment(BaseModel):
    id: str
    patient_id: str
    patient_name: str
    amount: float
    method: PaymentMethod
    date: str
    description: str
    claim_id: Optional[str] = None

class Message(BaseModel):
    id: str
    sender_id: str
    sender_name: str
    sender_role: UserRole
    recipient_id: str
    recipient_name: str
    recipient_role: UserRole
    subject: str
    content: str
    sent_at: str
    read: bool = False
    read_at: Optional[str] = None

class VisitType(BaseModel):
    id: str
    name: str
    duration: int
    color: str
    description: str
    default_fee: float

class Room(BaseModel):
    id: str
    name: str
    type: str
    available: bool = True

# ============================================================================
# DEMO DATA - CHIROPRACTIC PRACTICE: "Unwind Chiropractic & Wellness"
# ============================================================================

practice_config = {
    "name": "Unwind Chiropractic & Wellness",
    "type": PracticeType.CHIROPRACTIC,
    "address": "4521 Wellness Way, Suite 200",
    "city": "Tampa",
    "state": "FL",
    "zip": "33609",
    "phone": "(813) 555-WELL",
    "email": "info@unwindchiro.com",
    "website": "www.unwindchiro.com",
    "primary_color": "#0D9488",
    "secondary_color": "#10B981",
    "slogan": "Align Your Life"
}

# Providers
providers_db: List[Provider] = [
    Provider(
        id="prov_001",
        first_name="Jamie",
        last_name="Smith",
        title="DC",
        specialty="Chiropractic",
        email="dr.smith@unwindchiro.com",
        phone="(813) 555-0101",
        npi="1234567890",
        license_number="CH12345",
        color="#0D9488",
        active=True
    ),
    Provider(
        id="prov_002",
        first_name="Sarah",
        last_name="Johnson",
        title="DC",
        specialty="Sports Chiropractic",
        email="dr.johnson@unwindchiro.com",
        phone="(813) 555-0102",
        npi="0987654321",
        license_number="CH54321",
        color="#6366F1",
        active=True
    ),
    Provider(
        id="prov_003",
        first_name="Michael",
        last_name="Chen",
        title="LMT",
        specialty="Massage Therapy",
        email="michael@unwindchiro.com",
        phone="(813) 555-0103",
        npi="1122334455",
        license_number="MA98765",
        color="#F59E0B",
        active=True
    )
]

# Visit Types
visit_types_db: List[VisitType] = [
    VisitType(id="vt_001", name="New Patient Exam", duration=60, color="#EF4444", description="Comprehensive initial evaluation", default_fee=150.00),
    VisitType(id="vt_002", name="Adjustment", duration=15, color="#10B981", description="Spinal manipulation treatment", default_fee=65.00),
    VisitType(id="vt_003", name="Re-examination", duration=30, color="#F59E0B", description="Progress evaluation", default_fee=85.00),
    VisitType(id="vt_004", name="Wellness Visit", duration=20, color="#6366F1", description="Maintenance care", default_fee=55.00),
    VisitType(id="vt_005", name="Massage Therapy", duration=60, color="#EC4899", description="Therapeutic massage", default_fee=95.00),
    VisitType(id="vt_006", name="Telehealth", duration=30, color="#8B5CF6", description="Virtual consultation", default_fee=75.00),
    VisitType(id="vt_007", name="X-Ray Review", duration=15, color="#14B8A6", description="Imaging review and consultation", default_fee=45.00),
    VisitType(id="vt_008", name="Decompression", duration=30, color="#0EA5E9", description="Spinal decompression therapy", default_fee=85.00),
]

# Rooms
rooms_db: List[Room] = [
    Room(id="room_001", name="Adjustment Room 1", type="treatment", available=True),
    Room(id="room_002", name="Adjustment Room 2", type="treatment", available=True),
    Room(id="room_003", name="Exam Room", type="exam", available=True),
    Room(id="room_004", name="X-Ray Suite", type="imaging", available=True),
    Room(id="room_005", name="Massage Room 1", type="massage", available=True),
    Room(id="room_006", name="Massage Room 2", type="massage", available=True),
    Room(id="room_007", name="Decompression Room", type="therapy", available=True),
]

# Generate Patients
def generate_patients() -> List[Patient]:
    first_names = ["John", "Maria", "Mark", "Lisa", "Brian", "Jennifer", "David", "Sarah", "Michael", "Emily",
                   "Robert", "Amanda", "James", "Nicole", "William", "Ashley", "Christopher", "Stephanie", "Daniel", "Michelle"]
    last_names = ["Doe", "Lopez", "Chen", "Patel", "Evans", "Williams", "Martinez", "Johnson", "Brown", "Davis",
                  "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"]
    
    complaints = [
        "Lower back pain", "Neck pain", "Headaches", "Shoulder pain", "Sciatica",
        "Hip pain", "Mid-back pain", "Posture issues", "Sports injury", "Whiplash",
        "Chronic pain", "Muscle tension", "Joint stiffness", "Numbness/tingling", "Wellness maintenance"
    ]
    
    referral_sources = ["Google Search", "Friend/Family", "Insurance Directory", "Social Media", "Walk-in", "Doctor Referral", "Existing Patient"]
    insurances = ["Blue Cross Blue Shield", "Aetna", "United Healthcare", "Cigna", "Humana", "Medicare", "Self-Pay", "Tricare"]
    
    patients = []
    statuses = [PatientStatus.ACTIVE] * 15 + [PatientStatus.NEW] * 3 + [PatientStatus.INACTIVE] * 2
    
    for i in range(20):
        first = random.choice(first_names)
        last = random.choice(last_names)
        status = statuses[i] if i < len(statuses) else random.choice(list(PatientStatus))
        
        dob_year = random.randint(1955, 2005)
        dob_month = random.randint(1, 12)
        dob_day = random.randint(1, 28)
        
        created_days_ago = random.randint(1, 365)
        created_date = datetime.now() - timedelta(days=created_days_ago)
        
        last_visit_days = random.randint(1, 60) if status == PatientStatus.ACTIVE else random.randint(90, 180)
        last_visit = (datetime.now() - timedelta(days=last_visit_days)).strftime("%Y-%m-%d") if status != PatientStatus.NEW else None
        
        intake_complete = status != PatientStatus.NEW or random.random() > 0.5
        
        patients.append(Patient(
            id=f"pat_{i+1:03d}",
            first_name=first,
            last_name=last,
            email=f"{first.lower()}.{last.lower()}@email.com",
            phone=f"(813) 555-{random.randint(1000, 9999)}",
            date_of_birth=f"{dob_year}-{dob_month:02d}-{dob_day:02d}",
            gender=random.choice(["Male", "Female"]),
            address=f"{random.randint(100, 9999)} {random.choice(['Oak', 'Main', 'Elm', 'Park', 'Lake'])} {random.choice(['St', 'Ave', 'Blvd', 'Dr'])}",
            city="Tampa",
            state="FL",
            zip_code=f"336{random.randint(10, 99)}",
            status=status,
            primary_insurance=random.choice(insurances),
            insurance_id=f"INS{random.randint(100000, 999999)}",
            emergency_contact_name=f"{random.choice(first_names)} {last}",
            emergency_contact_phone=f"(813) 555-{random.randint(1000, 9999)}",
            chief_complaint=random.choice(complaints),
            referral_source=random.choice(referral_sources),
            created_at=created_date.strftime("%Y-%m-%d"),
            last_visit=last_visit,
            balance=round(random.uniform(0, 200), 2) if random.random() > 0.7 else 0.0,
            intake_complete=intake_complete,
            hipaa_signed=intake_complete,
            consent_signed=intake_complete
        ))
    
    return patients

patients_db = generate_patients()

# Generate Today's Appointments
def generate_appointments() -> List[Appointment]:
    today = datetime.now().strftime("%Y-%m-%d")
    appointments = []
    
    time_slots = [
        ("09:00", "09:15"), ("09:15", "09:30"), ("09:30", "10:30"),
        ("10:30", "10:45"), ("11:00", "11:15"), ("11:15", "11:30"),
        ("13:00", "13:15"), ("13:30", "14:30"), ("14:30", "14:45"),
        ("15:00", "15:15"), ("15:30", "16:00"), ("16:00", "16:15")
    ]
    
    visit_type_options = ["Adjustment", "New Patient Exam", "Re-examination", "Wellness Visit", "Massage Therapy", "Telehealth"]
    statuses = [AppointmentStatus.CONFIRMED] * 6 + [AppointmentStatus.SCHEDULED] * 3 + [AppointmentStatus.CHECKED_IN] * 2 + [AppointmentStatus.COMPLETED] * 1
    
    for i, (start, end) in enumerate(time_slots):
        if i >= len(patients_db):
            break
            
        patient = patients_db[i]
        provider = random.choice(providers_db[:2])  # Only doctors for most visits
        visit_type = random.choice(visit_type_options)
        
        if visit_type == "Massage Therapy":
            provider = providers_db[2]  # Massage therapist
        
        status = statuses[i] if i < len(statuses) else AppointmentStatus.SCHEDULED
        
        appointments.append(Appointment(
            id=f"apt_{i+1:03d}",
            patient_id=patient.id,
            patient_name=f"{patient.first_name} {patient.last_name}",
            provider_id=provider.id,
            provider_name=f"{provider.title} {provider.first_name} {provider.last_name}",
            date=today,
            start_time=start,
            end_time=end,
            duration=15 if visit_type == "Adjustment" else 60 if visit_type in ["New Patient Exam", "Massage Therapy"] else 30,
            visit_type=visit_type,
            status=status,
            chief_complaint=patient.chief_complaint,
            room=random.choice(rooms_db[:3]).name if status in [AppointmentStatus.CHECKED_IN, AppointmentStatus.IN_PROGRESS] else None,
            confirmed_at=datetime.now().strftime("%Y-%m-%d %H:%M") if status != AppointmentStatus.SCHEDULED else None,
            checked_in_at=datetime.now().strftime("%Y-%m-%d %H:%M") if status == AppointmentStatus.CHECKED_IN else None
        ))
    
    return appointments

appointments_db = generate_appointments()

# Generate SOAP Notes
def generate_soap_notes() -> List[SOAPNote]:
    notes = []
    
    for i, patient in enumerate(patients_db[:10]):
        if patient.status == PatientStatus.NEW:
            continue
            
        notes.append(SOAPNote(
            id=f"soap_{i+1:03d}",
            patient_id=patient.id,
            provider_id=providers_db[0].id,
            appointment_id=f"apt_hist_{i+1:03d}",
            date=(datetime.now() - timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d"),
            subjective=f"Patient reports {patient.chief_complaint.lower()}. Pain level: {random.randint(3, 7)}/10. {random.choice(['Symptoms improving', 'No change since last visit', 'Slight increase in discomfort'])}. Sleep quality: {random.choice(['good', 'fair', 'poor'])}.",
            objective=f"ROM: {random.choice(['Within normal limits', 'Decreased lumbar flexion', 'Limited cervical rotation'])}. Palpation reveals {random.choice(['muscle tension', 'tenderness', 'trigger points'])} in {random.choice(['lumbar', 'cervical', 'thoracic'])} region. Posture assessment: {random.choice(['Improved', 'Unchanged', 'Slight forward head posture'])}.",
            assessment=f"Patient {random.choice(['responding well to treatment', 'showing gradual improvement', 'requires continued care'])}. {random.choice(['Subluxation patterns improving', 'Muscle tension decreasing', 'Functional capacity increasing'])}.",
            plan=f"Spinal adjustment ({random.choice(['lumbar', 'cervical', 'full spine'])}), {random.choice(['soft tissue therapy', 'trigger point release', 'myofascial release'])}. Follow-up in {random.choice(['1 week', '2 weeks', '3 days'])}. Continue home exercises.",
            diagnosis_codes=["M54.5", "M99.01"] if "back" in patient.chief_complaint.lower() else ["M54.2", "M99.00"],
            procedure_codes=["98941", "97140"],
            signed=random.random() > 0.3,
            signed_at=datetime.now().strftime("%Y-%m-%d %H:%M") if random.random() > 0.3 else None,
            ai_generated=True
        ))
    
    return notes

soap_notes_db = generate_soap_notes()

# Generate Insurance Claims
def generate_claims() -> List[InsuranceClaim]:
    claims = []
    statuses = [ClaimStatus.SUBMITTED] * 3 + [ClaimStatus.PENDING] * 2 + [ClaimStatus.APPROVED] * 2 + [ClaimStatus.PAID] * 3
    
    for i, patient in enumerate(patients_db[:10]):
        if patient.status == PatientStatus.NEW:
            continue
            
        status = statuses[i] if i < len(statuses) else ClaimStatus.SUBMITTED
        
        claims.append(InsuranceClaim(
            id=f"claim_{i+1:03d}",
            patient_id=patient.id,
            patient_name=f"{patient.first_name} {patient.last_name}",
            provider_id=providers_db[0].id,
            date_of_service=(datetime.now() - timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d"),
            diagnosis_codes=["M54.5", "M99.01"],
            procedure_codes=["98941", "97140"],
            total_amount=round(random.uniform(65, 150), 2),
            insurance_name=patient.primary_insurance or "Self-Pay",
            status=status,
            submitted_at=(datetime.now() - timedelta(days=random.randint(1, 14))).strftime("%Y-%m-%d") if status != ClaimStatus.DRAFT else None,
            paid_amount=round(random.uniform(50, 120), 2) if status == ClaimStatus.PAID else None
        ))
    
    return claims

claims_db = generate_claims()

# Generate Payments
def generate_payments() -> List[Payment]:
    payments = []
    methods = list(PaymentMethod)
    
    for i in range(15):
        patient = random.choice(patients_db[:15])
        
        payments.append(Payment(
            id=f"pay_{i+1:03d}",
            patient_id=patient.id,
            patient_name=f"{patient.first_name} {patient.last_name}",
            amount=round(random.uniform(25, 150), 2),
            method=random.choice(methods),
            date=(datetime.now() - timedelta(days=random.randint(0, 30))).strftime("%Y-%m-%d"),
            description=random.choice(["Copay", "Adjustment visit", "New patient exam", "Balance payment", "Massage therapy"])
        ))
    
    return payments

payments_db = generate_payments()

# Generate Messages
def generate_messages() -> List[Message]:
    messages = []
    
    subjects = [
        "Appointment Reminder", "Insurance Verification Needed", "Lab Results Available",
        "Follow-up Required", "Payment Due", "New Patient Intake", "Referral Request",
        "Schedule Change", "Treatment Plan Update", "Question About Visit"
    ]
    
    for i in range(10):
        patient = random.choice(patients_db[:10])
        provider = random.choice(providers_db[:2])
        is_from_patient = random.random() > 0.5
        
        messages.append(Message(
            id=f"msg_{i+1:03d}",
            sender_id=patient.id if is_from_patient else provider.id,
            sender_name=f"{patient.first_name} {patient.last_name}" if is_from_patient else f"{provider.title} {provider.first_name} {provider.last_name}",
            sender_role=UserRole.PATIENT if is_from_patient else UserRole.PROVIDER,
            recipient_id=provider.id if is_from_patient else patient.id,
            recipient_name=f"{provider.title} {provider.first_name} {provider.last_name}" if is_from_patient else f"{patient.first_name} {patient.last_name}",
            recipient_role=UserRole.PROVIDER if is_from_patient else UserRole.PATIENT,
            subject=random.choice(subjects),
            content=f"This is a sample message regarding {random.choice(['your upcoming appointment', 'your treatment plan', 'your recent visit', 'insurance coverage', 'scheduling'])}.",
            sent_at=(datetime.now() - timedelta(hours=random.randint(1, 72))).strftime("%Y-%m-%d %H:%M"),
            read=random.random() > 0.4
        ))
    
    return messages

messages_db = generate_messages()

# Staff/Users
users_db = [
    {"id": "user_001", "email": "dr.smith@unwindchiro.com", "name": "Dr. Jamie Smith", "role": UserRole.PROVIDER, "provider_id": "prov_001"},
    {"id": "user_002", "email": "dr.johnson@unwindchiro.com", "name": "Dr. Sarah Johnson", "role": UserRole.PROVIDER, "provider_id": "prov_002"},
    {"id": "user_003", "email": "michael@unwindchiro.com", "name": "Michael Chen", "role": UserRole.PROVIDER, "provider_id": "prov_003"},
    {"id": "user_004", "email": "admin@unwindchiro.com", "name": "Practice Admin", "role": UserRole.ADMIN, "provider_id": None},
    {"id": "user_005", "email": "frontdesk@unwindchiro.com", "name": "Front Desk", "role": UserRole.FRONT_DESK, "provider_id": None},
]

# ============================================================================
# API ENDPOINTS
# ============================================================================

# Health Check
@app.get("/")
async def root():
    return {"message": "Auvora Wellness CRM API", "version": "1.0.0", "practice": practice_config["name"]}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Practice Config
@app.get("/api/practice")
async def get_practice_config():
    return practice_config

# Dashboard Stats
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    today = datetime.now().strftime("%Y-%m-%d")
    today_appointments = [a for a in appointments_db if a.date == today]
    
    return {
        "total_patients": len(patients_db),
        "active_patients": len([p for p in patients_db if p.status == PatientStatus.ACTIVE]),
        "new_patients_this_month": len([p for p in patients_db if p.status == PatientStatus.NEW]),
        "today_appointments": len(today_appointments),
        "completed_today": len([a for a in today_appointments if a.status == AppointmentStatus.COMPLETED]),
        "checked_in": len([a for a in today_appointments if a.status == AppointmentStatus.CHECKED_IN]),
        "pending_claims": len([c for c in claims_db if c.status in [ClaimStatus.SUBMITTED, ClaimStatus.PENDING]]),
        "outstanding_balance": round(sum(p.balance for p in patients_db), 2),
        "unread_messages": len([m for m in messages_db if not m.read]),
        "revenue_today": round(sum(p.amount for p in payments_db if p.date == today), 2),
        "revenue_this_month": round(sum(p.amount for p in payments_db), 2)
    }

# Providers
@app.get("/api/providers")
async def get_providers():
    return providers_db

@app.get("/api/providers/{provider_id}")
async def get_provider(provider_id: str):
    provider = next((p for p in providers_db if p.id == provider_id), None)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider

# Patients
@app.get("/api/patients")
async def get_patients(status: Optional[str] = None, search: Optional[str] = None):
    result = patients_db
    
    if status:
        result = [p for p in result if p.status.value == status]
    
    if search:
        search_lower = search.lower()
        result = [p for p in result if search_lower in p.first_name.lower() or search_lower in p.last_name.lower() or search_lower in p.email.lower()]
    
    return result

@app.get("/api/patients/{patient_id}")
async def get_patient(patient_id: str):
    patient = next((p for p in patients_db if p.id == patient_id), None)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@app.post("/api/patients")
async def create_patient(patient_data: dict):
    new_id = f"pat_{len(patients_db)+1:03d}"
    patient = Patient(
        id=new_id,
        created_at=datetime.now().strftime("%Y-%m-%d"),
        **patient_data
    )
    patients_db.append(patient)
    return patient

@app.put("/api/patients/{patient_id}")
async def update_patient(patient_id: str, patient_data: dict):
    patient_idx = next((i for i, p in enumerate(patients_db) if p.id == patient_id), None)
    if patient_idx is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    current = patients_db[patient_idx].model_dump()
    current.update(patient_data)
    patients_db[patient_idx] = Patient(**current)
    return patients_db[patient_idx]

# Appointments
@app.get("/api/appointments")
async def get_appointments(date: Optional[str] = None, provider_id: Optional[str] = None, patient_id: Optional[str] = None):
    result = appointments_db
    
    if date:
        result = [a for a in result if a.date == date]
    if provider_id:
        result = [a for a in result if a.provider_id == provider_id]
    if patient_id:
        result = [a for a in result if a.patient_id == patient_id]
    
    return sorted(result, key=lambda x: x.start_time)

@app.get("/api/appointments/today")
async def get_today_appointments():
    today = datetime.now().strftime("%Y-%m-%d")
    return sorted([a for a in appointments_db if a.date == today], key=lambda x: x.start_time)

@app.get("/api/appointments/{appointment_id}")
async def get_appointment(appointment_id: str):
    appointment = next((a for a in appointments_db if a.id == appointment_id), None)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@app.post("/api/appointments")
async def create_appointment(appointment_data: dict):
    new_id = f"apt_{len(appointments_db)+1:03d}"
    
    # Get patient and provider names
    patient = next((p for p in patients_db if p.id == appointment_data.get("patient_id")), None)
    provider = next((p for p in providers_db if p.id == appointment_data.get("provider_id")), None)
    
    if not patient or not provider:
        raise HTTPException(status_code=400, detail="Invalid patient or provider ID")
    
    appointment = Appointment(
        id=new_id,
        patient_name=f"{patient.first_name} {patient.last_name}",
        provider_name=f"{provider.title} {provider.first_name} {provider.last_name}",
        status=AppointmentStatus.SCHEDULED,
        **appointment_data
    )
    appointments_db.append(appointment)
    return appointment

@app.put("/api/appointments/{appointment_id}/status")
async def update_appointment_status(appointment_id: str, status_data: dict):
    appointment_idx = next((i for i, a in enumerate(appointments_db) if a.id == appointment_id), None)
    if appointment_idx is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    current = appointments_db[appointment_idx].model_dump()
    new_status = status_data.get("status")
    
    if new_status:
        current["status"] = AppointmentStatus(new_status)
        if new_status == "confirmed":
            current["confirmed_at"] = datetime.now().strftime("%Y-%m-%d %H:%M")
        elif new_status == "checked_in":
            current["checked_in_at"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    if "room" in status_data:
        current["room"] = status_data["room"]
    
    appointments_db[appointment_idx] = Appointment(**current)
    return appointments_db[appointment_idx]

# Visit Types
@app.get("/api/visit-types")
async def get_visit_types():
    return visit_types_db

# Rooms
@app.get("/api/rooms")
async def get_rooms():
    return rooms_db

# SOAP Notes
@app.get("/api/soap-notes")
async def get_soap_notes(patient_id: Optional[str] = None):
    result = soap_notes_db
    if patient_id:
        result = [n for n in result if n.patient_id == patient_id]
    return sorted(result, key=lambda x: x.date, reverse=True)

@app.get("/api/soap-notes/{note_id}")
async def get_soap_note(note_id: str):
    note = next((n for n in soap_notes_db if n.id == note_id), None)
    if not note:
        raise HTTPException(status_code=404, detail="SOAP note not found")
    return note

@app.post("/api/soap-notes")
async def create_soap_note(note_data: dict):
    new_id = f"soap_{len(soap_notes_db)+1:03d}"
    note = SOAPNote(
        id=new_id,
        date=datetime.now().strftime("%Y-%m-%d"),
        **note_data
    )
    soap_notes_db.append(note)
    return note

@app.put("/api/soap-notes/{note_id}/sign")
async def sign_soap_note(note_id: str):
    note_idx = next((i for i, n in enumerate(soap_notes_db) if n.id == note_id), None)
    if note_idx is None:
        raise HTTPException(status_code=404, detail="SOAP note not found")
    
    current = soap_notes_db[note_idx].model_dump()
    current["signed"] = True
    current["signed_at"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    soap_notes_db[note_idx] = SOAPNote(**current)
    return soap_notes_db[note_idx]

# AI SOAP Note Generation
@app.post("/api/soap-notes/generate")
async def generate_soap_note(data: dict):
    patient_id = data.get("patient_id")
    appointment_id = data.get("appointment_id")
    
    patient = next((p for p in patients_db if p.id == patient_id), None)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Generate AI SOAP note (simulated)
    generated_note = {
        "subjective": f"Patient reports {patient.chief_complaint.lower()}. Pain level: 5/10. Symptoms have been {'improving' if random.random() > 0.5 else 'stable'} since last visit. Patient notes {'good' if random.random() > 0.5 else 'fair'} sleep quality and {'compliance' if random.random() > 0.5 else 'partial compliance'} with home exercises.",
        "objective": f"ROM: {'Within normal limits' if random.random() > 0.5 else 'Decreased in affected region'}. Palpation reveals {'mild' if random.random() > 0.5 else 'moderate'} muscle tension in {'lumbar' if 'back' in patient.chief_complaint.lower() else 'cervical'} region. Posture assessment shows {'improvement' if random.random() > 0.5 else 'no significant change'}. Orthopedic tests: {'Negative' if random.random() > 0.5 else 'Positive for facet involvement'}.",
        "assessment": f"Patient {'responding well to' if random.random() > 0.5 else 'showing gradual improvement with'} chiropractic care. {'Subluxation patterns improving' if random.random() > 0.5 else 'Continued spinal dysfunction noted'}. Functional capacity {'increasing' if random.random() > 0.5 else 'stable'}.",
        "plan": f"Spinal adjustment ({'lumbar and thoracic' if 'back' in patient.chief_complaint.lower() else 'cervical and upper thoracic'}), soft tissue therapy as indicated. Follow-up in {'1 week' if random.random() > 0.5 else '3-5 days'}. Continue home exercise program. {'Consider adding decompression therapy' if random.random() > 0.3 else 'Maintain current treatment frequency'}.",
        "diagnosis_codes": ["M54.5", "M99.01"] if "back" in patient.chief_complaint.lower() else ["M54.2", "M99.00"],
        "procedure_codes": ["98941", "97140"],
        "ai_generated": True
    }
    
    return generated_note

# Insurance Claims
@app.get("/api/claims")
async def get_claims(status: Optional[str] = None, patient_id: Optional[str] = None):
    result = claims_db
    if status:
        result = [c for c in result if c.status.value == status]
    if patient_id:
        result = [c for c in result if c.patient_id == patient_id]
    return result

@app.get("/api/claims/{claim_id}")
async def get_claim(claim_id: str):
    claim = next((c for c in claims_db if c.id == claim_id), None)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim

@app.post("/api/claims")
async def create_claim(claim_data: dict):
    new_id = f"claim_{len(claims_db)+1:03d}"
    
    patient = next((p for p in patients_db if p.id == claim_data.get("patient_id")), None)
    if not patient:
        raise HTTPException(status_code=400, detail="Invalid patient ID")
    
    claim = InsuranceClaim(
        id=new_id,
        patient_name=f"{patient.first_name} {patient.last_name}",
        status=ClaimStatus.DRAFT,
        **claim_data
    )
    claims_db.append(claim)
    return claim

@app.put("/api/claims/{claim_id}/submit")
async def submit_claim(claim_id: str):
    claim_idx = next((i for i, c in enumerate(claims_db) if c.id == claim_id), None)
    if claim_idx is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    current = claims_db[claim_idx].model_dump()
    current["status"] = ClaimStatus.SUBMITTED
    current["submitted_at"] = datetime.now().strftime("%Y-%m-%d")
    claims_db[claim_idx] = InsuranceClaim(**current)
    return claims_db[claim_idx]

# Payments
@app.get("/api/payments")
async def get_payments(patient_id: Optional[str] = None):
    result = payments_db
    if patient_id:
        result = [p for p in result if p.patient_id == patient_id]
    return sorted(result, key=lambda x: x.date, reverse=True)

@app.post("/api/payments")
async def create_payment(payment_data: dict):
    new_id = f"pay_{len(payments_db)+1:03d}"
    
    patient = next((p for p in patients_db if p.id == payment_data.get("patient_id")), None)
    if not patient:
        raise HTTPException(status_code=400, detail="Invalid patient ID")
    
    payment = Payment(
        id=new_id,
        patient_name=f"{patient.first_name} {patient.last_name}",
        date=datetime.now().strftime("%Y-%m-%d"),
        **payment_data
    )
    payments_db.append(payment)
    
    # Update patient balance
    patient_idx = next((i for i, p in enumerate(patients_db) if p.id == patient.id), None)
    if patient_idx is not None:
        current = patients_db[patient_idx].model_dump()
        current["balance"] = max(0, current["balance"] - payment.amount)
        patients_db[patient_idx] = Patient(**current)
    
    return payment

# Messages
@app.get("/api/messages")
async def get_messages(user_id: Optional[str] = None, unread_only: bool = False):
    result = messages_db
    if user_id:
        result = [m for m in result if m.recipient_id == user_id or m.sender_id == user_id]
    if unread_only:
        result = [m for m in result if not m.read]
    return sorted(result, key=lambda x: x.sent_at, reverse=True)

@app.get("/api/messages/unread-count")
async def get_unread_count(user_id: Optional[str] = None):
    if user_id:
        count = len([m for m in messages_db if m.recipient_id == user_id and not m.read])
    else:
        count = len([m for m in messages_db if not m.read])
    return {"count": count}

@app.post("/api/messages")
async def send_message(message_data: dict):
    new_id = f"msg_{len(messages_db)+1:03d}"
    message = Message(
        id=new_id,
        sent_at=datetime.now().strftime("%Y-%m-%d %H:%M"),
        **message_data
    )
    messages_db.append(message)
    return message

@app.put("/api/messages/{message_id}/read")
async def mark_message_read(message_id: str):
    message_idx = next((i for i, m in enumerate(messages_db) if m.id == message_id), None)
    if message_idx is None:
        raise HTTPException(status_code=404, detail="Message not found")
    
    current = messages_db[message_idx].model_dump()
    current["read"] = True
    current["read_at"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    messages_db[message_idx] = Message(**current)
    return messages_db[message_idx]

# Users/Staff
@app.get("/api/users")
async def get_users():
    return users_db

@app.get("/api/users/{user_id}")
async def get_user(user_id: str):
    user = next((u for u in users_db if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Analytics
@app.get("/api/analytics/revenue")
async def get_revenue_analytics():
    today = datetime.now()
    
    # Calculate daily revenue for the past 7 days
    daily_revenue = []
    for i in range(7):
        day = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        day_payments = [p for p in payments_db if p.date == day]
        daily_revenue.append({
            "date": day,
            "amount": round(sum(p.amount for p in day_payments), 2),
            "count": len(day_payments)
        })
    
    return {
        "daily_revenue": list(reversed(daily_revenue)),
        "total_this_month": round(sum(p.amount for p in payments_db), 2),
        "average_per_visit": round(sum(p.amount for p in payments_db) / max(len(payments_db), 1), 2),
        "outstanding_balance": round(sum(p.balance for p in patients_db), 2)
    }

@app.get("/api/analytics/appointments")
async def get_appointment_analytics():
    today = datetime.now().strftime("%Y-%m-%d")
    today_apts = [a for a in appointments_db if a.date == today]
    
    return {
        "total_today": len(today_apts),
        "completed": len([a for a in today_apts if a.status == AppointmentStatus.COMPLETED]),
        "no_shows": len([a for a in today_apts if a.status == AppointmentStatus.NO_SHOW]),
        "cancelled": len([a for a in today_apts if a.status == AppointmentStatus.CANCELLED]),
        "by_visit_type": {
            vt.name: len([a for a in today_apts if a.visit_type == vt.name])
            for vt in visit_types_db
        },
        "by_provider": {
            p.id: {
                "name": f"{p.title} {p.first_name} {p.last_name}",
                "count": len([a for a in today_apts if a.provider_id == p.id])
            }
            for p in providers_db
        }
    }

@app.get("/api/analytics/patients")
async def get_patient_analytics():
    return {
        "total": len(patients_db),
        "by_status": {
            status.value: len([p for p in patients_db if p.status == status])
            for status in PatientStatus
        },
        "new_this_month": len([p for p in patients_db if p.status == PatientStatus.NEW]),
        "with_balance": len([p for p in patients_db if p.balance > 0]),
        "intake_pending": len([p for p in patients_db if not p.intake_complete])
    }

# Compliance
@app.get("/api/compliance/hipaa-status")
async def get_hipaa_status():
    return {
        "patients_with_signed_hipaa": len([p for p in patients_db if p.hipaa_signed]),
        "patients_without_signed_hipaa": len([p for p in patients_db if not p.hipaa_signed]),
        "consent_forms_signed": len([p for p in patients_db if p.consent_signed]),
        "consent_forms_pending": len([p for p in patients_db if not p.consent_signed]),
        "last_audit_date": (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d"),
        "next_audit_date": (datetime.now() + timedelta(days=60)).strftime("%Y-%m-%d"),
        "compliance_score": 92
    }

# QuickBooks Integration (placeholder)
quickbooks_connection = {
    "connected": False,
    "company_name": None,
    "company_id": None,
    "connected_at": None,
    "last_sync": None
}

@app.get("/api/quickbooks/status")
async def get_quickbooks_status():
    return quickbooks_connection

@app.post("/api/quickbooks/connect")
async def connect_quickbooks(data: dict):
    quickbooks_connection["connected"] = True
    quickbooks_connection["company_name"] = data.get("company_name", practice_config["name"])
    quickbooks_connection["company_id"] = f"qb_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    quickbooks_connection["connected_at"] = datetime.now().isoformat()
    return {"success": True, "connection": quickbooks_connection}

@app.post("/api/quickbooks/disconnect")
async def disconnect_quickbooks():
    quickbooks_connection["connected"] = False
    quickbooks_connection["company_name"] = None
    quickbooks_connection["company_id"] = None
    quickbooks_connection["connected_at"] = None
    quickbooks_connection["last_sync"] = None
    return {"success": True}

@app.post("/api/quickbooks/sync")
async def sync_quickbooks():
    if not quickbooks_connection["connected"]:
        raise HTTPException(status_code=400, detail="QuickBooks not connected")
    
    quickbooks_connection["last_sync"] = datetime.now().isoformat()
    return {
        "success": True,
        "synced": {
            "patients": len(patients_db),
            "invoices": len(claims_db),
            "payments": len(payments_db)
        }
    }

# AI Agent Integration
from app.ai_agent import chat_with_auvora

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = None

class ChatResponse(BaseModel):
    response: str
    success: bool

@app.post("/api/ai/chat", response_model=ChatResponse)
async def ai_chat(request: ChatRequest):
    """Chat with the Auvora AI assistant."""
    # Build data context for the AI agent
    data_context = {
        "patients": [p.model_dump() for p in patients_db],
        "appointments": [a.model_dump() for a in appointments_db],
        "providers": [p.model_dump() for p in providers_db],
        "claims": [c.model_dump() for c in claims_db],
        "payments": [p.model_dump() for p in payments_db],
        "messages": [m.model_dump() for m in messages_db]
    }
    
    try:
        response = chat_with_auvora(
            message=request.message,
            data_context=data_context,
            conversation_history=request.conversation_history
        )
        return ChatResponse(response=response, success=True)
    except Exception as e:
        return ChatResponse(response=f"Error: {str(e)}", success=False)

print("Auvora Wellness CRM API initialized successfully!")
print(f"Practice: {practice_config['name']}")
print(f"Patients: {len(patients_db)}")
print(f"Providers: {len(providers_db)}")
print(f"Today's Appointments: {len([a for a in appointments_db if a.date == datetime.now().strftime('%Y-%m-%d')])}")
