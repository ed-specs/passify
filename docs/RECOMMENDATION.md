# Passify - Security & Functionality Recommendations

## 🔒 SECURITY RECOMMENDATIONS

### Critical Priority

#### 1. **Input Validation & Sanitization**

- **Issue**: No input validation on email, password, or password fields
- **Risk**: XSS attacks, SQL injection, malformed data
- **Recommendation**:
  ```javascript
  // Create a validation utility
  // src/lib/validators.js
  export const validators = {
    isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    isStrongPassword: (pwd) =>
      pwd.length >= 12 &&
      /[A-Z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[^A-Za-z0-9]/.test(pwd),
    sanitizeInput: (input) => DOMPurify.sanitize(input),
  };
  ```
- **Library**: Install `dompurify` and `validator`
  ```bash
  npm install dompurify validator
  ```

#### 2. **Environment Variables Security**

- **Issue**: Missing validation for required env variables at startup
- **Risk**: App crashes in production without proper secrets
- **Recommendation**:

  ```javascript
  // src/lib/validateEnv.js
  export function validateEnv() {
    const requiredEnvs = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ];

    requiredEnvs.forEach((env) => {
      if (!process.env[env]) {
        throw new Error(`Missing required environment variable: ${env}`);
      }
    });
  }
  ```

#### 3. **Password Strength Requirements**

- **Issue**: No minimum complexity enforced
- **Risk**: Weak passwords compromise vault security
- **Recommendation**:
  - Minimum 12 characters
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character
  - Implement visual strength meter component

#### 4. **Secure Cookie Configuration**

- **Issue**: Cookies not configured with secure flags
- **Recommendation** (in middleware.js):
  ```javascript
  response.cookies.set({
    name,
    value,
    httpOnly: true, // Prevent JS access
    secure: true, // HTTPS only
    sameSite: "strict", // CSRF protection
    maxAge: 86400 * 7, // 7 days
    ...options,
  });
  ```

#### 5. **Rate Limiting**

- **Issue**: No protection against brute force attacks
- **Risk**: Account takeover via password guessing
- **Recommendation**:
  ```bash
  npm install express-rate-limit
  ```
  Implement rate limiting on:
  - Login attempts (max 5 per 15 minutes)
  - Password vault API calls (max 100 per minute)
  - Account creation (max 3 per hour per IP)

#### 6. **Error Handling - Sensitive Data Exposure**

- **Issue**: Error messages expose sensitive information
- **Risk**: Information disclosure attacks
- **Current Problem in LoginForm.jsx & CreateAccountForm.jsx**:

  ```javascript
  // ❌ BAD - exposes database/auth errors
  onAuthError(err.message);

  // ✅ GOOD - generic messages
  onAuthError("Invalid email or password");
  ```

- **Recommendation**: Create error mapping function:
  ```javascript
  // src/lib/errorMessages.js
  export const getPublicErrorMessage = (error) => {
    const errorMap = {
      invalid_grant: "Invalid email or password",
      user_already_exists: "Email already in use",
      weak_password: "Password does not meet requirements",
      // ... more mappings
    };
    return errorMap[error.code] || "An error occurred. Please try again.";
  };
  ```

#### 7. **CORS Configuration**

- **Issue**: No explicit CORS policy defined
- **Recommendation** (next.config.mjs):
  ```javascript
  export default {
    headers: async () => [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_APP_URL,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
        ],
      },
    ],
  };
  ```

#### 8. **CSRF Protection**

- **Issue**: Middleware doesn't validate CSRF tokens
- **Recommendation**:
  ```bash
  npm install csrf
  ```
  Generate and validate CSRF tokens for all state-changing operations.

#### 9. **Middleware Route Protection Issues**

- **Issue**: Middleware has incorrect logic - `isPublicPage` and `isAuthPage` overlap
- **Current Problem**:
  ```javascript
  const isPublicPage = pathname === "/" || pathname.startsWith("/");
  // This catches ALL routes!
  ```
