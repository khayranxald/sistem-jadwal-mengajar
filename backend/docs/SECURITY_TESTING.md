# Security Testing Checklist

## 🔒 Authentication & Authorization

### ✅ Backend (Laravel)
- [ ] Password hashing menggunakan bcrypt
- [ ] JWT/Sanctum token expiration
- [ ] Rate limiting pada login endpoint
- [ ] CSRF protection enabled
- [ ] Session security configured
- [ ] Role-based access control (RBAC) implemented
- [ ] API authentication required for protected routes

### ✅ Frontend (React)
- [ ] Token stored securely (not in localStorage for production)
- [ ] Auto logout on token expiration
- [ ] Protected routes check authentication
- [ ] Role-based UI rendering
- [ ] Secure password input (no autocomplete)

## 🛡️ Input Validation & Sanitization

### ✅ Backend
- [ ] All inputs validated using Laravel Request classes
- [ ] SQL injection prevention (using Eloquent ORM)
- [ ] XSS prevention (output escaping)
- [ ] File upload validation (type, size, extension)
- [ ] Email validation
- [ ] Phone number sanitization

### ✅ Frontend
- [ ] Client-side validation before API calls
- [ ] Prevent XSS in user-generated content
- [ ] Sanitize HTML rendering
- [ ] Form input constraints (maxlength, pattern)

## 🔐 Data Protection

### ✅ Database
- [ ] Sensitive data encrypted
- [ ] Secure database credentials
- [ ] Regular backups configured
- [ ] Migration files don't expose sensitive data

### ✅ API
- [ ] HTTPS enforced (production)
- [ ] CORS properly configured
- [ ] API rate limiting
- [ ] Request size limits
- [ ] Response doesn't leak sensitive info

## 🚨 Common Vulnerabilities

### ✅ Prevent SQL Injection
```php
// ❌ Bad
DB::raw("SELECT * FROM users WHERE id = " . $id);

// ✅ Good
User::find($id);
User::where('id', $id)->first();
```

### ✅ Prevent XSS
```jsx
// ❌ Bad
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Good
<div>{userInput}</div>
```

### ✅ Prevent CSRF
```php
// Laravel automatically handles CSRF for web routes
// For API, use Sanctum tokens
```

### ✅ Prevent Mass Assignment
```php
// ❌ Bad
User::create($request->all());

// ✅ Good
User::create($request->validated());
```

## 🔍 Security Headers

### ✅ Required Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

## 📝 Testing Commands

### Backend Security Scan
```bash
# Check for vulnerabilities
composer audit

# Run security tests
php artisan test --filter Security
```

### Frontend Security Scan
```bash
# Check npm packages for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check for outdated packages
npm outdated
```

### Manual Security Tests
1. **Authentication Bypass**
   - Try accessing admin routes as guest
   - Try accessing other user's data
   - Try expired tokens

2. **Authorization Bypass**
   - Try guru accessing admin endpoints
   - Try modifying other user's data

3. **Input Validation**
   - SQL injection attempts
   - XSS script injections
   - File upload with malicious files

4. **Rate Limiting**
   - Multiple failed login attempts
   - API spam requests

## 🎯 Security Best Practices

### ✅ Backend
- Keep Laravel and dependencies updated
- Use environment variables for secrets
- Enable error logging (but hide in production)
- Implement proper exception handling
- Use HTTPS in production
- Disable debug mode in production
- Regular security audits

### ✅ Frontend
- Keep React and dependencies updated
- Sanitize all user inputs
- Implement Content Security Policy
- Use secure cookies
- Avoid storing sensitive data in localStorage
- Implement proper error boundaries

## 🔧 Tools for Security Testing

1. **OWASP ZAP** - Web application security scanner
2. **Burp Suite** - Security testing toolkit
3. **npm audit** - Check for vulnerable packages
4. **Snyk** - Find and fix vulnerabilities
5. **SonarQube** - Code quality and security

## 📊 Security Testing Report Template

```markdown
## Security Test Report

**Date:** [Date]
**Tester:** [Name]
**Version:** [App Version]

### Summary
- Total Tests: X
- Passed: Y
- Failed: Z
- Critical Issues: N

### Critical Issues Found
1. [Issue description]
   - Severity: High/Medium/Low
   - Status: Open/Fixed
   - Fix: [Description]

### Recommendations
1. [Recommendation 1]
2. [Recommendation 2]

### Next Steps
- [ ] Fix critical issues
- [ ] Re-test failed cases
- [ ] Update security documentation
```