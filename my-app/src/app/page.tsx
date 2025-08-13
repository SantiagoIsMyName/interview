'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExampleApiUsage } from "@/components/example-api-usage"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { errorBorderColor, errorTextColor } from "@/components/ui/colors"

export default function Home() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const [formErrors, setFormErrors] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const [callResult, setCallResult] = useState<any>(null)


  const validateFormData = () => {
    const {firstName, lastName, phoneNumber} = formData
    const newFormErrors = { firstName: '', lastName: '', phoneNumber: '' };
    const PHONE_NUMBER_LENGTH = 12
    if (!phoneNumber) {
      newFormErrors.phoneNumber = "Missing phone number"
    }
    else if (phoneNumber[0] !== "+") {
      newFormErrors.phoneNumber = "Phone number requires + at start"
    }
    else if (phoneNumber.length != PHONE_NUMBER_LENGTH) {
      newFormErrors.phoneNumber = "Phone number not correct length; remove any dashes"
    }

    if (!firstName) {
      newFormErrors.firstName = "Missing first name"
    }
    if (!lastName) {
      newFormErrors.lastName = "Missing last name"
    }
    setFormErrors(newFormErrors)
    return {isValid: !newFormErrors.firstName && !newFormErrors.lastName && !newFormErrors.phoneNumber}
  }

  const startCall = async (e: React.FormEvent) => {
    e.preventDefault();
    const {isValid} = validateFormData()
    if (!isValid) {
      // Would add an error toast
      return
    }

    try {
      const response = await fetch('/api/vapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) { 
        const result = await response.json()
        setCallResult(result)
      } else {
        const error = await response.json();
        alert(`${error.error}`);
      }
    } catch (error) {
      alert(error);
    }
  }

  const checkStatus = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/vapi?id=${callResult.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callResult),
      });
      if (response.ok) { 
        const result = await response.json()
        setCallResult(result)
      } else {
        const error = await response.json();
        alert(`${error.error}`);
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Phone Screen Operator Console</h1>

        <div className="grid gap-6">
          <Card>
          <form onSubmit={startCall}>
              <div>
                <label>First Name</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder=""
                  className={formErrors.firstName ? errorBorderColor : ''}
                />
                {formErrors.firstName && <p className={errorTextColor}> {formErrors.firstName}</p>}
              </div>
              <div>
                <label>Last Name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder=""
                  className={formErrors.lastName ? errorBorderColor : ''}
                />
                {formErrors.lastName && <p className={errorTextColor}> {formErrors.lastName}</p>}
              </div>
              <div>
                <label>Phone Number</label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className={formErrors.phoneNumber ? errorBorderColor : ''}
                />
                  {formErrors.phoneNumber && <p className={errorTextColor}> {formErrors.phoneNumber}</p>}
              </div>
              <Button 
                type="submit" 
              >
                Start Call
              </Button>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Calls</CardTitle>
              <CardDescription>
                View transcripts and details from previous screening calls
              </CardDescription>
            </CardHeader>
            <CardContent>
            {callResult && (
            <pre className="bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(callResult, null, 2)}
            </pre>
          )}
              <Button 
                disabled={!callResult}
                type="submit" 
                onClick={checkStatus}
              >
                Update Status
              </Button>
            </CardContent>
          </Card>

          <ExampleApiUsage />
        </div>
      </div>
    </main>
  )
}