- **Fix**:

  ```javascript
  const isPublicPage = pathname === "/" || pathname === "/create-account";
  const isAuthPage = pathname === "/" || pathname === "/create-account";

  // For protected routes
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  ```

#### 10. **Password Encryption at Rest**

- **Issue**: Passwords might not be encrypted in Supabase
- **Recommendation**:
  - Enable Supabase RLS (Row Level Security) on `passwords` table
  - Add `created_at`, `updated_at` audit columns
  - Encrypt sensitive fields before storing:

  ```javascript
  // Install encryption library
  npm install crypto-js

  // Encrypt before sending to Supabase
  const encrypted = CryptoJS.AES.encrypt(password, encryptionKey).toString();
  ```

#### 11. **Account Lockout Mechanism**

- **Issue**: No protection after multiple failed login attempts
- **Recommendation**:
  - Lock account after 5 failed attempts
  - Unlock after 30 minutes or via email
  - Notify user of suspicious activity

#### 12. **Two-Factor Authentication (2FA)**

- **Issue**: Single factor authentication is not secure for password manager
- **Recommendation**:
  ```bash
  npm install speakeasy qrcode
  ```
  Implement:
  - TOTP (Time-based One-Time Password)
  - Recovery codes backup
  - 2FA management in settings

### High Priority

#### 13. **Sensitive Data in localStorage**

- **Issue**: Session tokens stored in accessible localStorage
- **Risk**: XSS attacks can steal tokens
- **Recommendation**:
  - Rely on httpOnly cookies instead
  - Use Supabase SSR (@supabase/ssr) properly
  - Store minimal data in localStorage

#### 14. **HTTPS/TLS Enforcement**

- **Issue**: No enforcement of HTTPS connections
- **Recommendation** (next.config.mjs):
  ```javascript
  export default {
    // ... other config
    redirects: async () => [
      {
        source: "/:path*",
        destination: "https://:host/:path*",
        permanent: true,
      },
    ],
  };
  ```

#### 15. **Security Headers**

- **Recommendation** (next.config.mjs):
  ```javascript
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "Content-Security-Policy", value: "default-src 'self'" },
      ],
    },
  ];
  ```

#### 16. **Database Row Level Security (RLS)**

- **Issue**: No RLS policies on Supabase tables
- **Recommendation**: In Supabase Dashboard:

  ```sql
  -- Enable RLS on passwords table
  ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

  -- Only users can see their own passwords
  CREATE POLICY "Users can only see their own passwords"
  ON passwords FOR SELECT
  USING (auth.uid() = user_id);

  -- Only users can insert their own passwords
  CREATE POLICY "Users can only insert their own passwords"
  ON passwords FOR INSERT
  WITH CHECK (auth.uid() = user_id);
  ```

#### 17. **Activity Logging & Audit Trail**

- **Issue**: No logging of password access/changes
- **Risk**: Can't detect unauthorized access
- **Recommendation**:
  ```javascript
  // Create audit log service
  // src/services/auditService.js
  export const auditService = {
    async logAccess(action, resourceId, status) {
      await supabase.from("audit_logs").insert({
        user_id: userId,
        action,
        resource_id: resourceId,
        status,
        timestamp: new Date(),
        ip_address: getClientIP(),
        user_agent: getUserAgent(),
      });
    },
  };
  ```

#### 18. **Secrets Management**

- **Issue**: Anon key visible in environment
- **Recommendation**:
  - Create API route handlers for sensitive operations
  - Use service role key in backend only (never expose)
  - Use row-level security instead of relying on anon key

---

## ⚡ FUNCTIONALITY RECOMMENDATIONS

### Must-Have Features

#### 1. **Password Generator**

