"use client";

import { useState } from "react";
import { DocSection, DocNote } from "@/lib/hospitality-safe-docs";

/* ─── HS Logo ─── */
function HSLogo() {
  return (
    <div className="flex flex-col items-center mb-3">
      <div className="w-10 h-10 rounded-full border-[1.5px] flex items-center justify-center mb-1" style={{ borderColor: "#4A5FC1" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="#4A5FC1" strokeWidth="1.5" fill="none" />
          <text x="12" y="15.5" textAnchor="middle" fill="#4A5FC1" fontSize="8" fontWeight="bold">HS</text>
        </svg>
      </div>
      <div className="text-[8px] tracking-[1.5px] text-[#333]">
        HOSPITALITY<span className="font-bold">SAFE</span>
      </div>
    </div>
  );
}

/* ─── Step Indicator ─── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-3">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="w-[6px] h-[6px] rounded-full transition-colors"
          style={{
            background: i + 1 === current ? "#4A5FC1" : i + 1 < current ? "#A0AAE0" : "#D1D5DB",
          }}
        />
      ))}
      <span className="text-[8px] text-[#999] ml-1.5">Step {current} of {total}</span>
    </div>
  );
}

/* ─── Form Field (label left, underline input) ─── */
function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  showToggle,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  showToggle?: boolean;
  hint?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-2.5">
      <div className="flex items-center gap-3">
        <label className="text-[10px] text-[#333] font-medium shrink-0" style={{ width: 100 }}>
          {label}
        </label>
        <div className="flex-1 relative">
          <input
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full text-[10px] text-[#333] py-1.5 border-b border-[#D1D5DB] outline-none placeholder:text-[#C0C0C0] focus:border-[#4A5FC1] transition-colors bg-transparent"
          />
          {showToggle && (
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] font-medium cursor-pointer"
              style={{ color: "#4A5FC1" }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          )}
        </div>
      </div>
      {hint && (
        <div className="text-[8px] text-[#999] italic mt-0.5" style={{ marginLeft: 112 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

/* ─── Select Field ─── */
function SelectField({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: string[];
}) {
  return (
    <div className="mb-2.5">
      <div className="flex items-center gap-3">
        <label className="text-[10px] text-[#333] font-medium shrink-0" style={{ width: 100 }}>
          {label}
        </label>
        <div className="flex-1 relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-[10px] text-[#333] py-1.5 border-b border-[#D1D5DB] outline-none bg-transparent appearance-none cursor-pointer focus:border-[#4A5FC1] transition-colors"
            style={{ color: value ? "#333" : "#C0C0C0" }}
          >
            <option value="" disabled>{placeholder || "Select an item..."}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <svg
            className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared constants ─── */
const businessTypeOptions = [
  "Cafe",
  "Restaurant",
  "Catering",
  "Takeaway / Canteen",
  "Butcher",
  "Bakery",
  "Aged Care",
  "Early Learning",
  "Manufacturer",
  "Supermarket / Convenience Store",
];

/* ─── Mockup ─── */
export function Mockup({ selectedArea, onSubStepChange, currentStep }: { selectedArea: string; onSubStepChange?: (step: number) => void; currentStep?: number }) {
  const [stepInternal, setStepInternal] = useState(1);

  // Use parent-controlled step if provided, otherwise internal
  const step = currentStep ?? stepInternal;

  const setStep = (v: number | ((s: number) => number)) => {
    const next = typeof v === "function" ? v(step) : v;
    setStepInternal(next);
    onSubStepChange?.(next);
  };

  // Step 1
  const [email, setEmail] = useState("");

  // Step 2 - Account Owner
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [contactNumber, setContactNumber] = useState("0429099644");
  const [password, setPassword] = useState("password123");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Step 3 - Business
  const [businessName, setBusinessName] = useState("Aged care pty ltd");
  const [businessAddress, setBusinessAddress] = useState("31 Deakin Ave, Mildura 3500 VIC");
  const [businessType, setBusinessType] = useState("Aged Care");
  const [singleLocation, setSingleLocation] = useState(false);

  // Step 4 - Location
  const [locationName, setLocationName] = useState("Aged care Mildura south");
  const [locationAddress, setLocationAddress] = useState("888 Fifteenth St, Mildura 3500 VIC");
  const [locationType, setLocationType] = useState("Aged Care");

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="flex-1 flex flex-col items-center px-6 pt-5 pb-2 max-w-[420px] mx-auto w-full">
        <HSLogo />
        <StepIndicator current={step} total={5} />

        {/* ── Step 1: Enter Email ── */}
        {step === 1 && (
          <div className="w-full flex-1 flex flex-col">
            <h1 className="text-[16px] font-semibold text-[#333] text-center mb-4">
              Enter your email
            </h1>
            <div className="w-full mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                className="w-full text-[10px] text-[#333] py-2 px-3 rounded-md border border-[#D1D5DB] outline-none placeholder:text-[#C0C0C0] focus:border-[#4A5FC1] transition-colors bg-transparent"
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={next}
                className="px-8 py-2 rounded-md text-white text-[11px] font-semibold cursor-pointer"
                style={{ background: "#4A5FC1", minWidth: 140 }}
              >
                Next
              </button>
            </div>
            <div className="flex-1" />
            <div className="text-center pb-1">
              <button className="text-[9px] font-medium cursor-pointer" style={{ color: "#4A5FC1" }}>
                Need help? Contact us
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Account Owner Details ── */}
        {step === 2 && (
          <div className="w-full flex-1 flex flex-col">
            <h1 className="text-[15px] font-semibold text-center mb-0.5" style={{ color: "#4A5FC1" }}>
              Welcome to Hospitality Safe!
            </h1>
            <h2 className="text-[11px] font-bold text-[#333] text-center mb-1">
              Let&apos;s get you set up.
            </h2>
            <p className="text-[9px] text-[#888] text-center mb-3 leading-relaxed max-w-[360px] mx-auto">
              Enter the details of the account owner (eg. the owner of the business, or someone from head office who will manage the account.)
            </p>

            <FormField label="First Name" value={firstName} onChange={setFirstName} placeholder="e.g. John" />
            <FormField label="Last Name" value={lastName} onChange={setLastName} placeholder="e.g. Smith" />
            <FormField label="Contact Number" value={contactNumber} onChange={setContactNumber} placeholder="e.g. 0400 000 000" />
            <FormField
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="........"
              showToggle
              hint="Enter a password with 8 or more characters"
            />

            <div className="flex items-start gap-1.5 mt-1 mb-3" style={{ marginLeft: 0 }}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 accent-[#4A5FC1] cursor-pointer w-3 h-3"
              />
              <span className="text-[9px] text-[#666]">
                I agree to the{" "}
                <span className="font-medium cursor-pointer underline" style={{ color: "#4A5FC1" }}>Terms &amp; Conditions</span>
                {" "}and{" "}
                <span className="font-medium cursor-pointer" style={{ color: "#4A5FC1" }}>Privacy Policy</span>
              </span>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <button className="text-[9px] font-medium cursor-pointer" style={{ color: "#4A5FC1" }}>
                Already have an account?
              </button>
              <button
                onClick={next}
                className="px-6 py-1.5 rounded-md text-white text-[10px] font-semibold cursor-pointer"
                style={{ background: "#4A5FC1", minWidth: 120 }}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Business Details ── */}
        {step === 3 && (
          <div className="w-full flex-1 flex flex-col">
            <h1 className="text-[15px] font-semibold text-center mb-0.5" style={{ color: "#4A5FC1" }}>
              Business Details
            </h1>
            <h2 className="text-[11px] font-bold text-[#333] text-center mb-1">
              {firstName}, let&apos;s add your business details
            </h2>
            <p className="text-[9px] text-[#888] text-center mb-3 leading-relaxed max-w-[360px] mx-auto">
              Enter the details for the business which you are creating the account for.
            </p>

            <FormField label="Business Name" value={businessName} onChange={setBusinessName} placeholder="e.g. Kentucky Fried Chicken" />
            <FormField label="Business Address" value={businessAddress} onChange={setBusinessAddress} placeholder="e.g. 123 Example Street, Melbourne VIC 3000" />
            <SelectField
              label="Business Type"
              value={businessType}
              onChange={setBusinessType}
              placeholder="Select an item..."
              options={businessTypeOptions}
            />
            <div className="flex items-center gap-1.5 mb-3" style={{ marginLeft: 0 }}>
              <input
                type="checkbox"
                checked={singleLocation}
                onChange={(e) => setSingleLocation(e.target.checked)}
                className="accent-[#4A5FC1] cursor-pointer w-3 h-3"
              />
              <span className="text-[9px] text-[#666] italic">
                Does your business have only one location?
              </span>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <button className="text-[9px] font-medium cursor-pointer" style={{ color: "#4A5FC1" }}>
                Back to login
              </button>
              <button
                onClick={next}
                className="px-6 py-1.5 rounded-md text-white text-[10px] font-semibold cursor-pointer"
                style={{ background: "#4A5FC1", minWidth: 120 }}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Location Details ── */}
        {step === 4 && (
          <div className="w-full flex-1 flex flex-col">
            <h1 className="text-[15px] font-semibold text-center mb-0.5" style={{ color: "#4A5FC1" }}>
              Location Details
            </h1>
            <h2 className="text-[11px] font-bold text-[#333] text-center mb-1">
              {firstName}, now let&apos;s add your first location&apos;s details.
            </h2>
            <p className="text-[9px] text-[#888] text-center mb-3 leading-relaxed max-w-[360px] mx-auto">
              You can add more locations later from the admin page.
            </p>

            <FormField label="Location Name" value={locationName} onChange={setLocationName} placeholder="e.g. Kentucky Fried Chicken" />
            <FormField label="Location Address" value={locationAddress} onChange={setLocationAddress} placeholder="e.g. 123 Example Street, Melbourne VIC 3000" />
            <SelectField
              label="Location Type"
              value={locationType}
              onChange={setLocationType}
              placeholder="Select an item..."
              options={businessTypeOptions}
            />

            <div className="flex items-center justify-between mt-auto">
              <button className="text-[9px] font-medium cursor-pointer" style={{ color: "#4A5FC1" }}>
                Back to login
              </button>
              <button
                onClick={next}
                className="px-6 py-1.5 rounded-md text-white text-[10px] font-semibold cursor-pointer"
                style={{ background: "#4A5FC1", minWidth: 120 }}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── Step 5: Confirm Details ── */}
        {step === 5 && (
          <div className="w-full flex-1 flex flex-col">
            <h1 className="text-[15px] font-semibold text-center mb-0.5" style={{ color: "#4A5FC1" }}>
              Confirm Details
            </h1>
            <h2 className="text-[16px] font-bold text-[#333] text-center mb-6">
              Please review your details
            </h2>

            <div className="space-y-4 mb-6">
              <SummarySection title="Account Owner">
                <SummaryRow label="Name" value={`${firstName} ${lastName}`} />
                <SummaryRow label="Email" value={email || "john@example.com"} />
                <SummaryRow label="Contact" value={contactNumber} />
              </SummarySection>

              <SummarySection title="Business">
                <SummaryRow label="Business Name" value={businessName} />
                <SummaryRow label="Address" value={businessAddress} />
                <SummaryRow label="Type" value={businessType} />
                <SummaryRow label="Single Location" value={singleLocation ? "Yes" : "No"} />
              </SummarySection>

              <SummarySection title="Location">
                <SummaryRow label="Location Name" value={locationName} />
                <SummaryRow label="Address" value={locationAddress} />
                <SummaryRow label="Type" value={locationType} />
              </SummarySection>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <button
                onClick={back}
                className="px-5 py-1.5 rounded-md text-[10px] font-semibold cursor-pointer border"
                style={{ color: "#4A5FC1", borderColor: "#4A5FC1" }}
              >
                Back
              </button>
              <button
                onClick={() => setStep(1)}
                className="px-6 py-1.5 rounded-md text-white text-[10px] font-semibold cursor-pointer"
                style={{ background: "#4A5FC1", minWidth: 120 }}
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

/* ─── Summary helpers ─── */
function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-semibold text-[#4A5FC1] mb-1">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center text-[9px]">
      <span className="text-[#888] shrink-0" style={{ width: 100 }}>{label}</span>
      <span className="text-[#333] font-medium">{value}</span>
    </div>
  );
}

/* ─── Annotation ─── */
function Annotation({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] text-slate-500 pl-2 mb-1.5" style={{ borderLeft: "2px solid #4A5FC1" }}>
      <span className="text-[8px] text-[#4A5FC1] font-medium mr-1">Figma:</span>{children}
    </div>
  );
}

/* ─── Docs ─── */
export function Docs({ currentStep }: { currentStep?: number }) {
  const step = currentStep ?? 1;

  /* Step 1: Enter Email */
  if (step === 1) return (
    <>
      <DocSection title="What is this?">
        <p>Enter your email to start creating an account. This email becomes the main login for the whole business.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>This is the first of 5 steps</li>
          <li>The email you enter here will be the admin login email</li>
        </ul>
      </DocSection>
    </>
  );

  /* Step 2: Account Owner */
  if (step === 2) return (
    <>
      <DocSection title="What is this?">
        <p>Account owner details — this person becomes the superuser. Their email and password is used for admin login.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Fill in name, contact number, and a password</li>
          <li>Must agree to Terms &amp; Conditions before continuing</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>The Email and Password created here will be the account log in details. This password is used to access the Admin section.</Annotation>
      </DocSection>
    </>
  );

  /* Step 3: Business Details */
  if (step === 3) return (
    <>
      <DocSection title="What is this?">
        <p>Your business info. Pick your business type from the list: Cafe, Restaurant, Catering, Aged Care, and more.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Enter business name, address, and type</li>
          <li>Tick the box if you only have one location</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>It may need to be made clear that the details added here will be used to log into the business account on the iPad for 1 location.</Annotation>
      </DocSection>
    </>
  );

  /* Step 4: Location Details */
  if (step === 4) return (
    <>
      <DocSection title="What is this?">
        <p>Set up your first location. You can add more later from admin.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Give the location a name and address</li>
          <li>Pick the location type (same options as business type)</li>
        </ul>
      </DocSection>
    </>
  );

  /* Step 5: Confirm */
  return (
    <>
      <DocSection title="What is this?">
        <p>Review everything before creating the account. Check that all details are correct.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Shows a summary of account owner, business, and location info</li>
          <li>Press Back to fix anything, or Create Account to finish</li>
        </ul>
      </DocSection>
    </>
  );
}
