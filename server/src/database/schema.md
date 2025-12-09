# Harmony Health Database Schema

## employee
- id
- username
- passHash
- firstName
- lastName
- title
- role
- email
- phone
- address
- gender
- dob
- notes
- imagePath
- showOnSite
- status

## employeePreference
- [employeeId](#employee)
- option
- value

## customer
- id
- username
- passHash
- firstName
- lastName
- title
- email
- phone
- address
- gender
- dob
- notes
- imagePath
- status

## customerPreference
- [customerId](#customer)
- option
- value

## service
- id					// The unique identifier of the general service.
- name					// The name of the general service (i.e. Botox, Fillers, IV Therapy, ...).
- description			// A short descriotion of what the service is.
- details				// A much more detailed description of what the service is. Use markdown for formating.
- sortOrder				// The order this service shows up in any list of services.
- topService			// Should this service be included in the top services list? >> Boolean, defaulted to false
- packages		// A list of more packages included.
> - id					// The unique identifier of the package.
> - name				// The name of the package (i.e. Full Face Laser hair Removal).
> - description			// A short descriotion of what the sepcific service is.
> - cost 				// The approximate cost to the company for this service.
> - price				// The amount charged to the customer.
> - duration			// Alloted time of the service.

## serviceProvider
- [serviceId](#service)
- [employeeId](#employee)
- duration

## appointment
- id
- [customerId](#customer)
- [serviceId](#service)
- [employeeId](#employee)
- datetime
- status

## appointmentNote
- id
- [appointmentId](#appointment)
- [employeeId](#employee)
- timestamp
- noteType
- note