- **Component**: `src/components/PasswordGenerator.jsx`
- **Features**:
  - Customizable length (8-128 characters)
  - Include/exclude special characters, numbers, uppercase
  - Copy-to-clipboard button
  - Strength indicator
  ```javascript
  // Generate random password
  const generatePassword = (length, options) => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = lowercase;
    if (options.uppercase) chars += uppercase;
    if (options.numbers) chars += numbers;
    if (options.special) chars += special;

    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  };
  ```

#### 2. **Password Strength Indicator**

- **Component**: `src/components/PasswordStrengthMeter.jsx`
- **Features**:
  - Score from 0-100
  - Visual bar with colors (red < 30, yellow 30-60, green > 60)
  - Suggestions for improvement
  - Check against common passwords

#### 3. **Search & Filter Functionality**

- **Issue**: SearchBarInputField component exists but no backend search
- **Recommendation**:
  ```javascript
  // Implement full-text search in password vault
  const filteredPasswords = await supabase
    .from("passwords")
    .select("*")
    .or(`title.ilike.%${searchQuery}%,account_name.ilike.%${searchQuery}%`)
    .eq("user_id", userId);
  ```

#### 4. **Bulk Operations**

- **Features**:
  - Select multiple passwords
  - Bulk delete
  - Bulk export
  - Bulk move to category
- **Component**: Add checkboxes to PasswordCard

#### 5. **Export/Import Passwords**

- **Format**: CSV or JSON (encrypted)
- **Features**:
  - Export all passwords securely
  - Import with validation
  - Backup scheduling
  ```javascript
  // src/lib/exportService.js
  export const exportPasswords = (passwords, format = "csv") => {
    if (format === "csv") {
      const csv =
        "title,account_name,password,notes\n" +
        passwords
          .map((p) => `"${p.title}","${p.account_name}","***","${p.notes}"`)
          .join("\n");
      downloadFile(csv, "passwords.csv");
    }
  };
  ```

#### 6. **Real-time Sync & Offline Support**

- **Issue**: No offline access or real-time updates
- **Recommendation**:
  ```bash
  npm install workbox-window
  ```
  Implement PWA with:
  - Service worker for offline caching
  - Real-time sync via Supabase subscriptions
  - Conflict resolution for concurrent edits

#### 7. **Pagination & Infinite Scroll**

- **Issue**: All passwords loaded at once
- **Recommendation** for password vault:

  ```javascript
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: passwords } = await supabase
    .from("passwords")
    .select("*")
    .range((page - 1) * pageSize, page * pageSize - 1);
  ```

#### 8. **Categories & Tags**

