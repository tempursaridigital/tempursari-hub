# Quick Start Guide - Layanan Mandiri Backend

## 🚀 Getting Started

### 1. Development Server
The development server should now be running. You can access:
- **Main Application**: http://localhost:5173
- **Layanan Mandiri**: http://localhost:5173/layanan-mandiri
- **Operator Dashboard**: http://localhost:5173/operator

### 2. Testing the User Flow

#### Step 1: Submit a Service Request
1. Go to `/layanan-mandiri`
2. Click "Ajukan Permohonan Baru"
3. Select a service type (e.g., "Surat Pengantar KTP")
4. Fill out the form with test data:
   - Nama: "Test User"
   - NIK: "1234567890123456"
   - Nomor HP: "081234567890"
5. Upload a test document (image or PDF)
6. Submit the request
7. Note the request number

#### Step 2: Check Status
1. Go back to the main menu
2. Click "Cek Status Permohonan"
3. Enter the NIK used in the request
4. View the request details

### 3. Testing the Operator Dashboard

#### Step 1: Create Operator Account
You'll need to create an operator account in Supabase:

1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Create a new user or use an existing one
4. In the SQL editor, run:
```sql
INSERT INTO profiles (user_id, full_name, role) 
VALUES ('your-user-id', 'Test Operator', 'operator');
```

#### Step 2: Access Operator Dashboard
1. Go to `/operator`
2. Login with the operator credentials
3. View the dashboard with statistics
4. Navigate to "Permohonan" tab to see requests
5. Click "Detail" on any request to view and update status

### 4. WhatsApp Integration Setup

#### For Testing (Optional)
1. Create a Meta Developer account
2. Set up WhatsApp Business API
3. Create a `.env` file with your credentials:
```env
VITE_WHATSAPP_API_URL=https://graph.facebook.com/v18.0
VITE_WHATSAPP_API_KEY=your_api_key
VITE_WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
```

#### For Development (Mock Mode)
The system will work without WhatsApp API - notifications will be logged to console.

### 5. Database Setup

The Supabase migrations are already configured. If you need to reset:
```bash
supabase db reset
```

### 6. Common Test Scenarios

#### Scenario 1: Complete User Journey
1. Submit request → Get request number
2. Check status with NIK
3. Login as operator
4. Update status to "Diproses"
5. Add notes
6. Update status to "Selesai"
7. Check WhatsApp notification (if configured)

#### Scenario 2: Multiple Requests
1. Submit multiple requests with different service types
2. Test filtering in operator dashboard
3. Export CSV data
4. View dashboard statistics

#### Scenario 3: Error Handling
1. Try submitting without required fields
2. Test invalid NIK format
3. Test file upload limits
4. Test operator access restrictions

### 7. Troubleshooting

#### Development Server Issues
```bash
# If vite is not recognized
npm install
npx vite
```

#### "Gagal mengirim permohonan" Error
If you get this error when submitting a request:

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Run the SQL script from `fix_anonymous_requests.sql`**
4. **This will allow anonymous submissions without authentication**

The error occurs because the system requires user authentication by default. The SQL script fixes this by allowing public submissions.

#### Database Issues
```bash
# Reset database
supabase db reset
```

#### Authentication Issues
- Check Supabase project settings
- Verify RLS policies are enabled
- Check user roles in profiles table

#### File Upload Issues
- Check storage bucket permissions
- Verify file size limits
- Check CORS settings

### 8. Next Steps

1. **Production Deployment**: Set up proper environment variables
2. **WhatsApp API**: Configure real WhatsApp Business API
3. **Security**: Review and test RLS policies
4. **Monitoring**: Set up error logging and analytics
5. **Testing**: Create comprehensive test suite

### 9. Support

- Check the `LAYANAN_BACKEND_README.md` for detailed documentation
- Review Supabase dashboard for database issues
- Check browser console for frontend errors
- Monitor network tab for API calls

---

**Happy Testing! 🎉**
