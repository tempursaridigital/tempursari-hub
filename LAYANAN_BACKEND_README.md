# Layanan Mandiri Backend Implementation

## Overview

This document describes the complete backend implementation for the Layanan Mandiri (Self-Service) system, which allows users to submit service requests and operators to manage them with WhatsApp notifications.

## Features Implemented

### ✅ User Features
- **Service Request Submission**: Users can submit requests for various document types
- **Document Upload**: Camera capture or gallery upload functionality
- **Status Tracking**: Check request status using NIK only
- **Real-time Updates**: WhatsApp notifications on status changes

### ✅ Operator Features
- **Secure Login**: Role-based authentication for operators
- **Request Management**: View, filter, and search all requests
- **Status Updates**: Update request status with notes
- **Dashboard Analytics**: Real-time statistics and charts
- **CSV Export**: Export request data for reporting
- **WhatsApp Integration**: Automatic notifications on status changes

### ✅ Backend Features
- **Database Schema**: Complete Supabase setup with RLS policies
- **API Service**: Comprehensive service layer for all operations
- **WhatsApp API**: Meta Cloud API integration for notifications
- **File Storage**: Secure document storage with access controls
- **Audit Trail**: Complete operator notes and status change history

## Database Schema

### Tables
1. **profiles**: User profiles with roles (user, operator, admin)
2. **service_requests**: Main requests table with all metadata
3. **operator_notes**: Audit trail for status changes and notes
4. **storage.buckets**: Document storage configuration

### Enums
- **service_type**: 8 different document types
- **request_status**: pending, on_process, completed, cancelled
- **user_role**: user, operator, admin

## API Services

### `layananApi` Service
Located in `src/services/layananApi.ts`

**Key Methods:**
- `createRequest()`: Submit new service request
- `getRequestByNIK()`: Status checking by NIK
- `getRequests()`: Get all requests with filters
- `updateRequest()`: Update status and send notifications
- `getDashboardStats()`: Analytics and reporting
- `exportRequestsToCSV()`: Data export functionality

### `whatsappService` Service
Located in `src/services/whatsapp.ts`

**Key Methods:**
- `sendStatusUpdateNotification()`: Send status updates via WhatsApp
- `sendTextMessage()`: Send custom text messages
- `sendTemplateMessage()`: Send template-based messages

## User Flow

### 1. User Request Submission
```
User → Layanan Mandiri → Select Service → Requirements Page → 
Fill Form → Upload Documents → Submit → Get Request Number
```

### 2. Status Tracking
```
User → Status Tracker → Enter NIK → View Request Details
```

### 3. Operator Management
```
Operator → Login → Dashboard → View Requests → 
Update Status → Add Notes → WhatsApp Notification Sent
```

## WhatsApp Integration

### Setup Required
1. **Meta Developer Account**: Create app in Meta Developer Console
2. **WhatsApp Business API**: Configure phone number and templates
3. **Environment Variables**: Set API credentials

### Environment Variables
```env
VITE_WHATSAPP_API_URL=https://graph.facebook.com/v18.0
VITE_WHATSAPP_API_KEY=your_whatsapp_business_api_key
VITE_WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
```

### Notification Flow
1. Operator updates request status
2. System automatically sends WhatsApp message
3. User receives notification with status and notes
4. Message includes pickup instructions for completed requests

## Security Features

### Row Level Security (RLS)
- Users can only view their own requests
- Operators can view all requests
- Public access for NIK-based status checking
- Secure document storage with user-based access

### Authentication
- Supabase Auth integration
- Role-based access control
- Secure operator login system

## Operator Dashboard

### Features
- **Login System**: Secure operator authentication
- **Dashboard**: Real-time statistics and charts
- **Request Management**: List, filter, search, and update requests
- **Detail View**: Complete request information with documents
- **Status Updates**: Change status with notes and notifications
- **Export**: CSV export with filtering options

### Dashboard Sections
1. **Overview**: Statistics cards and charts
2. **Requests**: List with filters and search
3. **Reports**: Export and analytics tools

## File Structure

```
src/
├── services/
│   ├── layananApi.ts      # Main API service
│   └── whatsapp.ts        # WhatsApp integration
├── pages/
│   ├── LayananMandiri.tsx # User interface
│   └── OperatorDashboard.tsx # Operator interface
├── components/
│   ├── ServiceRequestForm.tsx # Request submission
│   └── StatusTracker.tsx      # Status checking
└── integrations/
    └── supabase/          # Database configuration
```

## Setup Instructions

### 1. Database Setup
The Supabase migrations are already configured. Run:
```bash
supabase db push
```

### 2. WhatsApp API Setup
1. Create Meta Developer account
2. Set up WhatsApp Business API
3. Configure environment variables
4. Test notification system

### 3. Operator Accounts
Create operator accounts in Supabase:
```sql
INSERT INTO profiles (user_id, full_name, role) 
VALUES ('user-uuid', 'Operator Name', 'operator');
```

### 4. Storage Configuration
Storage bucket is automatically created with proper policies.

## Testing

### User Flow Testing
1. Submit a test request
2. Check status with NIK
3. Verify document upload

### Operator Flow Testing
1. Login as operator
2. View and filter requests
3. Update status with notes
4. Verify WhatsApp notification

### WhatsApp Testing
1. Use test phone numbers
2. Verify message delivery
3. Check notification content

## Deployment

### Environment Setup
1. Configure all environment variables
2. Set up WhatsApp API credentials
3. Configure Supabase project settings

### Production Considerations
- Monitor WhatsApp API limits
- Set up error logging
- Configure backup systems
- Monitor storage usage

## Monitoring and Maintenance

### Key Metrics
- Request volume by service type
- Processing times
- WhatsApp delivery rates
- Storage usage

### Maintenance Tasks
- Regular database backups
- Monitor API usage limits
- Update WhatsApp templates
- Review and clean old data

## Troubleshooting

### Common Issues
1. **WhatsApp API Errors**: Check credentials and limits
2. **Upload Failures**: Verify storage permissions
3. **Authentication Issues**: Check user roles
4. **Notification Failures**: Verify phone number format

### Debug Tools
- Supabase dashboard for database queries
- WhatsApp API logs for message delivery
- Browser console for frontend errors

## Future Enhancements

### Potential Improvements
- SMS fallback for WhatsApp failures
- Advanced reporting and analytics
- Mobile app development
- Integration with government systems
- Multi-language support
- Advanced document validation

### Scalability Considerations
- Database optimization for large datasets
- CDN for document storage
- Caching for frequently accessed data
- Load balancing for high traffic

## Support

For technical support or questions about the implementation, refer to:
- Supabase documentation
- Meta WhatsApp Business API docs
- React and TypeScript documentation
