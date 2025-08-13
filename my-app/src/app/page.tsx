'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExampleApiUsage } from "@/components/example-api-usage"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function Home() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const [formErrors, setFormErrors] = useState({ firstName: '', lastName: '', phoneNumber: '' });


  const validateFormData = () => {
    const {firstName, lastName, phoneNumber} = formData
    const newFormErrors = { firstName: '', lastName: '', phoneNumber: '' };
    const PHONE_NUMBER_LENGTH = 11
    if (phoneNumber.length != PHONE_NUMBER_LENGTH) {
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
                  className={formErrors.firstName ? 'border-red-500' : ''}
                />
                {formErrors.firstName && <p className="text-red-500">{formErrors.firstName}</p>}
              </div>
              <div>
                <label>Last Name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder=""
                  className={formErrors.lastName ? 'border-red-500' : ''}
                />
                {formErrors.lastName && <p className="text-red-500">{formErrors.lastName}</p>}
              </div>
              <div>
                <label>Phone Number</label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className={formErrors.phoneNumber ? 'border-red-500' : ''}
                />
                  {formErrors.phoneNumber && <p className="text-red-500">{formErrors.phoneNumber}</p>}
              </div>
              <Button 
                type="submit" 
              >
                {'Start Call'}
              </Button>
            </form>
            <CardHeader>
              <CardTitle>Start New Call</CardTitle>
              <CardDescription>
                Initiate an automated phone screen with a candidate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                TODO: Implement call initiation form with phone number input
              </p>
              <Button>Start Call</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Calls</CardTitle>
              <CardDescription>
                View transcripts and details from previous screening calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                TODO: Implement call logs table
              </p>
            </CardContent>
          </Card>

          <ExampleApiUsage />
        </div>
      </div>
    </main>
  )
}
