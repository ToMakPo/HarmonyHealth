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

## user
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

## serviceGroup
- id
- name
- sortOrder

## service
- id
- [groupId](#serviceGroup)
- name
- description
- details
- cost
- priceInfo
- imagePath
- sortOrder

## serviceProvider
- [serviceId](#service)
- [employeeId](#employee)
- duration

## appointment
- id
- [userId](#user)
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