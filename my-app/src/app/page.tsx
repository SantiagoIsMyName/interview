'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExampleApiUsage } from "@/components/example-api-usage"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { errorBorderColor, errorTextColor } from "@/components/ui/colors"
import { Call } from "@/types"
import { jsonClone } from "@/lib/utils"

export default function Home() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const [formErrors, setFormErrors] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const [callResults, setCallResults] = useState<Call[]>([])


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
      const result = await response.json()
      const {id: callId, status, createdAt} = result.message
      
      let formattedCreatedAt = new Date(createdAt);
      formattedCreatedAt.setMilliseconds(0);
      let dateISOString = formattedCreatedAt.toISOString().replace(".000Z", "Z");

      const newEntry = {...formData, callId, status, createdAt: dateISOString} as Call
      const copiedCallResult = jsonClone(callResults)
      copiedCallResult.push(newEntry)
      setCallResults(copiedCallResult)
    } catch (error) {
      alert(error);
    }
  }

  const checkStatus = async (index: number) => {
    if (!callResults) {
      // Would be helpful if this had a toast
      return
    }
    if (index >= callResults.length) {
      return
    }

    try {
      const response = await fetch(`/api/vapi?id=${callResults[index].callId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json()
      const copiedCallResult = jsonClone(callResults)
      copiedCallResult[index] = {...copiedCallResult[index], status: result?.message?.status}
      setCallResults(copiedCallResult)
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
          <form className="mx-5" onSubmit={startCall}>
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
              <div className="my-5">
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
            <table style={{
              margin: `12px 0`,
              width: '100%',
            }}>
              <thead>
                <tr>
                {["First", "Last", "Phone", "Status", "Called At"].map((header, i) => 
                  <th key={i}>
                    <p>
                      {header}
                    </p>
                  </th>)}
                </tr>
              </thead>
              <tbody>
              {callResults?.map((result, i) => (
                <tr key={i} 
                onClick={(e: React.SyntheticEvent) => {
                  e.preventDefault()
                  checkStatus(i)
                }}
                style={{cursor:"pointer"}}>
                  <td><p>{result.firstName}</p></td>
                  <td><p>{result.lastName}</p></td>
                  <td><p>{result.phoneNumber}</p></td>
                  <td><p>{result.status}</p></td>
                  <td><p>{result.createdAt}</p></td>
                </tr>
              ))}
              </tbody>
            </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
