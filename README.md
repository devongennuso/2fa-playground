# 2fa-playground

# An attempt to showcase two-factor authentication with node.js - a work in progress
1. npm install
2. change routes/users.js to your gmail credentials
```javascript
  var mailData = {
      from: 'your@email.com',
      to: 'your@email.com', // or req.session.currentUser.email
      subject: 'Secure Code',
      text: 'Your Secure Sign-In Code: ' + secureCode
    };

    var transporter = nodemailer.createTransport('smtps://user%40gmail.com:password@stmp.gmail.com');
```
3. node app.js

1. Sign Up
2. Login in with email and password
3. Confirm email address and send secure code
4. Login with email, password, and secure code
