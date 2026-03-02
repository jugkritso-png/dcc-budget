import jwt from 'jsonwebtoken';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbGh4c3h1Ynh5bXhwbnhlcXRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODAwNSwiZXhwIjoyMDg3MDU0MDA1fQ.DAQAUt3sFVVhMLmiTR_oLPQP1pK2aaxte6vtmEUIupE";
const secret = process.env.JWT_SECRET || 'dcc-secret-key-change-in-prod';

try {
  jwt.verify(token, secret, { algorithms: ['HS256'] });
  console.log("Verified successfully!");
} catch (e) {
  console.error(e);
}
