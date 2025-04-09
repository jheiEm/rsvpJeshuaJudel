# Wedding Website Admin Dashboard Guide

This guide explains how to access and use the admin dashboard to view and manage RSVPs for your wedding.

## Accessing the Admin Dashboard

1. Navigate to your wedding website's admin login page:
   - If running locally: `http://localhost:5000/admin/login`
   - If deployed: `https://your-wedding-site.com/admin/login`

2. Login using the default credentials:
   - Username: `admin`
   - Password: `wedding2025`

## Dashboard Features

The admin dashboard provides the following features:

### 1. RSVP Management

- View all submitted RSVPs in a table format
- See guest details including:
  - Names
  - Email addresses
  - Phone numbers
  - RSVP status (attending/not attending)
  - Number of guests
  - Additional guest names
  - Dietary restrictions
  - Messages left by guests

### 2. Data Export

- Export all RSVP data to CSV for use in spreadsheet applications
- Use the data for:
  - Creating seating charts
  - Planning meal counts
  - Sending follow-up communications

## Changing Admin Password

For security reasons, you may want to change the default admin password:

1. Open the file `server/routes.ts`
2. Locate the admin authentication section (around line 50-60)
3. Replace the default admin credentials with your preferred credentials
4. Save the file and restart the server

Example code to modify:
```typescript
// Find this code
if (username === "admin" && password === "wedding2025") {
  req.session.adminAuthenticated = true;
  return res.json({ success: true });
}

// Replace with your credentials
if (username === "your-username" && password === "your-secure-password") {
  req.session.adminAuthenticated = true;
  return res.json({ success: true });
}
```

## Security Considerations

1. **Change Default Credentials**: Always change the default username and password
2. **Use HTTPS**: If deploying to production, ensure your site uses HTTPS
3. **Limit Access**: Only share admin credentials with trusted individuals
4. **Regular Backups**: Export RSVP data regularly to avoid loss

## Troubleshooting

If you encounter issues with the admin dashboard:

1. **Login Issues**:
   - Ensure you're using the correct credentials
   - Check if cookies are enabled in your browser
   - Clear browser cache and try again

2. **Empty RSVP List**:
   - If no RSVPs are showing, it might mean no one has submitted an RSVP yet
   - Test the RSVP form yourself to ensure it's working correctly

3. **Server Errors**:
   - Check server logs for error messages
   - Ensure the database connection is working properly

## Data Privacy

Remember that your wedding website collects personal information from your guests. Best practices include:

1. Only collect information you genuinely need
2. Be transparent about how you'll use the information
3. Don't share guest information with third parties
4. Delete the data after your wedding if it's no longer needed

## Additional Customization

The admin dashboard can be customized further if needed:

1. **Custom Columns**: Add or remove columns in the dashboard table
2. **Filtering Options**: Add ability to filter RSVPs by status or other criteria
3. **Detailed Views**: Create detailed view pages for individual RSVPs

For these customizations, you would need to modify the files in `client/src/pages/admin/` directory.

If you need assistance with these customizations, contact a web developer or refer to the React documentation.

---

Happy wedding planning! 💍