- **Features**:
  - Create custom categories
  - Tag passwords (e.g., #work, #personal)
  - Filter by category/tag
  - Category-based organization

#### 9. **Password History & Recovery**

- **Features**:
  - Track password changes
  - Restore previous versions
  - Delete history entries
  ```sql
  CREATE TABLE password_history (
    id UUID PRIMARY KEY,
    password_id UUID REFERENCES passwords(id),
    old_password TEXT,
    changed_at TIMESTAMP,
    changed_by_user UUID
  );
  ```

#### 10. **Notifications & Alerts**

- **Features**:
  - Alert for suspicious login attempts
  - Expiring password reminders
  - Security recommendations
  - Email notifications

#### 11. **Settings Page Implementation**

- **Currently Empty** - Add:
  - Change password
  - Enable/disable 2FA
  - Session management (active sessions, device info)
  - Privacy settings
  - Export/backup options
  - Account deletion

#### 12. **Profile Picture Upload**

- **Issue**: Profile picture flow exists but not implemented
- **Implement using Supabase Storage**:
  ```javascript
  // src/services/profileService.js
  export const uploadProfilePicture = async (file) => {
    const fileName = `${userId}-${Date.now()}`;
    const { data, error } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, file);

    if (!error) {
      // Update user profile with new image URL
    }
  };
  ```

#### 13. **Password Sharing Capabilities**

- **Features**:
  - Share passwords securely with team members
  - Expiring share links
  - View-only access
  - Audit log of shares

#### 14. **Master Password Option**

- **Enhanced Security**:
  - Optional master password on top of Supabase auth
  - Required on every session or periodic re-authentication
  - Use only app-side encryption key

---

## 🛠️ CODE QUALITY RECOMMENDATIONS

### 1. **Error Boundary Component**

- **Create**: `src/components/ErrorBoundary.jsx`
- **Purpose**: Catch uncaught errors gracefully
- **Usage**: Wrap app/pages with error boundary

### 2. **Logger Service**

- **Create**: `src/lib/logger.js`
- **Features**:
  - Structured logging
  - Log levels (debug, info, warn, error)
  - Send to monitoring service
  ```javascript
  export const logger = {
    error: (msg, metadata) => console.error(msg, metadata),
    warn: (msg) => console.warn(msg),
    info: (msg) => console.log(msg),
  };
  ```

### 3. **API Route Handlers**

- **Create**: `src/app/api/` routes
- **Purpose**: Handle sensitive operations server-side
- **Examples**:
  ```
  /api/passwords/add
  /api/passwords/delete/[id]
  /api/passwords/update/[id]
  /api/auth/refresh-session
  /api/audit/log
  ```

### 4. **Type Safety with TypeScript**

- **Recommendation**: Convert to TypeScript
  ```bash
  npm install -D typescript @types/react @types/react-dom @types/node
  ```
- **Create**: `tsconfig.json` and start typing components

### 5. **Testing Setup**

- **Testing Framework**: Jest + React Testing Library
  ```bash
  npm install -D @testing-library/react @testing-library/jest-dom jest
  ```
- **Test Files**: `__tests__/` folder for each component/service

### 6. **Linting & Formatting**

- **Install**:
  ```bash
  npm install -D eslint prettier eslint-config-prettier eslint-plugin-react
  ```
- **Create**: `.eslintrc.json` and `.prettierrc`

---

## 📊 MONITORING & ANALYTICS

### 1. **Error Tracking**

- **Service**: Sentry
  ```bash
  npm install @sentry/nextjs
  ```

### 2. **Performance Monitoring**

- **Service**: Web Vitals
  ```bash
  npm install web-vitals
  ```

### 3. **User Analytics**

- **Track**: Feature usage, user flows
- **Service**: Mixpanel or PostHog (privacy-friendly)

---

## 📋 IMMEDIATE ACTION ITEMS

**Week 1:**

- [ ] Implement input validation
- [ ] Fix middleware route protection
- [ ] Add error message mapping
- [ ] Configure secure cookies
- [ ] Add environment variable validation

**Week 2:**

- [ ] Implement password strength requirements
- [ ] Add password generator
- [ ] Set up rate limiting
- [ ] Configure security headers
- [ ] Implement RLS on Supabase

**Week 3:**

- [ ] Add 2FA support
- [ ] Implement audit logging
- [ ] Create API route handlers
- [ ] Add error boundary
- [ ] Set up error tracking (Sentry)

**Week 4+:**

- [ ] Add pagination
- [ ] Implement search improvements
- [ ] Add bulk operations
- [ ] Create export/import
- [ ] Implement PWA & offline support

---

## 📚 USEFUL LIBRARIES TO ADD

```bash
npm install \
  dompurify \
  validator \
  express-rate-limit \
  speakeasy \
  qrcode \
  crypto-js \
  workbox-window \
  sentry \
  web-vitals
```

---

## ✅ TESTING CHECKLIST

- [ ] Login/Register with invalid inputs
- [ ] SQL injection attempts
- [ ] XSS payload in input fields
- [ ] CSRF attack simulation
- [ ] Brute force login attempts
- [ ] Logout functionality
- [ ] Session expiration
- [ ] Middleware routing logic
- [ ] Mobile responsiveness
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Performance (Lighthouse score > 90)
- [ ] Security headers present
- [ ] HTTPS only
- [ ] Cookie security
